import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartOpen,
    settings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const navigateTo = (view: any) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-[#FBF9F5] border-b border-[#E8E2D7]">
      {/* 1. Top Announcement Bar (like in the reference photo) */}
      {settings.showAnnouncement && !announcementDismissed && (
        <div className="bg-[#2D402F] text-[#F4EFE6] px-3 sm:px-4 py-2 text-[11px] sm:text-xs tracking-wider flex items-center justify-between font-medium">
          <div className="mx-auto text-center truncate pr-2 flex items-center justify-center gap-1.5">
            <span>Livraison offerte dès 45 000 FCFA d'achat · Expéditions dans le monde entier</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            aria-label="Fermer le bandeau"
            className="text-[#9DB39F] hover:text-white transition-colors p-1 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Editorial Header Bar (Left Nav · Center Wordmark · Right Icons like the photo) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Desktop Nav Links */}
        <nav className="hidden">
          <button
            onClick={() => navigateTo('home')}
            className={`transition-colors py-1 ${
              currentView === 'home' ? 'text-[#1E3324] font-bold border-b-2 border-[#1E3324]' : 'hover:text-[#1E3324]'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className={`transition-colors py-1 ${
              currentView === 'shop' ? 'text-[#1E3324] font-bold border-b-2 border-[#1E3324]' : 'hover:text-[#1E3324]'
            }`}
          >
            Nos Tisanes
          </button>
          
          <button
            onClick={() => navigateTo('tracking')}
            className={`transition-colors py-1 ${
              currentView === 'tracking' ? 'text-[#1E3324] font-bold border-b-2 border-[#1E3324]' : 'hover:text-[#1E3324]'
            }`}
          >
            Suivi Colis
          </button>
          <button
            onClick={() => navigateTo('account')}
            className={`transition-colors py-1 ${
              currentView === 'account' ? 'text-[#1E3324] font-bold border-b-2 border-[#1E3324]' : 'hover:text-[#1E3324]'
            }`}
          >
            Mon Compte
          </button>
        </nav>


        {/* Center: Brand Wordmark (matching "Verdure Botanicals" in reference photo) */}
        <button
          onClick={() => navigateTo('home')}
          className="flex flex-col items-center text-center group focus:outline-none"
        >
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A261D] group-hover:text-[#2D402F] transition-colors leading-none">
            {settings.brandName}
          </span>
         
        </button>

        {/* Right Side: Search, Admin, Cart Bag */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">
            <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Ouvrir le panier"
            className="relative p-2 text-[#1A261D] hover:text-[#2D402F] transition-colors flex items-center"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute top-1 right-0.5 bg-[#2D402F] text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          </button>
       
       

        {/* Mobile Hamburger (left on small screens) */}
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#3C4E3D] hover:text-[#1E3324] rounded-lg transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E8E2D7] bg-[#FBF9F5] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => navigateTo('home')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentView === 'home' ? 'bg-[#2D402F] text-white' : 'text-[#3C4E3D] hover:bg-[#F2ECE1]'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentView === 'shop' ? 'bg-[#2D402F] text-white' : 'text-[#3C4E3D] hover:bg-[#F2ECE1]'
            }`}
          >
            Nos Tisanes
          </button>
         
          <button
            onClick={() => navigateTo('tracking')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentView === 'tracking' ? 'bg-[#2D402F] text-white' : 'text-[#3C4E3D] hover:bg-[#F2ECE1]'
            }`}
          >
            Suivi de Commande 
          </button>
          <button
            onClick={() => navigateTo('account')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentView === 'account' ? 'bg-[#2D402F] text-white' : 'text-[#3C4E3D] hover:bg-[#F2ECE1]'
            }`}
          >
            Mon Espace Client
          </button>
          
        </div>
      )}
    </header>
  );
};
