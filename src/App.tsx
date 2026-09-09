import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { MenuView } from './views/MenuView';
import { AboutView } from './views/AboutView';
import { ReservationsView } from './views/ReservationsView';
import { ContactView } from './views/ContactView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/ToastContainer';
import { OfflineIndicator, PWAInstallPopup } from './components/PWAInstallButton';

const MainAppContent: React.FC = () => {
  const { activeView } = useRestaurant();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'menu':
        return <MenuView />;
      case 'about':
        return <AboutView />;
      case 'reservations':
        return <ReservationsView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Navigation */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <CustomerAccountModal />
      <FloatingWhatsApp />
      <ToastContainer />
      <OfflineIndicator />
      <PWAInstallPopup />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainAppContent />
    </RestaurantProvider>
  );
}
