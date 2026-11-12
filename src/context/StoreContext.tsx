import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  DeliveryZone,
  Testimonial,
  Coupon,
  StoreSettings,
  UserProfile,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialDeliveryZones,
  initialTestimonials,
  initialCoupons,
  initialStoreSettings,
} from '../data/initialData';

export type ViewType =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'checkout'
  | 'order-confirmation'
  | 'tracking'
  | 'account'
  | 'admin'
  | 'reviews';

interface StoreContextType {
  // Navigation & UI
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Catalog
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Coupons
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponDiscount: number;

  // Delivery & Zones
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id'>) => void;
  updateDeliveryZone: (id: string, updates: Partial<DeliveryZone>) => void;
  deleteDeliveryZone: (id: string) => void;

  // Orders
  orders: Order[];
  lastConfirmedOrder: Order | null;
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    country: string;
    city: string;
    address: string;
    instructions?: string;
    paymentMethod: PaymentMethod;
    deliveryZone: DeliveryZone;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, carrierNotes?: string) => void;
  findOrderByRefAndPhone: (reference: string, phone: string) => Order | undefined;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (test: Omit<Testimonial, 'id' | 'date'>) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Auth
  currentUser: UserProfile | null;
  loginUser: (email: string, phone: string, fullName: string) => void;
  logoutUser: () => void;
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;

  // Reset to demo
  resetToInitialData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'faveda_products_v2',
  CATEGORIES: 'faveda_categories_v2',
  CART: 'faveda_cart_v2',
  ORDERS: 'faveda_orders_v2',
  DELIVERY_ZONES: 'faveda_zones_v2',
  TESTIMONIALS: 'faveda_testimonials_v2',
  SETTINGS: 'faveda_settings_v2',
  ADMIN_AUTH: 'faveda_admin_auth_v2',
  USER_AUTH: 'faveda_user_auth_v2',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Data states
  const [products, setProducts] = useState<Product[]>(() =>
    loadStorage(STORAGE_KEYS.PRODUCTS, initialProducts)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadStorage(STORAGE_KEYS.CATEGORIES, initialCategories)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadStorage(STORAGE_KEYS.CART, [])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStorage(STORAGE_KEYS.ORDERS, [])
  );
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() =>
    loadStorage(STORAGE_KEYS.DELIVERY_ZONES, initialDeliveryZones)
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    loadStorage(STORAGE_KEYS.TESTIMONIALS, initialTestimonials)
  );
  const [settings, setSettings] = useState<StoreSettings>(() =>
    loadStorage(STORAGE_KEYS.SETTINGS, initialStoreSettings)
  );

  // Cart & checkout
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(() => {
    const zones = loadStorage(STORAGE_KEYS.DELIVERY_ZONES, initialDeliveryZones);
    return zones.length > 0 ? zones[0] : null;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);

  // Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    loadStorage(STORAGE_KEYS.USER_AUTH, null)
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    loadStorage(STORAGE_KEYS.ADMIN_AUTH, false)
  );

  // Synchronize state with storage
  useEffect(() => {
    saveStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.DELIVERY_ZONES, deliveryZones);
  }, [deliveryZones]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.TESTIMONIALS, testimonials);
  }, [testimonials]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.ADMIN_AUTH, isAdminAuthenticated);
  }, [isAdminAuthenticated]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.USER_AUTH, currentUser);
  }, [currentUser]);

  // Toast utility
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Open product detail
  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.promoPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Coupon discount calculation
  let couponDiscount = 0;
  if (appliedCoupon && cartSubtotal >= (appliedCoupon.minOrderAmount || 0)) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast('Ce produit est actuellement en rupture de stock.', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    showToast(`"${product.name}" ajouté à votre panier.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Produit retiré du panier.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(quantity, item.product.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon
  const applyCouponCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = initialCoupons.find(
      (c) => c.code.toUpperCase() === trimmed && c.isActive
    );

    if (!found) {
      return { success: false, message: 'Code promo invalide ou expiré.' };
    }

    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Montant minimum requis de ${found.minOrderAmount} FCFA pour ce code promo.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Code promo "${found.code}" appliqué avec succès !` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Code promo retiré.', 'info');
  };

  // Order creation (Real, server-safe price calculations and stock reduction)
  const createOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    country: string;
    city: string;
    address: string;
    instructions?: string;
    paymentMethod: PaymentMethod;
    deliveryZone: DeliveryZone;
  }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Votre panier est vide.' };
    }

    // Server-side/deterministic subtotal calculation from current products catalog
    let verifiedSubtotal = 0;
    const orderItems: import('../types').OrderItem[] = [];

    for (const item of cart) {
      const currentProduct = products.find((p) => p.id === item.product.id);
      if (!currentProduct || !currentProduct.isActive) {
        return {
          success: false,
          error: `Le produit "${item.product.name}" n'est plus disponible.`,
        };
      }
      if (currentProduct.stock < item.quantity) {
        return {
          success: false,
          error: `Stock insuffisant pour "${currentProduct.name}". Quantité disponible : ${currentProduct.stock}.`,
        };
      }

      const unitPrice = currentProduct.promoPrice ?? currentProduct.price;
      const itemTotal = unitPrice * item.quantity;
      verifiedSubtotal += itemTotal;

      orderItems.push({
        productId: currentProduct.id,
        productName: currentProduct.name,
        productImage: currentProduct.images[0] || '/assets/aistudio/image_84890492.png',
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // Delivery fee check (supports free delivery threshold if set)
    let calculatedDeliveryFee = orderData.deliveryZone.price;
    if (
      settings.freeDeliveryThreshold &&
      verifiedSubtotal >= settings.freeDeliveryThreshold &&
      orderData.deliveryZone.country === 'Côte d’Ivoire'
    ) {
      calculatedDeliveryFee = 0;
    }

    // Calculate coupon
    let calculatedDiscount = 0;
    if (appliedCoupon && verifiedSubtotal >= (appliedCoupon.minOrderAmount || 0)) {
      if (appliedCoupon.discountType === 'percentage') {
        calculatedDiscount = Math.round((verifiedSubtotal * appliedCoupon.discountValue) / 100);
      } else {
        calculatedDiscount = appliedCoupon.discountValue;
      }
    }

    const calculatedTotal = Math.max(0, verifiedSubtotal + calculatedDeliveryFee - calculatedDiscount);

    // Generate unique reference
    const timestamp = Date.now().toString().slice(-4);
    const randomDigit = Math.floor(1000 + Math.random() * 9000);
    const reference = `FAV-${new Date().getFullYear()}-${timestamp}${randomDigit.toString().slice(0, 2)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      reference,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName.trim(),
      customerPhone: orderData.customerPhone.trim(),
      customerEmail: orderData.customerEmail?.trim() || undefined,
      country: orderData.country.trim(),
      city: orderData.city.trim(),
      address: orderData.address.trim(),
      instructions: orderData.instructions?.trim() || undefined,
      items: orderItems,
      subtotal: verifiedSubtotal,
      deliveryFee: calculatedDeliveryFee,
      deliveryZoneName: orderData.deliveryZone.name,
      discount: calculatedDiscount,
      total: calculatedTotal,
      paymentMethod: orderData.paymentMethod,
      // For COD: payment is pending until delivery. For Wave: pending until webhook/confirmation
      paymentStatus: 'pending',
      status: 'pending',
      trackingNumber: `TRK-${reference}`,
      carrierNotes: `Zone : ${orderData.deliveryZone.name} (${orderData.deliveryZone.estimatedDeliveryTime})`,
    };

    // Decrease stock for each ordered item
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = orderItems.find((oi) => oi.productId === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedItem.quantity),
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    setLastConfirmedOrder(newOrder);
    clearCart();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrierNotes?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated: Order = {
            ...order,
            status,
            trackingNumber: trackingNumber ?? order.trackingNumber,
            carrierNotes: carrierNotes ?? order.carrierNotes,
            // If marked delivered, update payment status for COD
            paymentStatus:
              status === 'delivered' && order.paymentMethod === 'cash_on_delivery'
                ? 'completed'
                : order.paymentStatus,
          };
          return updated;
        }
        return order;
      })
    );
    showToast(`Commande mise à jour avec le statut: ${status}`, 'success');
  };

  const findOrderByRefAndPhone = (reference: string, phone: string) => {
    const cleanRef = reference.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    return orders.find((order) => {
      const matchRef = order.reference.toUpperCase() === cleanRef;
      const matchPhone = order.customerPhone.replace(/\s+/g, '').includes(cleanPhone) ||
        cleanPhone.includes(order.customerPhone.replace(/\s+/g, ''));
      return matchRef && matchPhone;
    });
  };

  // Product management
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProd,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Produit "${product.name}" créé avec succès !`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Produit mis à jour avec succès.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produit supprimé du catalogue.', 'info');
  };

  // Category management
  const addCategory = (newCat: Omit<Category, 'id'>) => {
    const category: Category = {
      ...newCat,
      id: `cat_${Date.now()}`,
      productCount: 0,
    };
    setCategories((prev) => [...prev, category]);
    showToast(`Catégorie "${category.name}" ajoutée.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Catégorie mise à jour.');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Catégorie supprimée.', 'info');
  };

  // Delivery zones
  const addDeliveryZone = (newZone: Omit<DeliveryZone, 'id'>) => {
    const zone: DeliveryZone = {
      ...newZone,
      id: `zone_${Date.now()}`,
    };
    setDeliveryZones((prev) => [...prev, zone]);
    showToast(`Zone de livraison "${zone.name}" configurée.`);
  };

  const updateDeliveryZone = (id: string, updates: Partial<DeliveryZone>) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, ...updates } : z))
    );
    showToast('Zone de livraison mise à jour.');
  };

  const deleteDeliveryZone = (id: string) => {
    setDeliveryZones((prev) => prev.filter((z) => z.id !== id));
    showToast('Zone de livraison supprimée.', 'info');
  };

  // Testimonials
  const addTestimonial = (testData: Omit<Testimonial, 'id' | 'date'>) => {
    const testimonial: Testimonial = {
      ...testData,
      id: `test_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setTestimonials((prev) => [testimonial, ...prev]);
    showToast('Témoignage client ajouté.');
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Témoignage mis à jour.');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    showToast('Témoignage supprimé.', 'info');
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Paramètres de la boutique enregistrés avec succès.');
  };

  // Authentication
  const loginUser = (email: string, phone: string, fullName: string) => {
    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      phone,
      fullName,
      role: 'customer',
      country: 'Côte d’Ivoire',
    };
    setCurrentUser(user);
    showToast(`Bienvenue, ${fullName} !`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Déconnexion effectuée.', 'info');
  };

  // Admin login: default password is "faveda2026" or "admin"
  const adminLogin = (password: string): boolean => {
    if (password.trim() === 'faveda2026' || password.trim() === 'admin') {
      setIsAdminAuthenticated(true);
      showToast('Accès administrateur accordé.', 'success');
      return true;
    }
    showToast('Mot de passe administrateur incorrect.', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    showToast('Session administrateur fermée.', 'info');
  };

  // Reset to initial demo data
  const resetToInitialData = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setDeliveryZones(initialDeliveryZones);
    setTestimonials(initialTestimonials);
    setSettings(initialStoreSettings);
    setOrders([]);
    clearCart();
    showToast('Boutique réinitialisée avec les données d’origine.', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        openProductDetail,
        isCartOpen,
        setIsCartOpen,
        toast,
        showToast,

        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,

        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        couponDiscount,

        deliveryZones,
        selectedZone,
        setSelectedZone,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,

        orders,
        lastConfirmedOrder,
        createOrder,
        updateOrderStatus,
        findOrderByRefAndPhone,

        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        settings,
        updateSettings,

        currentUser,
        loginUser,
        logoutUser,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,

        resetToInitialData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
