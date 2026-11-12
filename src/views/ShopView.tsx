import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { formatCurrency } from '../lib/formatters';

export const ShopView: React.FC = () => {
  const { products, categories } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(30000);

  // Active products filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Stock filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Max price filter
      const price = p.promoPrice ?? p.price;
      if (price > maxPrice) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.shortDescription.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
        const matchIngredient = p.ingredients?.some((ing) => ing.toLowerCase().includes(query));
        return matchName || matchDesc || matchIngredient;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.promoPrice ?? a.price;
      const priceB = b.promoPrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // 'featured'
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    setInStockOnly(false);
    setMaxPrice(30000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Title & Introduction */}
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#35533B]">
          Catalogue Officiel
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142318] mt-1">
          Nos Tisanes & Soins Botaniques
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6F62] mt-2 leading-relaxed">
          Commandez directement vos cures végétales pour réparer la digestion et favoriser une prise de poids naturelle.
        </p>
      </div>

      {/* Control Bar: Search & Category Buttons */}
      <div className="space-y-4 bg-[#FAF7F2] p-3.5 sm:p-6 rounded-2xl border border-[#E7DECE] max-w-full">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738475]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une tisane, un ingrédient (gingembre, fenugrec, menthe...)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs sm:text-sm text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      

        {/* Secondary filters: Sort, Max Price, In Stock */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EAE3D6] text-xs text-[#5E6F62]">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#142318]">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#D5CBBF] rounded-lg px-2.5 py-1.5 text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#1E3324]"
              >
                <option value="featured">Populaires & Best-Sellers</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom alphabétique</option>
              </select>
            </div>

            {/* In stock checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#D5CBBF] text-[#1E3324] focus:ring-[#1E3324]"
              />
              <span>En stock uniquement</span>
            </label>
          </div>

          {/* Reset Filters button if active */}
          {(selectedCategory !== 'all' || searchQuery || inStockOnly || sortBy !== 'featured') && (
            <button
              onClick={resetFilters}
              className="text-[#1E3324] hover:underline font-semibold text-xs"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#5E6F62]">
        <span>
          {filteredProducts.length}{' '}
          {filteredProducts.length > 1 ? 'produits trouvés' : 'produit trouvé'}
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-12 text-center max-w-lg mx-auto">
          <p className="font-serif text-lg font-semibold text-[#142318] mb-2">
            Aucun produit ne correspond à vos critères
          </p>
          <p className="text-xs text-[#5E6F62] mb-6 leading-relaxed">
            Essayez d'élargir votre recherche ou de réinitialiser les filtres de catégorie.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#1E3324] text-white rounded-xl text-xs font-semibold hover:bg-[#2C4A32] transition-colors"
          >
            Afficher toutes les tisanes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
