import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { buildWhatsAppUrl } from '../config/restaurantConfig';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { restaurantSettings } = useRestaurant();
  const [tooltipOpen, setTooltipOpen] = useState(true);

  const whatsappUrl = buildWhatsAppUrl(
    restaurantSettings.whatsappNumber,
    'Hello Savanna Bites! I would like to inquire about your menu and special dishes today.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Tooltip speech bubble */}
      {tooltipOpen && (
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-emerald-500/40 text-stone-100 text-xs px-3.5 py-2 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <span>Need help or want to order? Chat with us!</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTooltipOpen(false);
            }}
            className="text-zinc-400 hover:text-white p-0.5"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-950/50 hover:shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
        aria-label="Chat with Savanna Bites on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp Order</span>
      </a>
    </div>
  );
};
