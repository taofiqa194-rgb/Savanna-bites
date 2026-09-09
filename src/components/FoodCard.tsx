import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { formatNaira } from '../config/restaurantConfig';
import { Plus, Minus, Flame, Clock, Check, Sparkles } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { cart, addToCart, updateCartQuantity } = useRestaurant();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cartEntry = cart.find((c) => c.menuItem.id === item.id);
  const inCartQuantity = cartEntry ? cartEntry.quantity : 0;

  // Fallback high-quality food image
  const displayImage = imgError
    ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    : item.image;

  return (
    <div
      id={`food-card-${item.id}`}
      className={`group relative flex flex-col justify-between rounded-2xl bg-zinc-900/90 border transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 ${
        !item.isAvailable
          ? 'border-zinc-800 opacity-75'
          : inCartQuantity > 0
          ? 'border-amber-500/50 bg-zinc-900'
          : 'border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      <div>
        {/* Food Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-950">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-zinc-800 flex items-center justify-center">
              <span className="text-xs text-zinc-600">Loading delicacy...</span>
            </div>
          )}
          <img
            src={displayImage}
            alt={item.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            } ${!item.isAvailable ? 'grayscale' : ''}`}
          />

          {/* Gradient overlay on bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/20" />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            {item.isPopular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-extrabold text-black shadow-xs">
                <Sparkles className="w-3 h-3" />
                Popular
              </span>
            )}
            {item.spicyLevel && item.spicyLevel > 0 ? (
              <span
                className="inline-flex items-center gap-0.5 rounded-full bg-red-950/80 border border-red-800/80 backdrop-blur-xs px-2 py-1 text-[11px] font-bold text-red-300 shadow-xs"
                title={`Spiciness Level: ${item.spicyLevel} / 3`}
              >
                <Flame className="w-3 h-3 text-red-400" />
                {item.spicyLevel === 1 ? 'Mild' : item.spicyLevel === 2 ? 'Medium' : 'Hot 🔥'}
              </span>
            ) : null}
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3">
            <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-amber-300 border border-white/10">
              {item.category}
            </span>
          </div>

          {/* Prep time badge */}
          {item.preparationTime && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/70 backdrop-blur-md px-2 py-1 text-[11px] text-zinc-300 border border-white/10">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>{item.preparationTime}</span>
            </div>
          )}

          {/* Sold Out Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="px-4 py-1.5 rounded-full bg-red-600/90 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Food Details */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
              {item.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Action */}
      <div className="p-4 sm:p-5 pt-0 mt-auto flex items-center justify-between gap-3 border-t border-zinc-800/60 pt-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono block">
            Price
          </span>
          <span className="font-display text-lg sm:text-xl font-bold text-amber-400">
            {formatNaira(item.price)}
          </span>
        </div>

        {/* Add to Cart or Quantity Adjuster */}
        {item.isAvailable ? (
          inCartQuantity > 0 ? (
            <div className="flex items-center gap-1.5 bg-zinc-800 border border-amber-500/50 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => updateCartQuantity(item.id, inCartQuantity - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition"
                aria-label={`Decrease ${item.name} quantity`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-amber-400">
                {inCartQuantity}
              </span>
              <button
                onClick={() => updateCartQuantity(item.id, inCartQuantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition"
                aria-label={`Increase ${item.name} quantity`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`add-to-cart-${item.id}`}
              onClick={() => addToCart(item, 1)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )
        ) : (
          <button
            disabled
            className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-semibold cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
};
