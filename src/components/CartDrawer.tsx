import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/formatters';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    couponDiscount,
    selectedZone,
    setSelectedZone,
    deliveryZones,
    setCurrentView,
    settings,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const deliveryFee = selectedZone ? selectedZone.price : 0;
  const isFreeDelivery =
    settings.freeDeliveryThreshold &&
    cartSubtotal >= settings.freeDeliveryThreshold &&
    selectedZone?.country === 'Côte d’Ivoire';

  const effectiveDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const grandTotal = Math.max(0, cartSubtotal + effectiveDeliveryFee - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCouponCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError(null);
      setPromoInput('');
    }
  };

  const proceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col border-l border-[#E2D8C9]">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E0D2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1E3324]" />
              <h2 className="font-serif text-xl font-bold text-[#1A261D]">
                Votre Panier
              </h2>
              <span className="text-xs bg-[#EAE2D5] px-2 py-0.5 rounded text-[#4E5E50] font-mono tabular-nums">
                {cart.length} {cart.length > 1 ? 'articles' : 'article'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#5E6E60] hover:text-[#1A261D] rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#5E6E60]">
                <div className="w-16 h-16 rounded-full bg-[#EFE9DE] flex items-center justify-center mb-4 text-[#8C9C8E]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1A261D] mb-1">
                  Votre panier est vide
                </h3>
                <p className="text-xs max-w-xs mb-6 text-[#6C7D6E]">
                  Découvrez nos tisanes traditionnelles pour réparer le ventre et favoriser votre bien-être.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-5 py-2.5 bg-[#1E3324] text-white rounded-lg text-xs font-semibold hover:bg-[#2C4A32] transition-colors"
                >
                  Voir la boutique
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const unitPrice = item.product.promoPrice ?? item.product.price;
                const itemTotal = unitPrice * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-white/70 border border-[#EAE3D6] rounded-xl"
                  >
                    <img
                      src={item.product.images[0] || '/assets/aistudio/image_84890492.png'}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-lg object-cover bg-[#F2EDE4] shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#1A261D] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-[#738475] font-mono tabular-nums">
                            {formatCurrency(unitPrice)} l'unité
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#9CA3AF] hover:text-red-700 p-1 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity Stepper & Line Total */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EAE0]">
                        <div className="flex items-center border border-[#D5CBBF] rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 text-[#5E6E60] hover:bg-stone-100"
                            aria-label="Moins"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-semibold tabular-nums text-[#1A261D]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 text-[#5E6E60] hover:bg-stone-100 disabled:opacity-40"
                            aria-label="Plus"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-xs font-bold text-[#1E3324] tabular-nums">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Calculations (Only if cart has items) */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8E0D2] bg-[#F7F3EB] space-y-4">
              {/* Promo code form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#E8F0EA] border border-[#B8D4BE] rounded-lg text-xs">
                  <div className="flex items-center gap-2 text-[#1E3324]">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-semibold">Code : {appliedCoupon.code}</span>
                    <span className="text-[#3B6645]">
                      (-{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : formatCurrency(appliedCoupon.discountValue)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-red-700 text-xs font-medium"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError(null);
                    }}
                    placeholder="Code promo (ex: BIENVENUE)"
                    className="flex-1 text-xs px-3 py-2 bg-white border border-[#D5CBBF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-semibold bg-[#2C4A32] text-white rounded-lg hover:bg-[#1E3324] transition-colors"
                  >
                    Appliquer
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-red-600">{promoError}</p>
              )}

              {/* Delivery Zone Selector preview */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#5E6E60] uppercase tracking-wider">
                  Zone de livraison :
                </label>
                <select
                  value={selectedZone?.id || ''}
                  onChange={(e) => {
                    const found = deliveryZones.find((z) => z.id === e.target.value);
                    if (found) setSelectedZone(found);
                  }}
                  className="w-full text-xs p-2 bg-white border border-[#D5CBBF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3324] text-[#1A261D]"
                >
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} - {formatCurrency(z.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5E6E60] pt-2 border-t border-[#E2D8C9]">
                <div className="flex justify-between">
                  <span>Sous-total articles :</span>
                  <span className="font-mono tabular-nums text-[#1A261D]">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#2C4A32]">
                    <span>Réduction code :</span>
                    <span className="font-mono tabular-nums">
                      -{formatCurrency(couponDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frais de livraison :</span>
                  <span className="font-mono tabular-nums text-[#1A261D]">
                    {isFreeDelivery ? (
                      <span className="text-[#2C4A32] font-semibold">Gratuit</span>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#1A261D] pt-2 border-t border-[#E2D8C9]">
                  <span>Total estimé :</span>
                  <span className="font-mono text-base text-[#1E3324] tabular-nums">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={proceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#1E3324] hover:bg-[#2C4A32] text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Passer la commande</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#738475] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2C4A32]" />
                <span>Paiement à la livraison ou Wave Mobile Money</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
