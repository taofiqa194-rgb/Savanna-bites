import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  ShoppingBag,
  User,
  Search,
  Menu as MenuIcon,
  X,
  Phone,
  Clock,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import { AppView } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    setIsCartOpen,
    setIsAccountModalOpen,
    searchQuery,
    setSearchQuery,
    user,
    isAdmin,
    restaurantSettings,
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navLinks: { label: string; view: AppView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Menu', view: 'menu' },
    { label: 'About', view: 'about' },
    { label: 'Reservations', view: 'reservations' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121212]/95 backdrop-blur-md border-b border-zinc-800/80">
      {/* 1. Top Announcement / Info Bar */}
      <div className="hidden md:block bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/50 text-xs text-zinc-400 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              {restaurantSettings.announcement}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 hover:text-stone-200 transition">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {restaurantSettings.openingHours}
            </span>
            <a
              href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              <Phone className="w-3.5 h-3.5" />
              {restaurantSettings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group transition cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center p-0.5 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  Savanna Bites
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-medium tracking-wider uppercase text-amber-400/90 font-mono">
                {restaurantSettings.tagline}
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-zinc-800">
            {navLinks.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  id={`nav-link-${link.view}`}
                  onClick={() => handleNavClick(link.view)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-sm font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input on Desktop */}
            <div className="relative hidden md:block">
              {showSearchInput ? (
                <div className="flex items-center bg-zinc-900 border border-amber-500/50 rounded-full px-3 py-1.5 transition-all w-52 lg:w-64">
                  <Search className="w-4 h-4 text-amber-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Search jollof, soup, suya..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeView !== 'menu') setActiveView('menu');
                    }}
                    autoFocus
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-hidden"
                  />
                  <button
                    onClick={() => setShowSearchInput(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="search-toggle-btn"
                  onClick={() => {
                    setShowSearchInput(true);
                    if (activeView !== 'menu') setActiveView('menu');
                  }}
                  className="p-2.5 rounded-full text-zinc-300 hover:text-amber-400 hover:bg-zinc-800 transition cursor-pointer"
                  title="Search menu"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton variant="navbar" />

            {/* Account Button */}
            <button
              id="account-btn"
              onClick={() => setIsAccountModalOpen(true)}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full text-sm font-medium text-stone-200 hover:text-white hover:bg-zinc-800 transition border border-transparent hover:border-zinc-700 cursor-pointer"
              title={user ? `Signed in as ${user.displayName}` : 'Customer Sign In'}
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                {user ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <span className="hidden xl:inline text-xs font-semibold">
                {user ? user.displayName.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Admin Dashboard shortcut */}
            <button
              id="admin-nav-btn"
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-zinc-700'
              }`}
              title="Restaurant Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
              {isAdmin && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-nav-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-md hover:from-amber-400 hover:to-amber-500 transition-all transform active:scale-95 cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-amber-400 text-xs font-extrabold shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {/* Mobile Search Bar */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search jollof, swallow, grills, drinks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'menu') setActiveView('menu');
              }}
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-hidden"
            />
          </div>

          {/* Mobile Nav Links */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold text-left transition ${
                  activeView === link.view
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('admin')}
              className={`py-3 px-4 rounded-xl text-sm font-semibold text-left transition flex items-center justify-between ${
                activeView === 'admin'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-zinc-900 text-amber-400 hover:bg-zinc-800'
              }`}
            >
              <span>Admin Portal</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Quick contact and PWA install in mobile sheet */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Call: {restaurantSettings.phone}</span>
            <PWAInstallButton variant="navbar" />
          </div>
        </div>
      )}
    </header>
  );
};
