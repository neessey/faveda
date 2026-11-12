import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/formatters';
import { PaymentMethod, DeliveryZone } from '../types';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    couponDiscount,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    createOrder,
    setCurrentView,
    settings,
    showToast,
  } = useStore();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Côte d’Ivoire');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#142318] mb-2">
          Votre panier est vide
        </h2>
        <p className="text-xs text-[#5E6F62] mb-6">
          Veuillez sélectionner au moins une tisane avant de passer commande.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 bg-[#1E3324] text-white rounded-xl text-xs font-semibold hover:bg-[#2C4A32]"
        >
          Découvrir la boutique
        </button>
      </div>
    );
  }

  // Delivery Calculations
  const currentZone = selectedZone || deliveryZones[0];
  const isFreeDelivery =
    settings.freeDeliveryThreshold &&
    cartSubtotal >= settings.freeDeliveryThreshold &&
    currentZone?.country === 'Côte d’Ivoire';

  const deliveryFee = isFreeDelivery ? 0 : (currentZone ? currentZone.price : 0);
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

  // Submit Handler
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Veuillez indiquer un numéro de téléphone valide pour la livraison.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Veuillez préciser votre ville ou commune.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Veuillez renseigner votre adresse de livraison exacte.');
      return;
    }
    if (!currentZone) {
      setErrorMsg('Veuillez sélectionner une zone de livraison.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createOrder({
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email || undefined,
        country,
        city,
        address,
        instructions: instructions || undefined,
        paymentMethod,
        deliveryZone: currentZone,
      });

      if (!result.success || !result.order) {
        setErrorMsg(result.error || 'Une erreur est survenue lors de la création de la commande.');
        setIsSubmitting(false);
        return;
      }

      // If Wave is selected
      if (paymentMethod === 'wave') {
        if (!settings.waveApiKeyConfigured) {
          // Wave API is pending/credentials not provided as stated in prompt:
          // "If Wave API credentials are unavailable, create a clearly labelled disabled or pending integration. Do not simulate successful payments."
          showToast('Commande enregistrée. En attente de paiement Wave.', 'info');
        } else {
          showToast('Redirection vers le portail officiel de paiement Wave...', 'info');
        }
      } else {
        showToast('Commande confirmée avec succès ! Paiement à la réception.', 'success');
      }

      setCurrentView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur technique lors de la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-2 text-xs text-[#5E6F62] hover:text-[#1E3324] mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Continuer mes achats</span>
      </button>

      <div className="max-w-2xl mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#35533B]">
          Commande Directe en Ligne
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#142318] mt-1">
          Finalisation de votre commande
        </h1>
        <p className="text-xs text-[#5E6F62] mt-1">
          Passez votre commande en toute autonomie. Aucune obligation de passer par WhatsApp.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Form: Delivery & Customer Info (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Coordonnées */}
            <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#142318] flex items-center gap-2">
                <span>1. Vos Coordonnées</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                    Nom et Prénom(s) *
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
                    Numéro de Téléphone (Obligatoire) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 07 89 52 74 84"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                  />
                  <span className="text-[10px] text-[#738475] mt-0.5 block">
                    Utilisé pour la livraison et le suivi de commande
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                    Adresse Email (Optionnelle)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: nom@domaine.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                  />
                  <span className="text-[10px] text-[#738475] mt-0.5 block">
                    Pour recevoir le reçu de confirmation
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Adresse de Livraison */}
            <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#142318] flex items-center gap-2">
                <span>2. Adresse de Livraison</span>
              </h2>

              {/* Zone selector */}
              <div>
                <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                  Zone & Destination de Livraison *
                </label>
                <select
                  value={currentZone?.id || ''}
                  onChange={(e) => {
                    const z = deliveryZones.find((item) => item.id === e.target.value);
                    if (z) {
                      setSelectedZone(z);
                      setCountry(z.country);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                >
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {formatCurrency(z.price)} ({z.estimatedDeliveryTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                    Pays *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Côte d’Ivoire, France, Sénégal..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                    Ville ou Commune *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Cocody Angré, Marcory, Yopougon, Yamoussoukro..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                    Adresse Précise & Repères de Livraison *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Rue des Jardins, non loin de la pharmacie, Immeuble B porte 4..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                    Instructions Particulières pour le Livreur (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Ex: Appeler avant d'arriver, livraison possible après 17h..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Mode de Paiement */}
            <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#142318] flex items-center gap-2">
                <span>3. Mode de Paiement</span>
              </h2>

              <div className="space-y-3">
                {/* Option A: Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-[#1E3324] bg-[#F3ECE0]'
                      : 'border-[#E2D8C9] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="mt-1 text-[#1E3324] focus:ring-[#1E3324]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#142318]">
                        Paiement à la livraison (Espèces)
                      </span>
                      <Banknote className="w-5 h-5 text-[#2C4A32]" />
                    </div>
                    <p className="text-xs text-[#5E6F62] mt-1 leading-relaxed">
                      Réglez directement le livreur en espèces à la réception de votre colis. Aucune avance obligatoire.
                    </p>
                  </div>
                </label>

                {/* Option B: Wave Mobile Money */}
                <label
                  onClick={() => setPaymentMethod('wave')}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'wave'
                      ? 'border-[#1E3324] bg-[#F3ECE0]'
                      : 'border-[#E2D8C9] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wave'}
                    onChange={() => setPaymentMethod('wave')}
                    className="mt-1 text-[#1E3324] focus:ring-[#1E3324]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-[#142318]">
                          WAVE Mobile Money
                        </span>
                        <span className="bg-[#1E3324] text-[#E7D6C0] text-[10px] font-mono font-semibold px-2 py-0.5 rounded">
                          0% frais
                        </span>
                      </div>
                      <CreditCard className="w-5 h-5 text-[#1E3324]" />
                    </div>
                    <p className="text-xs text-[#5E6F62] mt-1 leading-relaxed">
                      Paiement instantané et sécurisé via l'API officielle Wave ou QR code Wave officiel.
                    </p>
                    {!settings.waveApiKeyConfigured && (
                      <div className="mt-2 p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                        Intégration API Wave : clé API en cours de configuration par l'administrateur. La commande sera enregistrée en statut "En attente de paiement Wave".
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#142318] border-b border-[#EAE3D6] pb-3">
                Récapitulatif de Commande
              </h3>

              {/* Items summary */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const unitPrice = item.product.promoPrice ?? item.product.price;
                  return (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.images[0] || '/assets/aistudio/image_84890492.png'}
                          alt=""
                          className="w-10 h-10 rounded-md object-cover bg-stone-200 shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-medium text-[#142318] truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-[#738475]">
                            Qté : {item.quantity} × {formatCurrency(unitPrice)}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold tabular-nums text-[#142318] shrink-0">
                        {formatCurrency(unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#EAE3D6] space-y-2 text-xs text-[#5E6F62]">
                <div className="flex justify-between">
                  <span>Sous-total articles :</span>
                  <span className="font-mono tabular-nums text-[#142318]">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#2C4A32]">
                    <span>Réduction promo ({appliedCoupon?.code}) :</span>
                    <span className="font-mono tabular-nums">
                      -{formatCurrency(couponDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frais de livraison ({currentZone?.name.split('(')[0].trim()}) :</span>
                  <span className="font-mono tabular-nums text-[#142318]">
                    {isFreeDelivery ? (
                      <span className="text-[#2C4A32] font-semibold">Gratuit</span>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#EAE3D6] flex justify-between items-baseline text-sm font-bold text-[#142318]">
                  <span>Total à régler :</span>
                  <span className="font-mono text-xl text-[#1E3324] tabular-nums">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#1E3324] hover:bg-[#2C4A32] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Traitement en cours...'
                    : `Confirmer ma commande (${formatCurrency(grandTotal)})`}
                </span>
              </button>

              <div className="text-[11px] text-[#738475] text-center space-y-1 pt-1">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2C4A32]" />
                  <span>Commande enregistrée sans passer par WhatsApp</span>
                </p>
                <p>Numéro de référence unique généré dès validation</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
