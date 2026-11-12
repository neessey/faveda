import React, { useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/formatters';
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Check,
  Plus,
  Star,
  MessageSquare,
  Camera,
  X,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    categories,
    testimonials,
    addTestimonial,
    settings,
    setCurrentView,
    openProductDetail,
    addToCart,
    showToast,
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const reviewCarouselRef = useRef<HTMLDivElement>(null);

  // Review modal state & photo zoom on homepage
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  // Review form states
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formProduct, setFormProduct] = useState(products[0]?.name || 'Tisane Réparation Ventre & Confort Digestif');
  const [formComment, setFormComment] = useState('');
  const [formPhoto, setFormPhoto] = useState('');

  const quickPhotoOptions = [
    { label: 'Thé infusé', url: '/images/hero_botanical_infusion_1794416168590.jpg' },
    { label: 'Sachet reçu', url: '/assets/images/product_tisane_digestive_1794416169202.jpg' },
    { label: 'Pot ambré', url: '/assets/images/product_prise_de_poids_1794416169723.jpg' },
    { label: 'Boîte détox', url: '/assets/images/product_detox_equilibre_1794416170614.jpg' },
  ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      showToast('Veuillez renseigner votre nom et votre avis.', 'error');
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

    showToast('Votre avis a été publié avec succès. Merci de votre confiance !', 'success');
    setIsReviewModalOpen(false);
    setFormName('');
    setFormLocation('');
    setFormRating(5);
    setFormComment('');
    setFormPhoto('');
  };

  // Featured 3 top products for the arched window collection
  const featuredTeas = products
    .filter((p) => p.isActive)
    .slice(0, 3);

  // Strictly 3 reviews on homepage as requested
  const publishedReviews = testimonials.filter((t) => t.isPublished);
  const topThreeReviews = publishedReviews.slice(0, 3);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Veuillez entrer une adresse email valide.', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    showToast('Merci de votre inscription à la lettre d’information FAVEDA !', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION WITH SEAMLESSLY EMBEDDED WAVY RIBBON DEMARCATION */}
    <section className="relative w-full overflow-hidden bg-[#7E9177] flex flex-col justify-between">
  {/* Cinematic Botanical Backdrop with shadow textures */}
  <div className="absolute inset-0 z-0">
    <img src="/assets/hero_botanical_infusion_1794416168590.jpg" alt="Tisane Botanique" className="w-full h-full object-cover object-center opacity-90" />
    {/* Overlay plus marqué pour lisibilité du texte directement sur l'image */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#142318]/80 via-[#1F2B1E]/55 to-[#142318]/80 mix-blend-multiply" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A12]/70 via-transparent to-[#0F1A12]/30" />
  </div>

  {/* Content Container */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24 w-full">
    <div className="max-w-2xl space-y-5 animate-in fade-in duration-300">
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12] [text-wrap:balance] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
        {settings.tagline}
      </h1>

      <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
        Tisanes traditionnelles à base de plantes d’Afrique de l'Ouest pour apaiser les inconforts digestifs, réparer le microbiote et favoriser un gain de poids naturel et harmonieux.
      </p>

      <div className="pt-2">
        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center justify-center px-7 py-3 bg-white text-[#233321] hover:bg-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-xl group"
        >
          <span>Commander</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>

  {/* WAVY S-CURVE RIBBON (inchangé) */}
  <div className="relative w-full z-20 select-none -mb-1 leading-none">
    <svg
      viewBox="0 0 1440 130"
      className="w-full h-20 sm:h-28 md:h-32 block overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <path
          id="wavyRibbonPath"
          d="M -60 65 C 260 135 440 -5 740 65 C 1040 135 1220 -5 1500 65"
          fill="none"
        />
      </defs>

      <path
        d="M -60 91 C 260 161 440 21 740 91 C 1040 161 1220 21 1500 91 L 1500 140 L -60 140 Z"
        fill="#FBF9F5"
      />

      <path
        d="M -60 65 C 260 135 440 -5 740 65 C 1040 135 1220 -5 1500 65"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="52"
      />

      <path
        d="M -60 39 C 260 109 440 -31 740 39 C 1040 109 1220 -31 1500 39"
        fill="none"
        stroke="#2D402F"
        strokeWidth="1.2"
        opacity="0.85"
      />

      <path
        d="M -60 91 C 260 161 440 21 740 91 C 1040 161 1220 21 1500 91"
        fill="none"
        stroke="#2D402F"
        strokeWidth="1.2"
        opacity="0.85"
      />

      <text className="text-[14px] sm:text-[13px] font-sans font-semibold uppercase tracking-[0.22em] fill-[#2D402F]">
        <textPath href="#wavyRibbonPath" startOffset="0%">
          ✦ FAVEDA BOTANICALS 🌿 SOINS 100% NATURELS 🍃 BIEN-ÊTRE DIGESTIF ✦ PRISE DE POIDS HARMONIEUSE 🌿 FORMULATIONS ANCESTRALES ✦ EXPÉDITION DANS LE MONDE ENTIER ✦
        </textPath>
      </text>
    </svg>
  </div>
</section>

      {/* 2. FEATURED COLLECTION (Immediately below the wave demarcation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Centered Serif Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A261D]">
            Featured Collection
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6F62] mt-2">
            Nos tisanes signatures les plus plébiscitées pour le ventre et la silhouette
          </p>
        </div>

        {/* 3 Arched Product Cards (Exact aesthetic from user reference) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {featuredTeas.map((prod, index) => {
            const badgeLabels = ['Coup de Cœur', 'Formule Phare', 'Bien-Être Digestif'];
            const badge = badgeLabels[index % badgeLabels.length];
            const currentPrice = prod.promoPrice ?? prod.price;

            return (
              <div
                key={prod.id}
                className={`flex flex-col items-center text-center group cursor-pointer ${index === 2 ? 'col-span-2 md:col-span-1 w-1/2 md:w-full justify-self-center' : ''}`}
                
              >
                {/* Arched Window Image Container */}
                <div className="w-full relative aspect-[3/4] rounded-t-[160px] rounded-b-2xl overflow-hidden bg-[#D8E2D2] shadow-md border border-[#C5D4BD]/60 transition-transform duration-300 group-hover:-translate-y-1">
                  <img
                    src= '/assets/product_tisane_digestive_1794416169202.jpg'
                    alt={prod.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Circular Sticker Badge floating on top-right (like "Cult Favorite" in reference photo) */}
                  <div className="absolute top-5 right-5 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#EBE3D3]/90 backdrop-blur-xs border border-[#C9BFA8] flex items-center justify-center p-2 text-center shadow-sm">
                    <span className="font-serif text-[10px] sm:text-[11px] font-medium text-[#2F3E2C] leading-tight select-none">
                      {badge}
                    </span>
                  </div>
                </div>

               
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. BOTANICAL PHILOSOPHY BANNER (Warm Ivory & Sage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border border-[#E7DECE] rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-5 shadow-xs">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#35533B]">
            La Philosophie FAVEDA
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#142318] [text-wrap:balance]">
            « Un ventre en paix est le point de départ de toute transformation naturelle. »
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5E52] leading-relaxed max-w-2xl mx-auto">
            Nos recettes reposent sur la richesse botanique des plantes médicinales traditionnelles. En rétablissant d'abord l'équilibre et le confort du système digestif, votre corps assimile de façon optimale les nutriments pour révéler des rondeurs naturelles sans additifs chimiques.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#35533B] hover:text-[#1A261D] transition-colors"
            >
              <span>Découvrir l'ensemble de notre catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. AVIS CLIENTS VÉRIFIÉS (Strictly 3 reviews + Button to dedicated reviews page + Real review modal) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
           
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#142318] mt-1.5">
              Ce que disent nos clientes
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6F62] mt-1 max-w-xl">
              Retours authentiques sur le dégonflement du ventre, le transit et le bien-être avec FAVEDA.
            </p>
          </div>

        
        </div>

        {/* Review carousel */}
        <div
          ref={reviewCarouselRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {topThreeReviews.map((rev) => (
            <div
              key={rev.id}
              className="w-[85%] sm:w-96 shrink-0 snap-start bg-[#FAF7F2] border border-[#E7DECE] rounded-xl p-3 flex items-center gap-3 hover:border-[#D1C4B0] transition-all shadow-xs"
            >
              <div className="min-w-0 flex-1">
                {/* Compact header: Stars + Date */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'fill-current text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#849586]">
                    {formatDate(rev.date)}
                  </span>
                </div>

              

                {/* Customer Comment */}
                <p className="font-serif text-xs text-[#1E2E20] leading-relaxed italic line-clamp-2">
                  « {rev.comment} »
                </p>
              </div>

              {/* Compact customer details */}
              <div className="shrink-0 flex flex-col items-center gap-1.5 border-l border-[#EAE2D4] pl-3">
                {rev.customerPhoto && (
                  <button
                    type="button"
                    onClick={() => setZoomPhoto(rev.customerPhoto || null)}
                    className="group/photo relative block w-10 h-10 rounded-full overflow-hidden border border-[#D5CBBF] bg-[#F0EBE1] hover:opacity-95 transition-all"
                    aria-label={`Agrandir la photo de ${rev.customerName}`}
                  >
                    <img 
                      src={rev.customerPhoto}
                      alt={`Photo de ${rev.customerName}`}
                      className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                    />
                  </button>
                )}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold text-[11px] text-[#142318]">
                      {rev.customerName}
                    </span>
                    {rev.isVerified && (
                      <span
                        title="Achat vérifié"
                        className="inline-flex items-center text-[9px] text-[#2C5234] font-medium bg-[#E2EDE2] p-0.5 rounded-full"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#697B6B] block">
                    {rev.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
  <div className="flex items-center gap-2.5 sm:self-end">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2.5 bg-white border border-[#C5D0C3] hover:border-[#334630] text-[#1E3324] text-xs font-semibold rounded-full transition-all flex items-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#35533B]" />
              <span>Laisser un avis</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('reviews');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-[#334630] hover:bg-[#233321] text-white text-xs font-semibold rounded-full transition-all flex items-center gap-2 shadow-xs group"
            >
              <span>Voir tous les avis ({publishedReviews.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
       
      </section>

      {/* 6. NEWSLETTER SUBSCRIPTION (Minimalist Botanical Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border border-[#E8E0D2] rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#35533B]">
            Lettre Botanique
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142318] mt-1 mb-2">
            Restez informée de nos arrivages & conseils
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6F62] max-w-md mx-auto mb-6 leading-relaxed">
            Recevez nos astuces de préparation et nos offres de livraison en avant-première.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Votre adresse email..."
              required
              className="flex-1 px-4 py-3 bg-white border border-[#D5CBBF] rounded-full text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
            />
            <button
              type="submit"
              className="px-7 py-3 bg-[#334630] hover:bg-[#233321] text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-colors shrink-0"
            >
              S'inscrire
            </button>
          </form>
          {newsletterSubscribed && (
            <p className="text-xs text-[#2C4A32] font-medium mt-3">
              Inscription confirmée avec succès !
            </p>
          )}
        </div>
      </section>

      {/* Review Submission Modal on Homepage */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border border-[#DDD3C4] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#6D7E70] hover:text-[#1E3324] rounded-full hover:bg-[#EFE8DC] transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#35533B]">
                Partagez Votre Expérience
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#142318] mt-1">
                Laisser mon avis sur FAVEDA
              </h3>
              <p className="text-xs text-[#5E6F62] mt-1">
                Votre témoignage aide d'autres femmes à choisir la bonne tisane.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating selection */}
              <div>
                <label className="block text-xs font-semibold text-[#1E3324] mb-1.5">
                  Votre note globale *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formRating
                              ? 'text-amber-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#1E3324] ml-2">
                    {formRating === 5 && 'Excellent (5/5)'}
                    {formRating === 4 && 'Très bien (4/5)'}
                    {formRating === 3 && 'Bien (3/5)'}
                    {formRating === 2 && 'Moyen (2/5)'}
                    {formRating === 1 && 'Décevant (1/5)'}
                  </span>
                </div>
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E3324] mb-1">
                    Votre prénom / nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Awa K., Estelle M."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E3324] mb-1">
                    Ville ou Pays
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Ex: Abidjan, Cocody, Paris"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                  />
                </div>
              </div>

              {/* Product used */}
              <div>
                <label className="block text-xs font-semibold text-[#1E3324] mb-1">
                  Tisane ou produit utilisé
                </label>
                <select
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Cure Complète FAVEDA">Cure Complète FAVEDA</option>
                </select>
              </div>

              {/* Written comment */}
              <div>
                <label className="block text-xs font-semibold text-[#1E3324] mb-1">
                  Votre retour d’expérience *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Décrivez les résultats obtenus sur votre ventre, digestion, appétit ou silhouette..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630] resize-none"
                />
              </div>

              {/* Customer Photo */}
              <div>
                <label className="block text-xs font-semibold text-[#1E3324] mb-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#35533B]" />
                  <span>Joindre une photo (optionnel)</span>
                </label>
                <p className="text-[11px] text-[#697B6B] mb-2">
                  Choisissez une photo de votre tisane préparée ou de votre sachet reçu :
                </p>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {quickPhotoOptions.map((opt) => (
                    <button
                      key={opt.url}
                      type="button"
                      onClick={() => setFormPhoto(formPhoto === opt.url ? '' : opt.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        formPhoto === opt.url
                          ? 'border-[#334630] ring-2 ring-[#334630]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] py-0.5 text-center truncate">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  placeholder="Ou collez un lien d'image externe..."
                  className="w-full px-3.5 py-2 bg-white border border-[#D5CBBF] rounded-xl text-xs text-[#142318] focus:outline-none focus:ring-1 focus:ring-[#334630]"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5E6F62] hover:text-[#1E3324]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#334630] hover:bg-[#233321] text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-colors shadow-xs"
                >
                  Publier mon avis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox photo zoom */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#18261B] rounded-2xl overflow-hidden p-2 shadow-2xl border border-white/20"
          >
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomPhoto}
              alt="Photo agrandie"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            <p className="text-center text-xs text-[#D8CFBF] mt-3 pb-1">
              Photo client authentique · FAVEDA Botanicals
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
