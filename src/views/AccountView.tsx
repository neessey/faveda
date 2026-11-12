import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/formatters';
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  LogOut,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    loginUser,
    logoutUser,
    orders,
    setCurrentView,
    showToast,
  } = useStore();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Veuillez remplir votre nom et votre numéro de téléphone.', 'error');
      return;
    }
    loginUser(email.trim(), phone.trim(), fullName.trim());
  };

  // Find user's orders by matching phone or email
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customerPhone.replace(/\s+/g, '') === currentUser.phone.replace(/\s+/g, '') ||
          (currentUser.email && o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#35533B]">
          Espace Client
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#142318] mt-1">
          {currentUser ? `Bonjour, ${currentUser.fullName}` : 'Mon Compte FAVEDA'}
        </h1>
        <p className="text-xs text-[#5E6F62] mt-1">
          Consultez l'historique de vos commandes et vos informations personnelles.
        </p>
      </div>

      {!currentUser ? (
        /* Login / Register Card */
        <div className="max-w-md mx-auto bg-[#FAF7F2] border border-[#E7DECE] rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#E8E1D3] text-[#1E3324] flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#142318]">
              {isRegistering ? 'Créer un compte client' : 'Connexion à votre espace'}
            </h2>
            <p className="text-xs text-[#5E6F62] mt-1">
              Retrouvez l'ensemble de vos commandes en quelques secondes
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Awa Koné"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                Numéro de Téléphone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 07 89 52 74 84"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                Adresse Email (Optionnelle)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#1E3324] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              {isRegistering ? "S'inscrire et accéder à mon espace" : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#5E6F62] border-t border-[#EAE3D6] pt-4">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[#1E3324] hover:underline font-semibold"
            >
              {isRegistering
                ? 'Déjà inscrit ? Connectez-vous'
                : 'Nouveau client ? Créer un profil'}
            </button>
          </div>
        </div>
      ) : (
        /* Logged In Dashboard */
        <div className="space-y-8">
          {/* Profile overview card */}
          <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1E3324] text-[#E7D6C0] flex items-center justify-center font-serif text-2xl font-bold">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#142318]">
                  {currentUser.fullName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5E6F62] mt-0.5">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#1E3324]" />
                    {currentUser.phone}
                  </span>
                  {currentUser.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#1E3324]" />
                      {currentUser.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#D5CBBF] bg-white rounded-lg text-xs font-medium text-[#5E6F62] hover:text-red-700 hover:border-red-300 self-start sm:self-auto transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Se déconnecter</span>
            </button>
          </div>

          {/* Orders History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#142318]  flex items-center gap-2">
                <span>Mes Commandes ({userOrders.length})</span>
              </h2>

              <button
                onClick={() => setCurrentView('shop')}
                className="text-xs font-semibold text-[#1E3324] hover:underline"
              >
                Nouvelle commande
              </button>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-10 text-center">
                <ShoppingBag className="w-10 h-10 text-[#8C9C8E] mx-auto mb-3" />
                <p className="font-serif text-base font-semibold text-[#142318] mb-1">
                  Aucune commande enregistrée pour ce numéro
                </p>
                <p className="text-xs text-[#5E6F62] mb-4">
                  Vos futures commandes passées avec le numéro {currentUser.phone} apparaîtront automatiquement ici.
                </p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-5 py-2 bg-[#1E3324] text-white rounded-xl text-xs font-semibold"
                >
                  Découvrir nos tisanes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-[#FAF7F2] border border-[#E7DECE] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1E3324]">
                          {ord.reference}
                        </span>
                        <span className="text-xs text-[#738475]">·</span>
                        <span className="text-xs text-[#5E6F62]">{formatDate(ord.createdAt)}</span>
                      </div>
                      <p className="text-xs text-[#142318] font-medium mt-1">
                        {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </p>
                      <p className="text-[11px] text-[#738475] mt-0.5">
                        Statut : <span className="font-semibold text-[#1E3324]">{ord.status}</span> · Destination : {ord.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right">
                      <span className="font-mono text-sm font-bold text-[#1E3324] tabular-nums">
                        {formatCurrency(ord.total)}
                      </span>
                      <button
                        onClick={() => {
                          setCurrentView('tracking');
                        }}
                        className="px-3 py-1.5 bg-white border border-[#D5CBBF] rounded-lg text-xs font-medium text-[#1E3324] hover:bg-[#F2ECE1] transition-colors"
                      >
                        Suivre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
