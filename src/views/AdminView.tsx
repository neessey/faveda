import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDateTime } from '../lib/formatters';
import {
  Product,
  Category,
  OrderStatus,
  DeliveryZone,
  Testimonial,
} from '../types';
import {
  ShieldCheck,
  Package,
  Layers,
  ShoppingBag,
  Truck,
  Settings,
  Users,
  MessageSquare,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Check,
  X,
  ExternalLink,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Code,
  Menu,
  ChevronRight,
  Store,
  Clock,
  Filter,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    orders,
    products,
    categories,
    deliveryZones,
    testimonials,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    addDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateSettings,
    resetToInitialData,
    setCurrentView,
    showToast,
  } = useStore();

  // Admin PIN / password state
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'categories' | 'customers' | 'delivery' | 'testimonials' | 'settings' | 'developer'
  >('overview');

  // Mobile sidebar drawer state
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Search & Filters in Admin
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Editing Modals / Forms
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  // Status update modal for order
  const [statusModalOrder, setStatusModalOrder] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('confirmed');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierNotesInput, setCarrierNotesInput] = useState('');

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin(passwordInput);
    setPasswordInput('');
  };

  // If not authenticated, show secure clean login card
  if (!isAdminAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 sm:py-24 animate-in fade-in duration-200">
        <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1E3324] text-[#E7D6C0] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#142318]">
            Administration FAVEDA
          </h1>
          <p className="text-xs text-[#5E6F62] mt-1 mb-6">
            Espace sécurisé de gestion de la boutique.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                Mot de passe administrateur
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Entrez votre mot de passe..."
                className="w-full px-3.5 py-3 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-2 focus:ring-[#1E3324]/20"
              />
              <p className="text-[11px] text-[#738475] mt-1.5">
                (Mot de passe par défaut : <code className="bg-[#EBE2D5] px-1 rounded font-mono">faveda2026</code> ou <code className="bg-[#EBE2D5] px-1 rounded font-mono">admin</code>)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#1E3324] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              Déverrouiller le Tableau de Bord
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EAE3D6]">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-[#5E6F62] hover:text-[#1E3324] flex items-center justify-center gap-1.5 mx-auto"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Retourner à la boutique publique</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const confirmedOrdersCount = orders.filter(
    (o) => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'shipped'
  ).length;

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const matchRef = o.reference.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchCity = o.city.toLowerCase().includes(q);
      return matchRef || matchName || matchPhone || matchCity;
    }
    return true;
  });

  // Unique customers derived from orders
  const customerMap = new Map<
    string,
    { name: string; phone: string; email?: string; orderCount: number; totalSpent: number; lastOrder: string }
  >();
  orders.forEach((o) => {
    const key = o.customerPhone.trim();
    const existing = customerMap.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += o.total;
    } else {
      customerMap.set(key, {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail,
        orderCount: 1,
        totalSpent: o.total,
        lastOrder: o.createdAt,
      });
    }
  });
  const customersList = Array.from(customerMap.values());

  // Navigation Items for Sidebar
  const navItems = [
    { key: 'overview', label: 'Vue d’ensemble', icon: TrendingUp },
    {
      key: 'orders',
      label: 'Commandes',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} attente` : `${orders.length}`,
      badgeColor: pendingOrdersCount > 0 ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-stone-200 text-stone-700',
    },
    {
      key: 'products',
      label: 'Nos Tisanes & Soins',
      icon: Package,
      badge: `${products.length}`,
    },
    { key: 'categories', label: 'Catégories', icon: Layers, badge: `${categories.length}` },
    { key: 'customers', label: 'Clients', icon: Users, badge: `${customersList.length}` },
    { key: 'delivery', label: 'Frais & Zones Livraison', icon: Truck, badge: `${deliveryZones.length}` },
    { key: 'testimonials', label: 'Avis Vérifiés', icon: MessageSquare, badge: `${testimonials.length}` },
    { key: 'settings', label: 'Paramètres Boutique', icon: Settings },
    { key: 'developer', label: 'Schéma SQL & Wave', icon: Code },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#F7F4EE] text-[#142318] overflow-x-hidden">
      {/* Mobile Top App Bar for Admin */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#1E3324] text-white sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpenMobile(true)}
            className="p-2 -ml-1 text-[#E7D6C0] hover:text-white rounded-lg focus:outline-none"
            aria-label="Ouvrir le menu latéral"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg tracking-wide">FAVEDA</span>
            
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="p-2 text-xs text-[#E7D6C0] hover:text-white flex items-center gap-1"
            title="Voir la boutique"
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Boutique</span>
          </button>
          <button
            onClick={adminLogout}
            className="p-2 text-xs text-red-200 hover:text-white"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpenMobile && (
        <div
          onClick={() => setIsSidebarOpenMobile(false)}
          className="lg:hidden fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* SIDEBAR (Desktop Fixed/Sticky & Mobile Off-Canvas) */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-20 z-50 lg:z-10 h-screen lg:h-[calc(100vh-80px)] w-72 bg-[#1B2F21] text-[#E7E2D8] flex flex-col justify-between shrink-0 shadow-xl transition-transform duration-200 ease-in-out border-r border-[#2C4A32] ${
          isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand info */}
        <div>
          <div className="p-5 border-b border-[#2C4A32] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={settings.logoUrl}
                alt="FAVEDA"
                className="w-9 h-9 object-contain rounded-md bg-white/10 p-0.5"
              />
              <div>
                <span className="font-serif text-lg font-bold tracking-wider text-[#FBF9F5] block">
                  FAVEDA
                </span>
                <span className="text-[10px] text-[#A6BAA9] uppercase tracking-widest block font-medium">
                  Panneau de Contrôle
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpenMobile(false)}
              className="lg:hidden p-1.5 text-[#A6BAA9] hover:text-white rounded-lg"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shortcut to public store */}
          <div className="p-3">
            <button
              onClick={() => {
                setCurrentView('home');
                setIsSidebarOpenMobile(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[#C4D6C6] bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#E7D6C0]" />
                <span>Voir la boutique en ligne</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key as any);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#E7D6C0] text-[#142318] shadow-sm font-semibold'
                      : 'text-[#D3DDD4] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#1E3324]' : 'text-[#8DA391] group-hover:text-white'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                        item.badgeColor ||
                        (isActive
                          ? 'bg-[#1E3324] text-white'
                          : 'bg-white/10 text-[#C4D6C6]')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Quick Actions, User info & Logout */}
        <div className="p-3 border-t border-[#2C4A32] space-y-2 bg-[#17281D]">
          <button
            onClick={resetToInitialData}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-[11px] text-[#A6BAA9] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser les données démo</span>
          </button>

          <div className="flex items-center justify-between pt-2 border-t border-[#2C4A32]/60 px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2C4A32] text-[#E7D6C0] flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="text-left leading-none">
                <span className="text-xs font-semibold text-white block">Administrateur</span>
                <span className="text-[10px] text-[#8DA391]">Session active</span>
              </div>
            </div>

            <button
              onClick={adminLogout}
              className="p-1.5 text-[#A6BAA9] hover:text-red-300 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Dynamic Section Header */}
        <div className="bg-[#FAF7F2] border border-[#E7DECE] p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#35533B]">
              <ShieldCheck className="w-4 h-4 text-[#1E3324]" />
              <span>Tableau de Bord</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span>{navItems.find((n) => n.key === activeTab)?.label}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#142318] mt-1">
              {activeTab === 'overview' && 'Aperçu & Performances'}
              {activeTab === 'orders' && 'Commandes Clients'}
              {activeTab === 'products' && 'Gestion des Tisanes & Soins'}
              {activeTab === 'categories' && 'Gestion des Catégories'}
              {activeTab === 'customers' && 'Répertoire des Clients'}
              {activeTab === 'delivery' && 'Zones & Tarifs de Livraison'}
              {activeTab === 'testimonials' && 'Avis Clients Vérifiés'}
              {activeTab === 'settings' && 'Paramètres Généraux'}
              {activeTab === 'developer' && 'Base SQL Supabase & API Wave'}
            </h1>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingProduct(true);
                }}
                className="px-4 py-2 bg-[#1E3324] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Produit</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsAddingCategory(true);
                }}
                className="px-4 py-2 bg-[#1E3324] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Catégorie</span>
              </button>
            )}

            {activeTab === 'delivery' && (
              <button
                onClick={() => {
                  setEditingZone(null);
                  setIsAddingZone(true);
                }}
                className="px-4 py-2 bg-[#1E3324] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter Zone</span>
              </button>
            )}

            {activeTab === 'testimonials' && (
              <button
                onClick={() => {
                  setEditingTestimonial(null);
                  setIsAddingTestimonial(true);
                }}
                className="px-4 py-2 bg-[#1E3324] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter Avis</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl shadow-xs">
                <span className="text-xs uppercase tracking-wider text-[#738475] font-medium block">
                  Chiffre d'Affaires Réel
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-[#1E3324] mt-2 tabular-nums">
                  {formatCurrency(totalRevenue)}
                </p>
                <span className="text-[11px] text-[#738475] mt-1 block">
                  Total des commandes confirmées
                </span>
              </div>

              <div className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl shadow-xs">
                <span className="text-xs uppercase tracking-wider text-[#738475] font-medium block">
                  Commandes en Attente
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-amber-700 mt-2 tabular-nums">
                  {pendingOrdersCount}
                </p>
                <span className="text-[11px] text-[#738475] mt-1 block">
                  À vérifier ou préparer
                </span>
              </div>

              <div className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl shadow-xs">
                <span className="text-xs uppercase tracking-wider text-[#738475] font-medium block">
                  En Cours d'Expédition
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-[#2C4A32] mt-2 tabular-nums">
                  {confirmedOrdersCount}
                </p>
                <span className="text-[11px] text-[#738475] mt-1 block">
                  En préparation ou en route
                </span>
              </div>

              <div className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl shadow-xs">
                <span className="text-xs uppercase tracking-wider text-[#738475] font-medium block">
                  Commandes Livrées
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-[#142318] mt-2 tabular-nums">
                  {deliveredOrdersCount}
                </p>
                <span className="text-[11px] text-[#738475] mt-1 block">
                  Paiements encaissés
                </span>
              </div>
            </div>

            {/* Quick Overview Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Orders List */}
              <div className="lg:col-span-8 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#142318]">
                    Dernières Commandes
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#1E3324] hover:underline"
                  >
                    Voir tout ({orders.length})
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#5E6F62] py-8 text-center">
                    Aucune commande pour le moment.
                  </p>
                ) : (
                  <div className="divide-y divide-[#EAE3D6] overflow-x-auto">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-3 flex items-center justify-between text-xs gap-3 min-w-[340px]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#1E3324]">{o.reference}</span>
                            <span className="text-[#738475]">·</span>
                            <span className="font-medium text-[#142318]">{o.customerName}</span>
                          </div>
                          <p className="text-[11px] text-[#738475] mt-0.5">
                            {formatDateTime(o.createdAt)} · {o.city}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[#1E3324] tabular-nums">
                            {formatCurrency(o.total)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              o.status === 'delivered'
                                ? 'bg-[#E5EFE7] text-[#1E3324]'
                                : o.status === 'pending'
                                ? 'bg-amber-100 text-amber-900'
                                : o.status === 'cancelled'
                                ? 'bg-red-100 text-red-900'
                                : 'bg-[#E7DECE] text-[#3E4E42]'
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions & Store Health */}
              <div className="lg:col-span-4 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#142318] border-b border-[#EAE3D6] pb-3">
                  État de la Boutique
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5E6F62]">Catalogue en ligne :</span>
                    <span className="font-semibold text-[#142318]">
                      {products.filter((p) => p.isActive).length} actifs sur {products.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5E6F62]">Abonnés TikTok :</span>
                    <span className="font-mono font-semibold text-[#1E3324]">
                      {settings.tiktokFollowers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5E6F62]">Passerelle Wave :</span>
                    <span
                      className={`font-semibold ${
                        settings.waveApiKeyConfigured ? 'text-[#2C4A32]' : 'text-amber-800'
                      }`}
                    >
                      {settings.waveApiKeyConfigured ? 'Active' : 'En attente API'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5E6F62]">Zones desservies :</span>
                    <span className="font-semibold text-[#142318]">{deliveryZones.length}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE3D6] space-y-2">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAddingProduct(true);
                      setActiveTab('products');
                    }}
                    className="w-full py-2.5 px-3 bg-white border border-[#D5CBBF] rounded-xl text-xs font-medium text-[#142318] hover:bg-[#F2ECE1] transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#1E3324]" />
                      <span>Ajouter une tisane</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2.5 px-3 bg-white border border-[#D5CBBF] rounded-xl text-xs font-medium text-[#142318] hover:bg-[#F2ECE1] transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#1E3324]" />
                      <span>Paramètres de contact</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Filter Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E7DECE]">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#738475]" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Rechercher par référence, nom, téléphone, ville..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5E6F62] whitespace-nowrap">Filtrer par statut :</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-[#D5CBBF] rounded-xl px-3 py-2 text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="preparing">En préparation</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>

            {/* Orders Responsive Table Container (Zero Overflows!) */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-[#FAF7F2] rounded-2xl border border-[#E7DECE] text-xs text-[#5E6F62]">
                Aucune commande ne correspond à votre recherche.
              </div>
            ) : (
              <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[760px]">
                    <thead className="bg-[#F2ECE1] text-[#4E5E52] border-b border-[#E7DECE]">
                      <tr>
                        <th className="p-3.5 font-semibold">Référence & Date</th>
                        <th className="p-3.5 font-semibold">Client</th>
                        <th className="p-3.5 font-semibold">Lieu de Livraison</th>
                        <th className="p-3.5 font-semibold">Articles</th>
                        <th className="p-3.5 font-semibold">Montant & Mode</th>
                        <th className="p-3.5 font-semibold">Statut</th>
                        <th className="p-3.5 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE3D6] text-[#142318]">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/60 transition-colors">
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#1E3324] block">
                              {ord.reference}
                            </span>
                            <span className="text-[11px] text-[#738475]">
                              {formatDateTime(ord.createdAt)}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-semibold block">{ord.customerName}</span>
                            <a
                              href={`tel:${ord.customerPhone.replace(/\s+/g, '')}`}
                              className="text-[#1E3324] hover:underline font-mono text-[11px] block"
                            >
                              {ord.customerPhone}
                            </a>
                          </td>

                          <td className="p-3.5 max-w-[200px]">
                            <span className="font-medium block">{ord.city}, {ord.country}</span>
                            <span className="text-[11px] text-[#5E6F62] block truncate" title={ord.address}>
                              {ord.address}
                            </span>
                            {ord.instructions && (
                              <span className="text-[10px] text-amber-800 italic block truncate" title={ord.instructions}>
                                Note : {ord.instructions}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 max-w-[180px]">
                            <span className="font-medium block">{ord.items.length} article(s)</span>
                            <span
                              className="text-[11px] text-[#738475] block truncate"
                              title={ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                            >
                              {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#1E3324] block tabular-nums">
                              {formatCurrency(ord.total)}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-[#738475] block">
                              {ord.paymentMethod === 'wave' ? 'Wave Money' : 'À la livraison'}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                ord.status === 'delivered'
                                  ? 'bg-[#E5EFE7] text-[#1E3324]'
                                  : ord.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-900'
                                  : ord.status === 'preparing'
                                  ? 'bg-purple-100 text-purple-900'
                                  : ord.status === 'confirmed'
                                  ? 'bg-amber-100 text-amber-900'
                                  : ord.status === 'cancelled'
                                  ? 'bg-red-100 text-red-900'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setStatusModalOrder(ord);
                                setSelectedStatus(ord.status);
                                setTrackingNumberInput(ord.trackingNumber || '');
                                setCarrierNotesInput(ord.carrierNotes || '');
                              }}
                              className="px-3 py-1.5 bg-[#1E3324] hover:bg-[#2C4A32] text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              Gérer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E7DECE]">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#738475]" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Rechercher une tisane..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                />
              </div>

              <div className="text-xs text-[#5E6F62]">
                Total : <span className="font-semibold text-[#142318]">{products.length} produits</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products
                .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div className="flex gap-4">
                      <img
                        src={prod.images[0] || '/assets/aistudio/image_84890492.png'}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover bg-stone-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-semibold text-[#738475] block">
                          {prod.categoryName || 'Soin Botanique'}
                        </span>
                        <h3 className="font-serif text-base font-bold text-[#142318] truncate" title={prod.name}>
                          {prod.name}
                        </h3>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="font-mono text-sm font-bold text-[#1E3324] tabular-nums">
                            {formatCurrency(prod.promoPrice ?? prod.price)}
                          </span>
                          {prod.promoPrice && (
                            <span className="font-mono text-xs text-[#738475] line-through tabular-nums">
                              {formatCurrency(prod.price)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#5E6F62] block mt-0.5">
                          Stock : <span className="font-semibold text-[#142318]">{prod.stock}</span> unités
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#5E6F62] line-clamp-2 leading-relaxed">
                      {prod.shortDescription}
                    </p>

                    <div className="pt-3 border-t border-[#EAE3D6] flex items-center justify-between text-xs">
                      <button
                        onClick={() => updateProduct(prod.id, { isActive: !prod.isActive })}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                          prod.isActive
                            ? 'bg-[#E5EFE7] text-[#1E3324]'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {prod.isActive ? 'Actif' : 'Inactif'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsAddingProduct(false);
                          }}
                          className="p-1.5 text-[#5E6F62] hover:text-[#1E3324] hover:bg-stone-200 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Confirmez-vous la suppression de "${prod.name}" ?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 text-[#5E6F62] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-5 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#142318]">{c.name}</h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(c);
                          setIsAddingCategory(false);
                        }}
                        className="p-1.5 text-[#5E6F62] hover:text-[#1E3324]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer la catégorie "${c.name}" ?`)) {
                            deleteCategory(c.id);
                          }
                        }}
                        className="p-1.5 text-[#5E6F62] hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#5E6F62] leading-relaxed">{c.description}</p>
                  <span className="text-[11px] font-mono text-[#738475] block pt-2 border-t border-[#EAE3D6]">
                    Slug : {c.slug}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-[#F2ECE1] text-[#4E5E52] border-b border-[#E7DECE]">
                    <tr>
                      <th className="p-3.5 font-semibold">Nom du Client</th>
                      <th className="p-3.5 font-semibold">Téléphone</th>
                      <th className="p-3.5 font-semibold">Email</th>
                      <th className="p-3.5 font-semibold">Commandes</th>
                      <th className="p-3.5 font-semibold">Total Dépensé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D6]">
                    {customersList.map((cust, i) => (
                      <tr key={i} className="hover:bg-white/50">
                        <td className="p-3.5 font-semibold text-[#142318]">{cust.name}</td>
                        <td className="p-3.5 font-mono text-[#1E3324]">{cust.phone}</td>
                        <td className="p-3.5 text-[#5E6F62]">{cust.email || 'Non renseigné'}</td>
                        <td className="p-3.5 font-semibold">{cust.orderCount}</td>
                        <td className="p-3.5 font-mono font-bold text-[#1E3324]">
                          {formatCurrency(cust.totalSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DELIVERY ZONES */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {deliveryZones.map((z) => (
                <div
                  key={z.id}
                  className="p-5 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl space-y-3 shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#142318]">{z.name}</h3>
                      <span className="text-xs text-[#738475]">{z.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingZone(z);
                          setIsAddingZone(false);
                        }}
                        className="p-1 text-[#5E6F62] hover:text-[#1E3324]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer la zone "${z.name}" ?`)) deleteDeliveryZone(z.id);
                        }}
                        className="p-1 text-[#5E6F62] hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EAE3D6] space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5E6F62]">Frais :</span>
                      <span className="font-mono font-bold text-[#1E3324]">
                        {formatCurrency(z.price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5E6F62]">Délai estimé :</span>
                      <span className="font-medium text-[#142318]">{z.estimatedDeliveryTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-5 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-[#142318]">{t.customerName}</span>
                      <span className="text-xs text-[#738475]">{t.location}</span>
                    </div>
                    <p className="text-xs text-[#3E4E42] italic leading-relaxed">
                      « {t.comment} »
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EAE3D6] flex items-center justify-between text-xs">
                    <button
                      onClick={() => updateTestimonial(t.id, { isPublished: !t.isPublished })}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium ${
                        t.isPublished ? 'bg-[#E5EFE7] text-[#1E3324]' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {t.isPublished ? 'Publié' : 'Brouillon'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTestimonial(t);
                          setIsAddingTestimonial(false);
                        }}
                        className="p-1.5 text-[#5E6F62] hover:text-[#1E3324]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Supprimer ce témoignage ?')) deleteTestimonial(t.id);
                        }}
                        className="p-1.5 text-[#5E6F62] hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#142318]">
              Paramètres de la Marque & Informations
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">Nom de la Marque</label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => updateSettings({ brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">Slogan Principal</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => updateSettings({ tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#4E5E52] mb-1">Numéro Téléphone 1</label>
                  <input
                    type="text"
                    value={settings.phone1}
                    onChange={(e) => updateSettings({ phone1: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4E5E52] mb-1">Numéro Téléphone 2</label>
                  <input
                    type="text"
                    value={settings.phone2}
                    onChange={(e) => updateSettings({ phone2: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#4E5E52] mb-1">
                    Abonnés TikTok (Modifiable en temps réel)
                  </label>
                  <input
                    type="text"
                    value={settings.tiktokFollowers}
                    onChange={(e) => updateSettings({ tiktokFollowers: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4E5E52] mb-1">Lien Compte TikTok</label>
                  <input
                    type="url"
                    value={settings.tiktokUrl}
                    onChange={(e) => updateSettings({ tiktokUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">Texte du Bandeau d'Annonce</label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => updateSettings({ announcementText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
                />
              </div>

              <div className="pt-4 border-t border-[#EAE3D6] space-y-3">
                <h3 className="font-serif text-base font-bold text-[#142318]">
                  Intégration Paiement WAVE
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.waveApiKeyConfigured}
                    onChange={(e) => updateSettings({ waveApiKeyConfigured: e.target.checked })}
                    className="rounded text-[#1E3324] focus:ring-[#1E3324]"
                  />
                  <span className="font-medium text-[#142318]">
                    Clé API Wave active en production
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: DEVELOPER */}
        {activeTab === 'developer' && (
          <div className="space-y-6">
            <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-5 sm:p-8 space-y-4 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-[#142318]">
                Schéma Supabase PostgreSQL & Déploiement
              </h2>
              <p className="text-xs text-[#5E6F62] leading-relaxed">
                Le fichier de migration est situé dans <code className="bg-[#EBE2D5] px-1 rounded font-mono">/supabase/migrations/01_initial_schema.sql</code>.
              </p>

              <div className="p-4 bg-stone-900 text-stone-100 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-96">
                <pre>{`-- Architecture de persistance :
- profiles (utilisateurs, rôles client/admin)
- categories (catégories éditables)
- products (tisanes, ingrédients, stock)
- product_images (photos multi-angles)
- orders (commandes avec référence unique)
- order_items (articles et décrémentation stock)
- delivery_zones (zones et frais en FCFA)
- payments (webhooks Wave et transactions)
- testimonials (avis réels validés)`}</pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Update Order Status */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EAE3D6] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#142318]">
                Commande {statusModalOrder.reference}
              </h3>
              <button
                onClick={() => setStatusModalOrder(null)}
                className="text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">Statut</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318]"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="preparing">En préparation</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée (règlement encaissé)</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">N° de Suivi Transporteur</label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="Ex: TRK-FAV-2026-9812"
                  className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">Notes Transporteur</label>
                <input
                  type="text"
                  value={carrierNotesInput}
                  onChange={(e) => setCarrierNotesInput(e.target.value)}
                  placeholder="Ex: Coursier en cours de livraison..."
                  className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE3D6] flex justify-end gap-2">
              <button
                onClick={() => setStatusModalOrder(null)}
                className="px-4 py-2 border border-[#D5CBBF] rounded-xl text-xs text-[#5E6F62]"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  updateOrderStatus(
                    statusModalOrder.id,
                    selectedStatus,
                    trackingNumberInput,
                    carrierNotesInput
                  );
                  setStatusModalOrder(null);
                }}
                className="px-4 py-2 bg-[#1E3324] hover:bg-[#2C4A32] text-white rounded-xl text-xs font-semibold"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Product Form */}
      {(isAddingProduct || editingProduct) && (
        <ProductFormModal
          categories={categories}
          product={editingProduct}
          onClose={() => {
            setIsAddingProduct(false);
            setEditingProduct(null);
          }}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data);
            } else {
              addProduct(data as any);
            }
            setIsAddingProduct(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* MODAL: Category Form */}
      {(isAddingCategory || editingCategory) && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setIsAddingCategory(false);
            setEditingCategory(null);
          }}
          onSave={(data) => {
            if (editingCategory) {
              updateCategory(editingCategory.id, data);
            } else {
              addCategory(data as any);
            }
            setIsAddingCategory(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* MODAL: Zone Form */}
      {(isAddingZone || editingZone) && (
        <ZoneFormModal
          zone={editingZone}
          onClose={() => {
            setIsAddingZone(false);
            setEditingZone(null);
          }}
          onSave={(data) => {
            if (editingZone) {
              updateDeliveryZone(editingZone.id, data);
            } else {
              addDeliveryZone(data as any);
            }
            setIsAddingZone(false);
            setEditingZone(null);
          }}
        />
      )}

      {/* MODAL: Testimonial Form */}
      {(isAddingTestimonial || editingTestimonial) && (
        <TestimonialFormModal
          testimonial={editingTestimonial}
          onClose={() => {
            setIsAddingTestimonial(false);
            setEditingTestimonial(null);
          }}
          onSave={(data) => {
            if (editingTestimonial) {
              updateTestimonial(editingTestimonial.id, data);
            } else {
              addTestimonial(data as any);
            }
            setIsAddingTestimonial(false);
            setEditingTestimonial(null);
          }}
        />
      )}
    </div>
  );
};

// Sub-components: ProductFormModal
const ProductFormModal: React.FC<{
  categories: Category[];
  product: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}> = ({ categories, product, onClose, onSave }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || 15000);
  const [promoPrice, setPromoPrice] = useState<number | string>(product?.promoPrice || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || '');
  const [stock, setStock] = useState(product?.stock ?? 25);
  const [shortDesc, setShortDesc] = useState(product?.shortDescription || '');
  const [description, setDescription] = useState(product?.description || '');
  const [ingredientsText, setIngredientsText] = useState(
    product?.ingredients?.join('\n') || ''
  );
  const [usage, setUsage] = useState(product?.usageInstructions || '');
  const [precautions, setPrecautions] = useState(product?.precautions || '');
  const [imageUrl, setImageUrl] = useState(
    product?.images[0] || '/assets/images/product_tisane_digestive_1794416169202.jpg'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === categoryId);
    onSave({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(price),
      promoPrice: promoPrice ? Number(promoPrice) : null,
      categoryId,
      categoryName: cat?.name || 'Tisane',
      stock: Number(stock),
      images: [imageUrl.trim()],
      isActive: true,
      isFeatured: false,
      isBestSeller: false,
      shortDescription: shortDesc.trim(),
      description: description.trim(),
      ingredients: ingredientsText.split('\n').filter((l) => l.trim()),
      usageInstructions: usage.trim(),
      precautions: precautions.trim(),
      format: 'Préparation artisanale',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl my-8 space-y-4">
        <div className="flex justify-between items-center border-b border-[#EAE3D6] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#142318]">
            {product ? 'Modifier la tisane' : 'Créer une nouvelle tisane'}
          </h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Nom du produit *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tisane Confort & Réparation Ventre"
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">Prix normal (FCFA) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">Prix Promo (Optionnel)</label>
              <input
                type="number"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                placeholder="Laisser vide si aucun"
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">Stock disponible *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">Catégorie *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">URL de l'image</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Brève description</label>
            <input
              type="text"
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Ex: Mélange traditionnel pour soulager les ballonnements..."
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Description complète</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">
              Ingrédients & Composition (un par ligne)
            </label>
            <textarea
              rows={3}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Gingembre sauvage&#10;Menthe douce&#10;Fenouil"
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">Mode d'emploi / Posologie</label>
              <textarea
                rows={2}
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder="Faire infuser 1 cuillère le soir..."
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">Précautions d'emploi</label>
              <textarea
                rows={2}
                value={precautions}
                onChange={(e) => setPrecautions(e.target.value)}
                placeholder="Déconseillé aux femmes enceintes..."
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#EAE3D6] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D5CBBF] rounded-xl text-xs text-[#5E6F62]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1E3324] hover:bg-[#2C4A32] text-white rounded-xl text-xs font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-components: CategoryFormModal
const CategoryFormModal: React.FC<{
  category: Category | null;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}> = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || '');
  const [desc, setDesc] = useState(category?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: desc.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#142318]">
          {category ? 'Modifier la catégorie' : 'Créer une catégorie'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Nom *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tisanes et produits naturels"
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#D5CBBF] rounded-xl text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1E3324] text-white rounded-xl text-xs font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-components: ZoneFormModal
const ZoneFormModal: React.FC<{
  zone: DeliveryZone | null;
  onClose: () => void;
  onSave: (data: Partial<DeliveryZone>) => void;
}> = ({ zone, onClose, onSave }) => {
  const [name, setName] = useState(zone?.name || '');
  const [country, setCountry] = useState(zone?.country || 'Côte d’Ivoire');
  const [price, setPrice] = useState(zone?.price || 1500);
  const [time, setTime] = useState(zone?.estimatedDeliveryTime || '24h - 48h');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      country: country.trim(),
      price: Number(price),
      estimatedDeliveryTime: time.trim(),
      cities: [],
      isActive: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#142318]">
          {zone ? 'Modifier la zone' : 'Ajouter une zone de livraison'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Nom de la zone *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Abidjan - Zone 1"
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Pays *</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">Tarif (FCFA) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#4E5E52] mb-1">Délai estimé *</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="24h ou 48h"
                className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#D5CBBF] rounded-xl text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1E3324] text-white rounded-xl text-xs font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-components: TestimonialFormModal
const TestimonialFormModal: React.FC<{
  testimonial: Testimonial | null;
  onClose: () => void;
  onSave: (data: Partial<Testimonial>) => void;
}> = ({ testimonial, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState(testimonial?.customerName || '');
  const [location, setLocation] = useState(testimonial?.location || 'Abidjan');
  const [comment, setComment] = useState(testimonial?.comment || '');
  const [productUsed, setProductUsed] = useState(testimonial?.productUsed || 'Tisane Réparation Ventre');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      customerName: customerName.trim(),
      location: location.trim(),
      comment: comment.trim(),
      productUsed: productUsed.trim(),
      rating: 5,
      isVerified: true,
      isPublished: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#142318]">
          {testimonial ? 'Modifier le témoignage' : 'Ajouter un témoignage vérifié'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Nom de la cliente *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ex: Awa K."
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Ville / Pays *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Abidjan - Cocody"
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Produit utilisé</label>
            <input
              type="text"
              value={productUsed}
              onChange={(e) => setProductUsed(e.target.value)}
              placeholder="Ex: Tisane Réparation Ventre"
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>
          <div>
            <label className="block font-medium text-[#4E5E52] mb-1">Commentaire client *</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Retour d'expérience de la cliente..."
              className="w-full p-2.5 bg-white border border-[#D5CBBF] rounded-xl text-[#142318]"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#D5CBBF] rounded-xl text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1E3324] text-white rounded-xl text-xs font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
