export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number; // in FCFA
  promoPrice?: number | null; // in FCFA
  categoryId: string;
  categoryName?: string;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  shortDescription: string;
  description: string;
  ingredients: string[];
  usageInstructions: string;
  precautions: string;
  format?: string; // e.g. "Sachet kraft 100g", "Pot de 250g"
  origin?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending' // En attente
  | 'confirmed' // Confirmée
  | 'preparing' // En préparation
  | 'shipped' // Expédiée
  | 'delivered' // Livrée
  | 'cancelled'; // Annulée

export type PaymentMethod = 'wave' | 'cash_on_delivery';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  reference: string; // e.g. "FAV-2026-9812"
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  country: string;
  city: string;
  address: string;
  instructions?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryZoneName: string;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber?: string;
  carrierNotes?: string;
  waveTransactionId?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  country: string;
  cities: string[];
  price: number; // in FCFA
  estimatedDeliveryTime: string; // e.g. "24h - 48h"
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  rating: number; // 1 to 5
  comment: string;
  productUsed?: string;
  customerPhoto?: string; // optional customer photo of prepared tea / experience
  date: string;
  isVerified: boolean;
  isPublished: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  isActive: boolean;
  expirationDate?: string;
}

export interface StoreSettings {
  brandName: string;
  logoUrl: string;
  tagline: string;
  description: string;
  phone1: string;
  phone2: string;
  email: string;
  tiktokUrl: string;
  tiktokFollowers: string;
  currency: string;
  freeDeliveryThreshold?: number;
  waveApiKeyConfigured: boolean;
  waveMerchantName?: string;
  announcementText: string;
  showAnnouncement: boolean;
  addressAbidjan: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: string;
  city?: string;
  country?: string;
}
