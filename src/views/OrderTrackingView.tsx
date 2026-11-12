import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { formatCurrency, formatDateTime } from '../lib/formatters';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  HelpCircle,
  Phone,
  Calendar,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { findOrderByRefAndPhone, lastConfirmedOrder, settings } = useStore();

  const [refInput, setRefInput] = useState(lastConfirmedOrder?.reference || '');
  const [phoneInput, setPhoneInput] = useState(lastConfirmedOrder?.customerPhone || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(lastConfirmedOrder || null);
  const [hasSearched, setHasSearched] = useState(Boolean(lastConfirmedOrder));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!refInput.trim()) {
      setErrorMessage('Veuillez renseigner votre référence de commande (ex: FAV-2026-XXXX).');
      return;
    }
    if (!phoneInput.trim()) {
      setErrorMessage('Veuillez renseigner le numéro de téléphone utilisé lors de la commande.');
      return;
    }

    const found = findOrderByRefAndPhone(refInput, phoneInput);
    setHasSearched(true);

    if (found) {
      setSearchedOrder(found);
      setErrorMessage(null);
    } else {
      setSearchedOrder(null);
      setErrorMessage(
        'Aucune commande trouvée avec cette référence et ce numéro de téléphone. Vérifiez votre saisie ou contactez notre assistance.'
      );
    }
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'En attente', desc: 'Commande enregistrée dans notre système' },
    { key: 'confirmed', label: 'Confirmée', desc: 'Commande vérifiée et validée' },
    { key: 'preparing', label: 'En préparation', desc: 'Conditionnement des plantes et mise sous pli' },
    { key: 'shipped', label: 'Expédiée', desc: 'Colis confié au livreur ou transporteur' },
    { key: 'delivered', label: 'Livrée', desc: 'Colis remis au destinataire' },
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = steps.findIndex((s) => s.key === currentStatus);
    const stepIndex = steps.findIndex((s) => s.key === stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-in fade-in duration-200">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#35533B]">
          Suivi de Colis en Ligne
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142318] mt-1">
          Où en est votre commande ?
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6F62] mt-2 leading-relaxed">
          Suivez l’acheminement de vos tisanes en temps réel grâce à votre référence et votre numéro de téléphone.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                Référence de Commande (ex: FAV-2026-XXXX) *
              </label>
              <input
                type="text"
                required
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder="FAV-2026-..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs font-mono uppercase tracking-wider text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4E5E52] mb-1">
                Numéro de Téléphone utilisé lors de l'achat *
              </label>
              <input
                type="tel"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Ex: 07 89 52 74 84"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-[#1E3324] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Rechercher ma commande</span>
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Order Result */}
      {searchedOrder && (
        <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D6] pb-6">
            <div>
              <span className="text-[11px] font-mono text-[#738475] uppercase tracking-wider">
                Commande n° {searchedOrder.reference}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#142318] mt-0.5">
                Statut :{' '}
                <span className="text-[#1E3324]">
                  {steps.find((s) => s.key === searchedOrder.status)?.label || searchedOrder.status}
                </span>
              </h2>
              <p className="text-xs text-[#5E6F62] mt-1">
                Enregistrée le {formatDateTime(searchedOrder.createdAt)}
              </p>
            </div>

            <div className="p-3 bg-white border border-[#D5CBBF] rounded-xl text-right sm:text-right">
              <span className="text-[10px] text-[#738475] block uppercase tracking-wider">
                Montant total
              </span>
              <span className="font-mono text-base font-bold text-[#1E3324] tabular-nums">
                {formatCurrency(searchedOrder.total)}
              </span>
              <span className="text-[11px] text-[#5E6F62] block mt-0.5">
                {searchedOrder.paymentMethod === 'cash_on_delivery'
                  ? 'Paiement à la livraison'
                  : 'Paiement Wave'}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          {searchedOrder.status !== 'cancelled' ? (
            <div className="py-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#35533B] mb-6">
                Évolution de l'acheminement
              </h3>
              <div className="relative space-y-4 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-4">
                <div className="sm:hidden absolute left-4 top-4 bottom-4 w-0.5 bg-[#D5CBBF] z-0" />
                {steps.map((step, idx) => {
                  const state = getStepStatus(step.key, searchedOrder.status);
                  return (
                    <div
                      key={step.key}
                      className="relative z-10 flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2"
                    >
                      {/* Circle Indicator */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-colors shadow-xs ${
                          state === 'completed'
                            ? 'bg-[#1E3324] text-white'
                            : state === 'current'
                            ? 'bg-[#2C4A32] text-white ring-4 ring-[#2C4A32]/20'
                            : 'bg-white border border-[#D5CBBF] text-[#8C9C8E]'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      {/* Text */}
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            state === 'current' || state === 'completed'
                              ? 'text-[#142318]'
                              : 'text-[#8C9C8E]'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[11px] text-[#738475] hidden sm:block mt-0.5 leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
              Cette commande a été annulée. Contactez notre support pour tout renseignement.
            </div>
          )}

          {/* Delivery & Carrier Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white border border-[#EAE3D6] rounded-2xl text-xs text-[#5E6F62]">
            <div>
              <p className="font-semibold text-[#142318] uppercase text-[11px] mb-1">
                Destinataire & Adresse
              </p>
              <p className="font-medium text-[#142318]">{searchedOrder.customerName}</p>
              <p>{searchedOrder.address}, {searchedOrder.city}</p>
              <p>{searchedOrder.country}</p>
            </div>

            <div>
              <p className="font-semibold text-[#142318] uppercase text-[11px] mb-1">
                Suivi Transporteur & Expédition
              </p>
              <p>
                <span className="font-medium text-[#142318]">Numéro de suivi :</span>{' '}
                <span className="font-mono text-[#1E3324] font-semibold">{searchedOrder.trackingNumber || 'En cours d’attribution'}</span>
              </p>
              <p className="mt-1">{searchedOrder.carrierNotes || 'Livraison selon le créneau convenu.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Help Callout */}
      <div className="p-6 bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl text-xs text-[#5E6F62] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-[#1E3324] shrink-0" />
          <div>
            <p className="font-semibold text-[#142318]">Une question sur votre livraison ?</p>
            <p>Notre équipe répond à vos appels : {settings.phone1} / {settings.phone2}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
