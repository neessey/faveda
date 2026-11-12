import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/formatters';
import { ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openProductDetail } = useStore();
  const [imageError, setImageError] = React.useState(false);

  const price = product.price;
  const promoPrice = product.promoPrice;
  const isOutOfStock = product.stock <= 0;

  // const primaryImage = product.images[0] || '/assets/logo.png';
  const primaryImage =  '/assets/product_tisane_digestive_1794416169202.jpg';

  return (
    <div className="group flex flex-col bg-[#FAF7F2] border border-[#EBE4D8] rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
      {/* 1. Image Container (65% visual weight) */}
      <div
        onClick={() => openProductDetail(product.id)}
        className="relative aspect-4/3 w-full overflow-hidden bg-[#F2EDE4] cursor-pointer"
      >
        {!imageError ? (
          <img
            src={primaryImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EFE9DD] text-[#6C7D6F]">
            <span className="font-serif text-lg font-medium text-[#1A261D] mb-1">
              FAVEDA
            </span>
            <span className="text-xs">{product.name}</span>
          </div>
        )}

        {/* Quiet single status indicator (No pill sandwich) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {promoPrice && !isOutOfStock && (
            <span className="bg-[#1E3324] text-[#F4EFE6] text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase">
              Offre Spéciale
            </span>
          )}
          {product.isBestSeller && !promoPrice && !isOutOfStock && (
            <span className="bg-[#EADBC8] text-[#342416] text-[11px] font-medium px-2 py-0.5 rounded tracking-wide">
              Best-Seller
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-stone-800 text-stone-200 text-[11px] font-medium px-2 py-0.5 rounded tracking-wide">
              Rupture
            </span>
          )}
        </div>

        {/* Quick view hover action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openProductDetail(product.id);
          }}
          className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#1A261D] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
          title="Voir la fiche détaillée"
          aria-label="Voir la fiche détaillée"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed clean category metadata */}
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#738475] mb-1">
            {product.categoryName || 'Soin Botanique'}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => openProductDetail(product.id)}
            className="font-serif text-base font-semibold text-[#1A261D] group-hover:text-[#2C4A32] cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#5E6E60] line-clamp-2 mt-1 mb-3 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Buy Action */}
        <div className="pt-2 border-t border-[#EAE3D6] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {promoPrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-sm sm:text-base font-bold text-[#1E3324] tabular-nums">
                  {formatCurrency(promoPrice)}
                </span>
                <span className="font-bold text-xs text-[#8B9B8D] line-through tabular-nums">
                  {formatCurrency(price)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-sm sm:text-base font-bold text-[#1E3324] tabular-nums">
                {formatCurrency(price)}
              </span>
            )}
          
          </div>

          
        </div>
        <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isOutOfStock
                ? 'bg-[#E5DFD3] text-[#8E8679] cursor-not-allowed'
                : 'bg-[#1E3324] text-[#FBF9F5] hover:bg-[#2C4A32] shadow-sm'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
      </div>
    </div>
  );
};
