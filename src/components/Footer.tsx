import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { AppView } from '../types';

export const Footer: React.FC = () => {
  const { setActiveView, restaurantSettings } = useRestaurant();

  const handleNav = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-850 text-zinc-400 text-sm">
      {/* Main Footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white">Savanna Bites</span>
                <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  {restaurantSettings.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Experience authentic Nigerian feasts and refined continental cuisines crafted with
              firewood smoke, homegrown spices, and warm Ilorin hospitality.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-4">
              Explore & Enjoy
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-amber-400 transition"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('menu')}
                  className="hover:text-amber-400 transition"
                >
                  Interactive Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reservations')}
                  className="hover:text-amber-400 transition"
                >
                  Book a Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-amber-400 transition"
                >
                  Our Culinary Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-amber-400 transition"
                >
                  Contact & Location
                </button>
              </li>
              <li>
                <PWAInstallButton variant="link" />
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Control Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Service */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Opening Hours
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-zinc-300">Monday – Thursday</p>
                <p className="text-zinc-500">9:00 AM – 10:30 PM</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-300">Friday – Sunday</p>
                <p className="text-zinc-500">9:00 AM – 11:30 PM (Midnight Vibes)</p>
              </div>
              <div className="pt-2 border-t border-zinc-900">
                <span className="text-[11px] text-amber-400 font-semibold block">
                  Delivery Across Lagos:
                </span>
                <span className="text-zinc-500 text-[11px]">
                  Lekki Phase 1, Victoria Island, Ikoyi, Oniru, Marina & Ikeja.
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Reach Us */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Location & Orders
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{restaurantSettings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition font-mono"
                >
                  {restaurantSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={`mailto:${restaurantSettings.email}`}
                  className="hover:text-white transition font-mono"
                >
                  {restaurantSettings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Savanna Bites Nigeria. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>for Nigerian Food Lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
