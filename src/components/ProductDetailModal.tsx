import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/formatters';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    products,
    setCurrentView,
    addToCart,
    openProductDetail,
    setIsCartOpen,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'usage' | 'precautions'>('desc');

  const product = products.find((p) => p.id === selectedProductId);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-600 mb-4">Produit introuvable.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-4 py-2 bg-[#1E3324] text-white rounded-lg text-sm"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const price = product.price;
  const promoPrice = product.promoPrice;
  const currentPrice = promoPrice ?? price;

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.isActive)
    .slice(0, 3);

  // const images = product.images.length > 0
  //   ? product.images
  //   : ['/assets/aistudio/image_84890492.png'];

  const images =  ['/assets/product_tisane_digestive_1794416169202.jpg', '/assets/product_tisane_digestive_1794416169202.jpg'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-2 text-sm text-[#5E6E60] hover:text-[#1E3324] mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Retour à la boutique</span>
      </button>

      {/* Main PDP Grid (Sticky Gallery Left, Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#F2EDE4] border border-[#E8E0D2] shadow-sm relative">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {promoPrice && (
              <span className="absolute top-4 left-4 bg-[#1E3324] text-[#F4EFE6] text-xs font-semibold px-2.5 py-1 rounded tracking-wide uppercase">
                Prix Réduit
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#1E3324] shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Botanical Trust Callout */}
          <div className="p-4 bg-[#F5EFE3] rounded-xl border border-[#E5DAC7] text-xs text-[#4E5D50] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#2C4A32] shrink-0" />
              <span>100% Ingrédients naturels de tradition</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2C4A32] shrink-0" />
              <span>Expédition Côte d'Ivoire & International</span>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module (6 cols) */}
        <div className="lg:col-span-6 lg:pl-4 space-y-6">
          {/* Metadata */}
          <div>
        

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A261D] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price display */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-bold text-3xl font-bold text-[#1E3324] tabular-nums">
                {formatCurrency(currentPrice)}
              </span>
              {promoPrice && (
                <span className="font-bold text-lg text-[#8B9B8D] line-through tabular-nums">
                  {formatCurrency(price)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              {product.stock > 0 ? (
                <span className="text-[#2C4A32] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2C4A32]" />
                  En stock ({product.stock} unités disponibles)
                </span>
              ) : (
                <span className="text-red-700 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-700" />
                  Rupture de stock temporaire
                </span>
              )}
            </div>
          </div>

          {/* Short narrative summary */}
          <p className="text-sm text-[#4E5E50] leading-relaxed border-t border-[#EAE3D6] pt-4">
            {product.shortDescription}
          </p>

          {/* Quantity selector & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-medium text-[#4E5E50] uppercase tracking-wider">
                Quantité :
              </label>
              <div className="flex items-center border border-[#D5CBBF] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-[#4E5E50] hover:bg-[#F2ECE1] disabled:opacity-40 transition-colors"
                  aria-label="Diminuer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 font-mono text-sm font-semibold tabular-nums text-[#1A261D]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2 text-[#4E5E50] hover:bg-[#F2ECE1] disabled:opacity-40 transition-colors"
                  aria-label="Augmenter"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 bg-[#1E3324] text-white hover:bg-[#2C4A32] disabled:bg-[#E5DFD3] disabled:text-[#8E8679] disabled:cursor-not-allowed font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ajouter au panier</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 bg-[#E2D4C0] text-[#1E3324] hover:bg-[#D9C8B0] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm rounded-xl transition-colors"
              >
                Commander directement
              </button>
            </div>
            <p className="text-[11px] text-center text-[#738475]">
              Commande en ligne directe · Paiement sécurisé ou à la livraison disponible
            </p>
          </div>

          {/* Sectioned Tab details: Description, Ingredients, Usage, Precautions */}
          <div className="border-t border-[#EAE3D6] pt-6">
            <div className="flex border-b border-[#EAE3D6] gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('desc')}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === 'desc'
                    ? 'border-[#1E3324] text-[#1E3324]'
                    : 'border-transparent text-[#738475] hover:text-[#1E3324]'
                }`}
              >
                Description Complète
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === 'ingredients'
                    ? 'border-[#1E3324] text-[#1E3324]'
                    : 'border-transparent text-[#738475] hover:text-[#1E3324]'
                }`}
              >
                Ingrédients & Composition
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === 'usage'
                    ? 'border-[#1E3324] text-[#1E3324]'
                    : 'border-transparent text-[#738475] hover:text-[#1E3324]'
                }`}
              >
                Mode d'Emploi
              </button>
              <button
                onClick={() => setActiveTab('precautions')}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === 'precautions'
                    ? 'border-[#1E3324] text-[#1E3324]'
                    : 'border-transparent text-[#738475] hover:text-[#1E3324]'
                }`}
              >
                Précautions
              </button>
            </div>

            <div className="py-4 text-sm text-[#3E4E40] leading-relaxed">
              {activeTab === 'desc' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  {product.origin && (
                    <div className="text-xs text-[#738475] pt-2">
                      <span className="font-semibold text-[#1A261D]">Origine :</span> {product.origin}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div>
                  <h4 className="font-semibold text-[#1A261D] text-xs uppercase tracking-wider mb-2">
                    Composition végétale :
                  </h4>
                  {product.ingredients && product.ingredients.length > 0 ? (
                    <ul className="space-y-1.5 list-disc list-inside">
                      {product.ingredients.map((ing, i) => (
                        <li key={i} className="text-[#3E4E40]">{ing}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-500 italic text-xs">
                      Informations sur les ingrédients renseignées par l'administrateur.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#1A261D] text-xs uppercase tracking-wider">
                    Conseils de préparation & posologie :
                  </h4>
                  <p>{product.usageInstructions || "Suivre les indications sur l'emballage."}</p>
                </div>
              )}

              {activeTab === 'precautions' && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-950 space-y-1">
                  <h4 className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    Mises en garde importantes :
                  </h4>
                  <p>{product.precautions || "Tenir hors de portée des jeunes enfants."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#EAE3D6] pt-12">
          <h2 className="font-serif text-2xl font-bold text-[#1A261D] mb-6">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
