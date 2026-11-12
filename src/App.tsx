/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { NotificationToast } from './components/NotificationToast';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { AccountView } from './views/AccountView';
import { AdminView } from './views/AdminView';
import { ReviewsView } from './views/ReviewsView';

const MainContent: React.FC = () => {
  const { currentView } = useStore();

  return (
    <main className="flex-1 w-full max-w-full overflow-x-hidden min-h-[calc(100vh-80px)]">
      {currentView === 'home' && <HomeView />}
      {currentView === 'shop' && <ShopView />}
      {currentView === 'product-detail' && <ProductDetailModal />}
      {currentView === 'checkout' && <CheckoutView />}
      {currentView === 'order-confirmation' && <OrderConfirmationView />}
      {currentView === 'tracking' && <OrderTrackingView />}
      {currentView === 'account' && <AccountView />}
      {currentView === 'admin' && <AdminView />}
      {currentView === 'reviews' && <ReviewsView />}
    </main>
  );
};

const AppLayout: React.FC = () => {
  const { currentView, isAdminAuthenticated } = useStore();
  const isAdminViewActive = currentView === 'admin' && isAdminAuthenticated;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#FBF9F5] text-[#1A261D] antialiased">
      {/* Show public header unless in dedicated admin session */}
      {!isAdminViewActive && <Header />}
      
      <MainContent />

      {/* Show public footer only on customer-facing pages */}
      {!isAdminViewActive && <Footer />}

      <CartDrawer />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppLayout />
    </StoreProvider>
  );
}
