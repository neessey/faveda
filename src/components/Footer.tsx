import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, MapPin, Mail, ShieldCheck, Heart, Truck, CheckCircle2 } from 'lucide-react';


export const Footer: React.FC = () => {
  const { settings, setCurrentView } = useStore();

  const navigateTo = (view: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#152419] text-[#EDE7DD] border-t border-[#233829]">
      {/* Upper Footer: Value propositions */}
      <div className="border-b border-[#233829]/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#1E3324] text-[#E7D6C0] rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#F7F3EB] mb-1">
                Livraison Internationale
              </h4>
              <p className="text-xs text-[#9BB09E] leading-relaxed">
                Expéditions rapides à Abidjan, dans toutes les villes de Côte d'Ivoire, dans la sous-région et partout dans le monde.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#1E3324] text-[#E7D6C0] rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#F7F3EB] mb-1">
                Paiement Flexible & Vérifié
              </h4>
              <p className="text-xs text-[#9BB09E] leading-relaxed">
                Réglez en toute confiance par Wave Mobile Money ou payez en espèces directement à la réception de votre colis.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#1E3324] text-[#E7D6C0] rounded-xl shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#F7F3EB] mb-1">
                100% Plantes & Tradition
              </h4>
              <p className="text-xs text-[#9BB09E] leading-relaxed">
                Formulations traditionnelles pures, sans produits chimiques, sans corticoïdes, respectueuses de votre organisme.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="logo" className="w-12 h-12 rounded-3xl object-contain" />
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-[#FBF9F5]">
                {settings.brandName}
              </span>
              <p className="text-xs text-[#9BB09E] italic">
                Tisane traditionnelle à base de plantes
              </p>
            </div>
          </div>

          <p className="font-serif text-base text-[#D8CFBF] italic max-w-md leading-snug">
            « {settings.tagline} »
          </p>

          <p className="text-xs text-[#9BB09E] leading-relaxed max-w-sm">
            {settings.description}
          </p>

      
        </div>

        {/* Quick Nav (3 cols) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E7D6C0]">
            Boutique & Navigation
          </h4>
          <ul className="space-y-2 text-xs text-[#B4C5B6]">
            <li>
              <button
                onClick={() => navigateTo('shop')}
                className="hover:text-white transition-colors"
              >
                Toutes nos tisanes
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('reviews')}
                className="hover:text-white transition-colors"
              >
                Avis clientes & témoignages
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('tracking')}
                className="hover:text-white transition-colors"
              >
                Suivre mon colis en ligne
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('account')}
                className="hover:text-white transition-colors"
              >
                Espace client
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('admin')}
                className="hover:text-white transition-colors"
              >
                Espace administration
              </button>
            </li>
          </ul>
        </div>

        {/* Contact details (4 cols) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E7D6C0]">
            Nous Contacter
          </h4>
          <p className="text-xs text-[#9BB09E]">
            Pour toute question sur nos produits ou votre commande :
          </p>
          <div className="space-y-2 text-xs text-[#B4C5B6]">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#8CA08E] shrink-0" />
              <div className="flex flex-col">
                <a href={`tel:${settings.phone1.replace(/\s+/g, '')}`} className="hover:text-white font-medium">
                  {settings.phone1}
                </a>
                <a href={`tel:${settings.phone2.replace(/\s+/g, '')}`} className="hover:text-white font-medium">
                  {settings.phone2}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#8CA08E] shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#8CA08E] shrink-0 mt-0.5" />
              <span>{settings.addressAbidjan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment icons */}
      <div className="border-t border-[#233829] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#829685]">
          <p>
            © {new Date().getFullYear()} {settings.brandName}. Tous droits réservés. Boutique officielle en ligne.
          </p>

          
        </div>
      </div>
    </footer>
  );
};
