import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDateTime } from '../lib/formatters';
import {
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  ArrowRight,
  Printer,
  Search,
  AlertCircle,
  CreditCard,
  Banknote,
} from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { lastConfirmedOrder, setCurrentView } = useStore();

  if (!lastConfirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-xs text-[#5E6F62] mb-4">Aucune commande récente à afficher.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-2.5 bg-[#1E3324] text-white rounded-xl text-xs font-semibold"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  const order = lastConfirmedOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in duration-200">
      {/* Success Badge Banner */}
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-3xl p-8 sm:p-10 text-center shadow-sm relative overflow-hidden mb-8">
        <div className="w-16 h-16 rounded-full bg-[#E5EFE7] text-[#1E3324] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-[#35533B]">
          Commande Enregistrée
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142318] mt-1 mb-2">
          Merci pour votre commande, {order.customerName} !
        </h1>

        <p className="text-xs sm:text-sm text-[#5E6F62] max-w-md mx-auto leading-relaxed">
          Votre commande a été transmise à notre atelier de préparation. Conservez précieusement votre référence pour le suivi.
        </p>

        {/* Order Reference Box */}
        <div className="mt-6 inline-flex flex-col items-center p-4 bg-white border border-[#D5CBBF] rounded-2xl shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-[#738475] font-medium">
            Référence Unique de Commande
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#1E3324] tracking-widest mt-0.5 select-all">
            {order.reference}
          </span>
          <span className="text-[10px] text-[#738475] mt-1">
            Date : {formatDateTime(order.createdAt)}
          </span>
        </div>
      </div>

      {/* Payment & Status Note */}
      <div className="mb-8 p-5 bg-[#F4EFE6] border border-[#E2D8C9] rounded-2xl text-xs text-[#3E4E42] space-y-2">
        <div className="flex items-center gap-2 font-semibold text-[#142318]">
          {order.paymentMethod === 'wave' ? (
            <>
              <CreditCard className="w-4 h-4 text-[#1E3324]" />
              <span>Règlement : WAVE Mobile Money</span>
            </>
          ) : (
            <>
              <Banknote className="w-4 h-4 text-[#2C4A32]" />
              <span>Règlement : Espèces à la livraison</span>
            </>
          )}
        </div>
        <p className="leading-relaxed">
          {order.paymentMethod === 'cash_on_delivery'
            ? `Vous réglerez la somme exacte de ${formatCurrency(order.total)} directement à notre livreur lors de la remise de votre colis.`
            : `Paiement Wave enregistré. Un agent du service client confirmera la réception du transfert vers le compte marchand FAVEDA.`}
        </p>
      </div>

      {/* Order Details Receipt */}
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-4">
          <h2 className="font-serif text-xl font-bold text-[#142318]">
            Détails du Reçu
          </h2>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs text-[#5E6F62] hover:text-[#1E3324] px-3 py-1.5 border border-[#D5CBBF] rounded-lg bg-white"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer le reçu</span>
          </button>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5E6F62] border-b border-[#EAE3D6] pb-6">
          <div>
            <h3 className="font-semibold text-[#142318] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#1E3324]" />
              <span>Client & Contact</span>
            </h3>
            <p className="text-[#142318] font-medium">{order.customerName}</p>
            <p>Tél : {order.customerPhone}</p>
            {order.customerEmail && <p>Email : {order.customerEmail}</p>}
          </div>

          <div>
            <h3 className="font-semibold text-[#142318] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1E3324]" />
              <span>Adresse de Destination</span>
            </h3>
            <p className="text-[#142318] font-medium">{order.city}, {order.country}</p>
            <p>{order.address}</p>
            {order.instructions && (
              <p className="italic text-[#738475] mt-1">Note : {order.instructions}</p>
            )}
            <p className="text-[#35533B] font-medium mt-1">Zone : {order.deliveryZoneName}</p>
          </div>
        </div>

        {/* Purchased Items Table */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#142318] uppercase tracking-wider text-[11px]">
            Articles Commandés
          </h3>
          <div className="divide-y divide-[#EAE3D6]">
            {order.items.map((item, index) => (
              <div key={index} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                  />
                  <div>
                    <p className="font-semibold text-[#142318]">{item.productName}</p>
                    <p className="text-[#738475] font-mono tabular-nums">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-[#142318] tabular-nums">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-[#EAE3D6] space-y-2 text-xs text-[#5E6F62]">
          <div className="flex justify-between">
            <span>Sous-total articles :</span>
            <span className="font-mono tabular-nums text-[#142318]">
              {formatCurrency(order.subtotal)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#2C4A32]">
              <span>Réduction appliquée :</span>
              <span className="font-mono tabular-nums">
                -{formatCurrency(order.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Frais d'expédition ({order.deliveryZoneName.split('(')[0].trim()}) :</span>
            <span className="font-mono tabular-nums text-[#142318]">
              {order.deliveryFee === 0 ? 'Gratuit' : formatCurrency(order.deliveryFee)}
            </span>
          </div>
          <div className="pt-2 border-t border-[#EAE3D6] flex justify-between items-baseline text-sm font-bold text-[#142318]">
            <span>Total :</span>
            <span className="font-mono text-xl text-[#1E3324] tabular-nums">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => {
            setCurrentView('tracking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#1E3324] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>Suivre ma commande en temps réel</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#D5CBBF] text-[#142318] hover:bg-[#F2ECE1] text-xs font-semibold rounded-xl transition-colors"
        >
          Continuer sur la boutique
        </button>
      </div>
    </div>
  );
};
