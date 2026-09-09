import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Flame, Heart, Award, Users, CheckCircle2, Sparkles, UtensilsCrossed } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActiveView, restaurantSettings } = useRestaurant();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. Header Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          Our Culinary Journey
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Good Food. Great Moments.
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
          Savanna Bites was founded with a single, heartfelt mission: to elevate traditional Nigerian gastronomy and continental cuisine into unforgettable culinary memories.
        </p>
      </div>

      {/* 2. Story Section with Imagery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-zinc-300 leading-relaxed text-sm sm:text-base">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Rooted in Authentic Nigerian Heritage, Crafted with Passion in Ilorin
          </h2>
          <p>
            At Savanna Bites, situated at Asa Dam, Ilorin, Kwara State, food is more than sustenance—it is our communal language of joy, celebration, and kinship. We honor the time-tested methods of cooking: slow-smoking party jollof with aromatic wood, pounding yam to silky perfection, and grilling suya skewers over live charcoal coals.
          </p>
          <p>
            Every spice blend is hand-ground by our master chefs, every soup stock is slow-simmered for hours, and every plate served reflects our unwavering commitment to hygiene, authentic flavor, and warm Nigerian hospitality.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="font-display text-2xl font-bold text-amber-400 block">100%</span>
              <span className="text-xs text-zinc-400">Authentic recipes preserved</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="font-display text-2xl font-bold text-amber-400 block">Daily Fresh</span>
              <span className="text-xs text-zinc-400">Market-sourced produce</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
              alt="Savanna Bites Interior Dining"
              className="w-full aspect-4/3 object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-zinc-900 border border-amber-500/40 p-4 rounded-2xl shadow-xl max-w-xs hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Ilorin Landmark</h4>
                <p className="text-[11px] text-zinc-400">{restaurantSettings.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Four Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            What Drives Our Kitchen
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            The four commitments that guide every meal we prepare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Passion for Good Food</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We never cut corners. From frying our pepper bases until the oil floats to roasting our suya peppers, passion infuses every stage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Fresh Ingredients</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We partner directly with reputable poultry, catfish, and vegetable farmers to guarantee maximum crispness, flavor, and nutrition.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Friendly Service</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our hosts and delivery concierges treat every customer like an honored guest in our home. Your delight is our highest measure of success.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Unrivaled Experience</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Whether dining in our atmospheric restaurant or opening a delivery package at home, you experience pure restaurant-quality excellence.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Ambiance Photo Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80"
            alt="Warm Dining Room"
            className="w-full aspect-4/3 object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="p-4">
            <h4 className="font-bold text-sm text-white">Warm & Intimate Dining</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Atmospheric lighting and soothing Afro-jazz playlists.</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=80"
            alt="Master Chef in Kitchen"
            className="w-full aspect-4/3 object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="p-4">
            <h4 className="font-bold text-sm text-white">Culinary Artistry</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Master chefs dedicated to perfection on every dish.</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
          <img
            src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=700&q=80"
            alt="Cocktail Bar"
            className="w-full aspect-4/3 object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="p-4">
            <h4 className="font-bold text-sm text-white">Signature Drink Bar</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Freshly mixed Chapmans, Zobo blends, and cold beverages.</p>
          </div>
        </div>
      </div>

      {/* 5. Call to Action */}
      <div className="rounded-3xl bg-zinc-900 border border-amber-500/20 p-8 sm:p-12 text-center space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Ready to Experience Savanna Bites?
        </h2>
        <p className="text-sm text-zinc-300 max-w-lg mx-auto">
          Browse our menu to order right to your doorstep or book a private table for your next occasion.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('menu')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition shadow-md"
          >
            Order Food Online
          </button>
          <button
            onClick={() => setActiveView('reservations')}
            className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm border border-zinc-700 transition"
          >
            Book Table Reservation
          </button>
        </div>
      </div>
    </div>
  );
};
