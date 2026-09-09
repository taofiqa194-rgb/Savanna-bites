import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodCard } from '../components/FoodCard';
import { ReservationSection } from '../components/ReservationSection';
import {
  ArrowRight,
  Flame,
  Star,
  Clock,
  Award,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { menuItems, reviews, setActiveView, restaurantSettings, setIsCartOpen } =
    useRestaurant();

  const popularItems = menuItems.filter((m) => m.isPopular).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Subtle decorative radial lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/10 via-orange-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold tracking-wide">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Premium Nigerian & Continental Dining in Ilorin</span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Savanna Bites
                </h1>
                <p className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
                  {restaurantSettings.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {restaurantSettings.heroDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-order-now-btn"
                  onClick={() => setActiveView('menu')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/15 transition transform active:scale-98 cursor-pointer"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span>Order Now</span>
                </button>

                <button
                  id="hero-view-menu-btn"
                  onClick={() => setActiveView('menu')}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-stone-200 hover:text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>View Full Menu</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold font-mono text-lg">
                    <span>4.9</span>
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="text-[11px] text-zinc-400 block">500+ Lagos Diners</span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-white font-bold font-mono text-lg">
                    <span>25-35</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-[11px] text-zinc-400 block">Mins Island Delivery</span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-white font-bold font-mono text-lg">
                    <span>100%</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-zinc-400 block">Fresh Ingredients</span>
                </div>
              </div>
            </div>

            {/* Right Food Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Image container with organic border */}
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-amber-500/10 bg-zinc-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1000&q=85"
                    alt="Savanna Bites Signature Smoky Jollof Platter"
                    className="w-full aspect-4/3 sm:aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-xs inline-block mb-1.5 shadow-md">
                      Chef's Signature
                    </span>
                    <h3 className="text-white font-display text-xl font-bold">
                      Smoky Party Jollof & Peppered Assorted
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1">
                      Cooked with firewood embers, bell peppers, and natural bay leaves.
                    </p>
                  </div>
                </div>

                {/* Floating Badge Top Right */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-zinc-900/90 border border-amber-500/40 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold">
                    <Award className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                      Voted #1
                    </span>
                    <span className="text-xs font-bold text-white">Lekki Best Jollof</span>
                  </div>
                </div>

                {/* Floating Badge Bottom Left */}
                <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-zinc-900/90 border border-zinc-700 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Always Fresh</span>
                    <span className="text-[11px] text-zinc-400 block">Cooked to order</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DISHES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Customer Favorites
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Most Loved Delicacies
            </h2>
          </div>

          <button
            onClick={() => setActiveView('menu')}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition"
          >
            <span>Explore All 24+ Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE SAVANNA BITES */}
      <section className="bg-zinc-900/40 border-y border-zinc-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              The Savanna Difference
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mt-1.5">
              Why Diners Trust Savanna Bites
            </h2>
            <p className="text-sm text-zinc-400 mt-2.5">
              Every pot is seasoned with heritage techniques, uncompromising hygiene, and rich Nigerian warmth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Firewood Smoke & Flavor</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Authentic firewood jollof and charcoal-grilled suya that captures the true essence of Lagos street & party cuisine.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Farm-Fresh Ingredients</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hand-selected fresh catfish, goat meat, and authentic spices sourced daily from local farmers and spice masters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Fast Insulated Delivery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Temperature-locked packaging guarantees your swallow stays soft, soups stay piping hot, and drinks stay frosty.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/30 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Seamless WhatsApp Orders</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Direct WhatsApp integration for customized orders, swift delivery updates, and personal dietary requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TABLE RESERVATION HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReservationSection compact={true} />
      </section>

      {/* 5. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            Guest Testimonials
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Words From Our Diners
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            Read authentic reviews from guests who enjoy Savanna Bites daily in Ilorin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed mb-4">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">{rev.customerName}</span>
                  {rev.dishMentioned && (
                    <span className="text-[11px] text-amber-400/90 font-mono">
                      Dish: {rev.dishMentioned}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 p-8 sm:p-12 text-black shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              Hungry for Real Nigerian Flavor?
            </h2>
            <p className="text-sm font-medium text-black/80 max-w-lg">
              Order your favorite Party Jollof, Egusi, Croaker Fish, or Suya Platter right now on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveView('menu')}
              className="px-6 py-3.5 rounded-xl bg-black text-white font-extrabold text-sm hover:bg-zinc-900 transition shadow-lg"
            >
              Order Online Now
            </button>
            <button
              onClick={() => setActiveView('reservations')}
              className="px-6 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-black font-bold text-sm transition"
            >
              Reserve a Table
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
