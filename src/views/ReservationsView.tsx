import React from 'react';
import { ReservationSection } from '../components/ReservationSection';
import { Sparkles, GlassWater, Utensils, Music, ShieldCheck } from 'lucide-react';

export const ReservationsView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          VIP Dining & Events
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Reserve Your Table
        </h1>
        <p className="text-sm text-zinc-400">
          Book in advance for a guaranteed table, personalized table settings, and priority culinary service.
        </p>
      </div>

      {/* Reservation Form Component */}
      <ReservationSection compact={false} />

      {/* Experience Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <GlassWater className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white">Romantic & Intimate Dinners</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Candlelit tables with dedicated servers, complimentary welcome Chapman cocktails, and custom dessert sparklers upon request.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white">Family & Sunday Feasts</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Spacious banquet seating for up to 25 guests. Enjoy shareable platters of Egusi, Party Jollof, and whole grilled croaker fish.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white">Weekend Live Vibes</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Friday through Sunday evenings feature soulful acoustic Afro-jazz, live grills on the terrace, and artisan cocktail service.
          </p>
        </div>
      </div>
    </div>
  );
};
