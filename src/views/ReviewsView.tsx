import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../lib/formatters';
import {
  Star,
  Check,
  Plus,
  Image as ImageIcon,
  Camera,
  Filter,
  ArrowLeft,
  X,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { testimonials, addTestimonial, products, setCurrentView, showToast } = useStore();

  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  // Form states for new review
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formProduct, setFormProduct] = useState(products[0]?.name || 'Tisane Réparation Ventre & Confort Digestif');
  const [formComment, setFormComment] = useState('');
  const [formPhoto, setFormPhoto] = useState('');

  // Sample photos to choose from easily for mobile users
  const quickPhotoOptions = [
    { label: 'Thé infusé', url: '/assets/images/hero_botanical_infusion_1794416168590.jpg' },
    { label: 'Sachet reçu', url: '/assets/images/product_tisane_digestive_1794416169202.jpg' },
    { label: 'Pot ambré', url: '/assets/images/product_prise_de_poids_1794416169723.jpg' },
    { label: 'Boîte détox', url: '/assets/images/product_detox_equilibre_1794416170614.jpg' },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      showToast('Veuillez remplir votre nom et votre commentaire.', 'error');
      return;
    }

    addTestimonial({
      customerName: formName.trim(),
      location: formLocation.trim() || 'Côte d’Ivoire',
      rating: formRating,
      comment: formComment.trim(),
      productUsed: formProduct,
      customerPhoto: formPhoto.trim() || undefined,
      isVerified: true,
      isPublished: true,
    });

    showToast('Votre avis a été publié avec succès. Merci pour votre retour !', 'success');
    setIsModalOpen(false);
    // Reset form
    setFormName('');
    setFormLocation('');
    setFormRating(5);
    setFormComment('');
    setFormPhoto('');
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return testimonials.filter((t) => {
      if (!t.isPublished) return false;
      if (filterRating !== 'all' && t.rating !== filterRating) return false;
      if (onlyWithPhoto && !t.customerPhoto) return false;
      if (selectedProductFilter !== 'all' && t.productUsed !== selectedProductFilter) return false;
      return true;
    });
  }, [testimonials, filterRating, onlyWithPhoto, selectedProductFilter]);

  const totalReviews = testimonials.filter((t) => t.isPublished).length;
  const averageRating = totalReviews > 0
    ? (testimonials.filter((t) => t.isPublished).reduce((sum, t) => sum + t.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs text-[#5E6F62] hover:text-[#1E3324] group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Retour à l'accueil</span>
      </button>

      {/* Header Banner */}
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#35533B]">
            Expériences Vérifiées
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142318] mt-1">
            Avis & Témoignages Clientes
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6F62] mt-2 max-w-xl leading-relaxed">
            Découvrez les retours authentiques de nos clientes sur la digestion, le dégonflement du ventre et la prise de poids naturelle avec FAVEDA.
          </p>

          <div className="flex items-center gap-3 mt-4 text-xs">
            <div className="flex items-center gap-1 text-amber-600">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-mono font-bold text-[#142318] text-sm">{averageRating}/5</span>
            <span className="text-[#738475]">· ({totalReviews} avis publiés)</span>
          </div>
        </div>

        {/* CTA to Add Review */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 bg-[#334630] hover:bg-[#233321] text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Laisser mon avis</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Rating filter */}
          <div className="flex items-center gap-2">
            <span className="text-[#5E6F62]">Note :</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-white border border-[#D5CBBF] rounded-lg px-2.5 py-1.5 text-xs text-[#142318] focus:outline-none"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles ★★★★★</option>
              <option value="4">4 étoiles ★★★★☆</option>
            </select>
          </div>

          {/* Only with photo toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 bg-white border border-[#D5CBBF] rounded-lg">
            <input
              type="checkbox"
              checked={onlyWithPhoto}
              onChange={(e) => setOnlyWithPhoto(e.target.checked)}
              className="rounded text-[#334630] focus:ring-[#334630]"
            />
            <span className="flex items-center gap-1.5 text-[#142318]">
              <ImageIcon className="w-3.5 h-3.5 text-[#35533B]" />
              <span>Avec photos ({testimonials.filter((t) => t.isPublished && t.customerPhoto).length})</span>
            </span>
          </label>
        </div>

        <span className="text-[#738475]">
          {filteredReviews.length} avis affichés
        </span>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF7F2] rounded-3xl border border-[#E7DECE] text-xs text-[#5E6F62]">
          Aucun avis ne correspond à vos filtres.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F2] border border-[#E7DECE] rounded-2xl overflow-hidden p-6 flex flex-col justify-between shadow-xs hover:border-[#334630] transition-colors"
            >
              <div className="space-y-4">
                {/* Header: Rating & verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-600">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#2C4A32] font-semibold bg-[#E5EFE7] px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 text-[#2C4A32]" />
                      <span>Achat vérifié</span>
                    </span>
                  )}
                </div>

                {/* Customer Photo (if provided) */}
                {rev.customerPhoto && (
                  <div
                    onClick={() => setZoomPhoto(rev.customerPhoto || null)}
                    className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-200 cursor-pointer group/photo shadow-xs"
                  >
                    <img
                      src={rev.customerPhoto}
                      alt="Photo du retour client"
                      className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium">
                      Agrandir la photo
                    </div>
                  </div>
                )}

                {/* Written review comment */}
                <p className="text-xs sm:text-sm text-[#2E3E30] italic leading-relaxed">
                  « {rev.comment} »
                </p>

                {/* Product Mention */}
                {rev.productUsed && (
                  <div className="text-[11px] text-[#556957] font-medium pt-1">
                    <span className="text-[#738475]">Produit utilisé :</span> {rev.productUsed}
                  </div>
                )}
              </div>

              {/* Author & Date Footer */}
              <div className="pt-4 mt-4 border-t border-[#EAE3D6] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#142318] block">{rev.customerName}</span>
                  <span className="text-[11px] text-[#738475]">{rev.location}</span>
                </div>
                <span className="text-[11px] text-[#8C9C8E]">{formatDate(rev.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Submit Review */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl my-8 space-y-5">
            <div className="flex justify-between items-center border-b border-[#EAE3D6] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#142318]">
                  Partager votre expérience
                </h3>
                <p className="text-xs text-[#5E6F62] mt-0.5">
                  Votre avis aide d'autres personnes à retrouver leur confort digestif.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star selector */}
              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">Votre note *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formRating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-xs text-[#5E6F62] ml-2">
                    {formRating} sur 5
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#4E5E52] mb-1">Votre Prénom / Nom *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Awa K."
                    className="w-full px-3 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4E5E52] mb-1">Ville ou Pays *</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Ex: Abidjan - Cocody"
                    className="w-full px-3 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">Produit concerné *</label>
                <select
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">
                  Votre commentaire d'expérience *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Décrivez vos résultats, le goût, les effets sur votre ventre ou silhouette..."
                  className="w-full px-3 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                />
              </div>

              {/* Photo Attachment (URL or quick selection) */}
              <div>
                <label className="block font-medium text-[#4E5E52] mb-1">
                  Ajouter une photo (Optionnel)
                </label>
                <input
                  type="text"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  placeholder="Collez l'URL de votre photo ou choisissez ci-dessous..."
                  className="w-full px-3 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                />

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[10px] text-[#738475]">Suggestions :</span>
                  {quickPhotoOptions.map((opt, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormPhoto(opt.url)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                        formPhoto === opt.url
                          ? 'bg-[#334630] text-white border-[#334630]'
                          : 'bg-white border-[#D5CBBF] text-[#4E5E52] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {formPhoto && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-white border border-[#D5CBBF] rounded-xl">
                    <img
                      src={formPhoto}
                      alt="Aperçu"
                      className="w-14 h-14 rounded-lg object-cover bg-stone-100"
                    />
                    <div className="text-[11px] text-[#2C4A32] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Photo rattachée à l'avis</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#EAE3D6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5CBBF] rounded-xl text-xs text-[#5E6F62]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#334630] hover:bg-[#233321] text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
                >
                  Publier mon avis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox photo modal */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden bg-black shadow-2xl">
            <img src={zoomPhoto} alt="" className="w-full h-full object-contain" />
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
