import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { formatNaira } from '../config/restaurantConfig';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    restaurantSettings,
  } = useRestaurant();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = restaurantSettings.freeDeliveryThreshold;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-white">Your Food Basket</h2>
                <p className="text-xs text-zinc-400">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              id="close-cart-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Close Shopping Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {cart.length > 0 && (
            <div className="px-5 py-3 bg-zinc-900/80 border-b border-zinc-800/60 text-xs">
              <div className="flex items-center justify-between mb-1.5 text-zinc-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  {amountNeededForFree > 0
                    ? `Add ${formatNaira(amountNeededForFree)} for FREE Delivery!`
                    : '🎉 You qualified for FREE Delivery!'}
                </span>
                <span className="text-amber-400 font-bold font-mono">{freeProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 rounded-full"
                  style={{ width: `${freeProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Your cart is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Explore our Nigerian and continental specialties and add your favorite dishes.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition"
                >
                  Browse Delicious Menu
                </button>
              </div>
            ) : (
              cart.map(({ menuItem, quantity }) => (
                <div
                  key={menuItem.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition"
                >
                  {/* Thumbnail */}
                  <img
                    src={menuItem.image}
                    alt={menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover bg-zinc-800 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{menuItem.name}</h4>
                    <p className="text-xs text-amber-400 font-bold font-mono">
                      {formatNaira(menuItem.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-zinc-700 bg-zinc-800/90 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(menuItem.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(menuItem.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs text-zinc-400 font-mono">
                        = {formatNaira(menuItem.price * quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(menuItem.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition rounded-lg hover:bg-zinc-800"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800/90 bg-zinc-900/60 space-y-3">
              {/* Cost breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-200 font-mono font-medium">
                    {formatNaira(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-stone-200 font-mono font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatNaira(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="text-amber-400 font-mono text-base">
                    {formatNaira(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="checkout-proceed-btn"
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/10 transition transform active:scale-98 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={clearCart}
                  className="text-xs text-zinc-500 hover:text-zinc-300 py-1 transition text-center"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
