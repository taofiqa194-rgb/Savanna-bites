import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  MenuItem,
  MenuCategory,
  OrderStatus,
  PaymentStatus,
  ReservationStatus,
} from '../types';
import { formatNaira, ADMIN_CONFIG, BANK_PAYMENT_DETAILS } from '../config/restaurantConfig';
import { testFirestoreConnection, isFirebaseConfigured, FIREBASE_PROJECT_ID } from '../services/firebase';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Calendar,
  Settings,
  Database,
  Search,
  Lock,
  LogOut,
  Phone,
  Clock,
  ExternalLink,
  MessageSquare,
  CreditCard,
  Building2,
  Eye,
  KeyRound,
  X,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

const CATEGORIES: MenuCategory[] = [
  'Nigerian Dishes',
  'Rice & Pasta',
  'Swallow & Soups',
  'Grills',
  'Fast Food',
  'Snacks',
  'Drinks',
  'Desserts',
];

export const AdminDashboardView: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    resetAdminPassword,
    logout,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    reservations,
    updateReservationStatus,
    contactMessages,
    restaurantSettings,
    updateRestaurantSettings,
    addToast,
  } = useRestaurant();

  // Admin login states (Strictly secure: NO demo passwords, no hardcoding)
  const [adminEmail, setAdminEmail] = useState(ADMIN_CONFIG.email);
  const [adminPass, setAdminPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Forgot Password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(ADMIN_CONFIG.email);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<{ success: boolean; message: string } | null>(
    null
  );

  // Active admin tab
  const [adminTab, setAdminTab] = useState<
    'menu' | 'orders' | 'reservations' | 'messages' | 'settings' | 'firebase'
  >('orders');

  // Menu item modal (Add / Edit)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states for menu item
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<Exclude<MenuCategory, 'All'>>('Nigerian Dishes');
  const [itemPrice, setItemPrice] = useState(4500);
  const [itemDesc, setItemDesc] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemAvailable, setItemAvailable] = useState(true);
  const [itemPopular, setItemPopular] = useState(false);
  const [itemSpicy, setItemSpicy] = useState<0 | 1 | 2 | 3>(0);
  const [itemPrepTime, setItemPrepTime] = useState('15-20 mins');

  // Menu table search
  const [menuSearch, setMenuSearch] = useState('');

  // Proof screenshot lightbox
  const [viewingProof, setViewingProof] = useState<string | null>(null);

  // Settings form states
  const [settingsForm, setSettingsForm] = useState(restaurantSettings);

  // Firebase test state
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingFb, setIsTestingFb] = useState(false);

  // Handle admin login
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!adminPass) {
      setLoginError('Please enter your administrator password');
      addToast('Please enter your administrator password', 'error');
      return;
    }
    setLoginLoading(true);
    const success = await loginAdmin(adminEmail, adminPass);
    if (!success) {
      setLoginError('Authentication failed. Please check credentials or reset password.');
    }
    setLoginLoading(false);
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      addToast('Please enter administrator email address', 'error');
      return;
    }
    setForgotLoading(true);
    const result = await resetAdminPassword(forgotEmail);
    setForgotStatus(result);
    setForgotLoading(false);
    if (result.success) {
      addToast('Password reset link dispatched via email', 'success');
    }
  };

  const openAddItemModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemCategory('Nigerian Dishes');
    setItemPrice(4500);
    setItemDesc('');
    setItemImage(
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    );
    setItemAvailable(true);
    setItemPopular(false);
    setItemSpicy(0);
    setItemPrepTime('15-20 mins');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.category as Exclude<MenuCategory, 'All'>);
    setItemPrice(item.price);
    setItemDesc(item.description);
    setItemImage(item.image);
    setItemAvailable(item.isAvailable);
    setItemPopular(item.isPopular || false);
    setItemSpicy(item.spicyLevel || 0);
    setItemPrepTime(item.preparationTime || '15-20 mins');
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: itemName.trim(),
        category: itemCategory,
        price: Number(itemPrice),
        description: itemDesc.trim(),
        image: itemImage.trim(),
        isAvailable: itemAvailable,
        isPopular: itemPopular,
        spicyLevel: itemSpicy,
        preparationTime: itemPrepTime,
      });
    } else {
      addMenuItem({
        name: itemName.trim(),
        category: itemCategory,
        price: Number(itemPrice),
        description: itemDesc.trim(),
        image: itemImage.trim(),
        isAvailable: itemAvailable,
        isPopular: itemPopular,
        spicyLevel: itemSpicy,
        preparationTime: itemPrepTime,
      });
    }

    setIsItemModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantSettings(settingsForm);
  };

  const handleRunFbTest = async () => {
    setIsTestingFb(true);
    const res = await testFirestoreConnection();
    setTestResult(res);
    setIsTestingFb(false);
  };

  // If not logged in as Admin, show the protected login screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Savanna Admin Portal</h1>
            <p className="text-xs text-zinc-400">
              Secure restaurant control panel for orders, verification, and menu management.
            </p>
            <div className="pt-1 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Firebase Project: <strong className="text-amber-400 font-mono">{FIREBASE_PROJECT_ID}</strong></span>
              </span>
            </div>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-200 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Authentication Notice</span>
              </div>
              <p className="leading-relaxed text-[11px]">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Administrator Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setForgotStatus(null);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 transition underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required
                placeholder="Enter Firebase admin password"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[11px] text-zinc-500">
              Protected by Firebase Authentication & Firestore Security Rules.
            </p>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Reset Administrator Password</span>
                </div>
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Enter your registered administrator email address to receive a secure Firebase
                password reset link.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                {forgotStatus && (
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      forgotStatus.success
                        ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                        : 'bg-red-950/40 border-red-700 text-red-300'
                    }`}
                  >
                    {forgotStatus.message}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Filtered menu for admin table
  const adminFilteredMenu = menuItems.filter(
    (m) =>
      m.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Admin Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-white">
                Savanna Bites Control Panel
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase font-mono">
                Admin: {ADMIN_CONFIG.email}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Asa Dam, Ilorin, Kwara State • Phone: {restaurantSettings.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-stone-200 text-xs font-semibold transition cursor-pointer border border-zinc-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 text-xs">
        <button
          onClick={() => setAdminTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'orders'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & Payments ({orders.length})</span>
          {orders.filter((o) => o.paymentStatus === 'payment_submitted').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono font-black">
              {orders.filter((o) => o.paymentStatus === 'payment_submitted').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('menu')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'menu'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          <span>Menu Catalog ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('reservations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'reservations'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Reservations ({reservations.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('messages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'messages'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages ({contactMessages.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'settings'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Restaurant Settings</span>
        </button>

        <button
          onClick={() => setAdminTab('firebase')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'firebase'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Firebase Sync</span>
        </button>
      </div>

      {/* ================= TAB 1: ORDERS & PAYMENTS ================= */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Customer Orders & Payment Verification</h2>
              <p className="text-xs text-zinc-400">
                Review bank transfers to Moniepoint ({BANK_PAYMENT_DETAILS.accountNumber}) and update kitchen dispatch status.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                Total Orders: <strong className="text-white">{orders.length}</strong>
              </span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
              No orders placed yet. When customers check out via Bank Transfer or WhatsApp, orders will appear here immediately.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isBank = order.paymentMethod === 'bank_transfer';
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-md"
                  >
                    {/* Top Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-sm">{order.id}</span>
                          <span className="text-xs text-white font-bold">{order.customerName}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                              isBank
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {isBank ? 'Moniepoint Transfer' : 'WhatsApp'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-1">
                          <a
                            href={`tel:${order.phone}`}
                            className="text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {order.phone}
                          </a>
                          <span>•</span>
                          <span>{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Controls: Payment Status & Order Status */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Payment Status */}
                        <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                          <span className="text-[11px] text-zinc-400 font-semibold">Payment:</span>
                          <select
                            value={order.paymentStatus || 'pending'}
                            onChange={(e) =>
                              updateOrderPaymentStatus(order.id, e.target.value as PaymentStatus)
                            }
                            className={`bg-transparent text-xs font-bold focus:outline-hidden cursor-pointer ${
                              order.paymentStatus === 'verified'
                                ? 'text-emerald-400'
                                : order.paymentStatus === 'payment_submitted'
                                ? 'text-amber-400'
                                : order.paymentStatus === 'rejected'
                                ? 'text-red-400'
                                : 'text-zinc-300'
                            }`}
                          >
                            <option value="pending" className="bg-zinc-900 text-zinc-300">
                              Pending
                            </option>
                            <option value="payment_submitted" className="bg-zinc-900 text-amber-400">
                              Payment Submitted (Review)
                            </option>
                            <option value="verified" className="bg-zinc-900 text-emerald-400">
                              Verified ✓
                            </option>
                            <option value="rejected" className="bg-zinc-900 text-red-400">
                              Rejected ✕
                            </option>
                          </select>
                        </div>

                        {/* Order Fulfillment Status */}
                        <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                          <span className="text-[11px] text-zinc-400 font-semibold">Kitchen:</span>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className="bg-transparent text-xs text-white font-bold focus:outline-hidden cursor-pointer"
                          >
                            <option value="new" className="bg-zinc-900 text-white">
                              New
                            </option>
                            <option value="pending" className="bg-zinc-900 text-white">
                              Pending
                            </option>
                            <option value="confirmed" className="bg-zinc-900 text-white">
                              Confirmed
                            </option>
                            <option value="preparing" className="bg-zinc-900 text-white">
                              Preparing (Kitchen)
                            </option>
                            <option value="out_for_delivery" className="bg-zinc-900 text-white">
                              Out for Delivery
                            </option>
                            <option value="delivered" className="bg-zinc-900 text-white">
                              Delivered
                            </option>
                            <option value="cancelled" className="bg-zinc-900 text-white">
                              Cancelled
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Middle Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Items */}
                      <div>
                        <span className="text-zinc-500 font-bold block mb-1 uppercase font-mono text-[10px]">
                          Items Ordered:
                        </span>
                        <ul className="space-y-1 text-zinc-300">
                          {order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>
                                {it.name} × {it.quantity}
                              </span>
                              <span className="font-mono text-amber-400">
                                {formatNaira(it.price * it.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Delivery */}
                      <div className="space-y-1">
                        <span className="text-zinc-500 font-bold block uppercase font-mono text-[10px]">
                          Delivery Destination:
                        </span>
                        <p className="text-zinc-300">{order.deliveryAddress}</p>
                        {order.orderNote && (
                          <p className="text-amber-300/90 text-[11px] pt-1">
                            <strong>Note:</strong> {order.orderNote}
                          </p>
                        )}
                        <div className="pt-2 border-t border-zinc-800/80 flex justify-between font-bold text-sm text-white">
                          <span>Total:</span>
                          <span className="font-mono text-amber-400">
                            {formatNaira(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Bank Payment Verification Info */}
                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <span className="text-zinc-500 font-bold block uppercase font-mono text-[10px]">
                          Payment Verification
                        </span>

                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Method:</span>
                            <span className="text-stone-200 font-semibold">
                              {order.paymentMethod === 'bank_transfer'
                                ? 'Moniepoint Transfer'
                                : 'WhatsApp Direct'}
                            </span>
                          </div>

                          {order.paymentReference && (
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Ref/Sender:</span>
                              <span className="text-amber-300 font-mono font-semibold">
                                {order.paymentReference}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span className="text-zinc-400">Amount Due:</span>
                            <span className="text-white font-mono font-bold">
                              {formatNaira(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Screenshot proof if present */}
                        {order.paymentProofUrl ? (
                          <button
                            type="button"
                            onClick={() => setViewingProof(order.paymentProofUrl || null)}
                            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[11px] font-bold transition border border-zinc-700 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Payment Proof Screenshot</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-500 italic block pt-1">
                            No screenshot attached
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: MENU CATALOG ================= */}
      {adminTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Menu Catalog ({menuItems.length})</h2>
              <p className="text-xs text-zinc-400">Add, edit pricing, or toggle sold out status</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter dishes..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <button
                onClick={openAddItemModal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Food Delicacy</span>
              </button>
            </div>
          </div>

          {/* Menu Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
            <table className="w-full text-left text-xs text-stone-200">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4">Dish</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {adminFilteredMenu.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-950 border border-zinc-800"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {item.name}
                            {item.isPopular && (
                              <span className="text-[10px] text-amber-400">★</span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300 font-mono">{item.category}</td>
                    <td className="p-4 font-mono font-bold text-amber-400">
                      {formatNaira(item.price)}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                          item.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {item.isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditItemModal(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${item.name} from menu?`)) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: RESERVATIONS ================= */}
      {adminTab === 'reservations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              Table Reservations ({reservations.length})
            </h2>
            <p className="text-xs text-zinc-400">Track and confirm incoming table bookings</p>
          </div>

          {reservations.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
              No table reservations booked yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-mono font-bold text-amber-400 text-xs">{res.id}</span>
                    <select
                      value={res.status}
                      onChange={(e) =>
                        updateReservationStatus(res.id, e.target.value as ReservationStatus)
                      }
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white font-semibold"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="seated">Seated</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <p className="text-sm font-bold text-white">{res.name}</p>
                    <p className="text-zinc-400">
                      Phone:{' '}
                      <a href={`tel:${res.phone}`} className="text-amber-400 hover:underline">
                        {res.phone}
                      </a>
                    </p>
                    <div className="flex gap-4 text-amber-300 font-mono pt-1">
                      <span>Date: {res.date}</span>
                      <span>Time: {res.time}</span>
                      <span>Guests: {res.guests}</span>
                    </div>
                    {res.specialRequest && (
                      <p className="text-zinc-400 text-[11px] pt-1">
                        <strong>Request:</strong> {res.specialRequest}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: MESSAGES ================= */}
      {adminTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              Customer Contact Inquiries ({contactMessages.length})
            </h2>
          </div>

          {contactMessages.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <div>
                      <span className="font-bold text-white text-sm">{msg.name}</span>
                      <span className="text-zinc-400 ml-2">({msg.email})</span>
                    </div>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-semibold text-amber-400">{msg.subject}</p>
                  <p className="text-zinc-300 leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: RESTAURANT SETTINGS ================= */}
      {adminTab === 'settings' && (
        <div className="max-w-3xl rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Restaurant Business Settings</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Location, contact lines, and delivery fee settings for Savanna Bites.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={settingsForm.restaurantName}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, restaurantName: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Physical Address</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Opening Hours</label>
              <input
                type="text"
                value={settingsForm.openingHours}
                onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition cursor-pointer shadow-md"
            >
              Save Restaurant Settings
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 6: FIREBASE SYNC ================= */}
      {adminTab === 'firebase' && (
        <div className="max-w-3xl rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <h2 className="font-display text-xl font-bold text-white">Firebase & Cloud Sync Status</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Verify database and authentication connectivity to Google Cloud Firestore.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-300">Firebase Configuration:</span>
              <span
                className={`px-2.5 py-1 rounded-full font-bold ${
                  isFirebaseConfigured
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isFirebaseConfigured ? 'Connected to Firebase' : 'Demo & Local Persistence Active'}
              </span>
            </div>

            <p className="text-zinc-400 leading-relaxed">
              {isFirebaseConfigured
                ? 'Your Firebase credentials are active. All customer sign-ups, orders, and reservations synchronize with Firestore!'
                : 'Savanna Bites is currently operating seamlessly in offline-capable demo mode with local storage persistence. All customer carting, WhatsApp dispatch, admin edits, and bookings are 100% operational.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleRunFbTest}
                disabled={isTestingFb}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition cursor-pointer border border-zinc-700 disabled:opacity-50"
              >
                {isTestingFb ? 'Testing Connection...' : 'Test Firestore Connection'}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-700 text-amber-300'
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT DISH ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-stone-200">
            <h3 className="font-display text-xl font-bold text-white">
              {editingItem ? 'Edit Food Delicacy' : 'Add New Food Delicacy'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fisherman Seafood Soup"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) =>
                      setItemCategory(e.target.value as Exclude<MenuCategory, 'All'>)
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Price in Naira (₦)</label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    required
                    min={100}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Appetizing description of ingredients, style and garnish..."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Spiciness Level</label>
                  <select
                    value={itemSpicy}
                    onChange={(e) => setItemSpicy(Number(e.target.value) as 0 | 1 | 2 | 3)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={0}>0 - Not Spicy</option>
                    <option value={1}>1 - Mild</option>
                    <option value={2}>2 - Medium</option>
                    <option value={3}>3 - Extra Hot 🔥</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Preparation Time</label>
                  <input
                    type="text"
                    placeholder="15-20 mins"
                    value={itemPrepTime}
                    onChange={(e) => setItemPrepTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemAvailable}
                    onChange={(e) => setItemAvailable(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>Available in Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemPopular}
                    onChange={(e) => setItemPopular(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>Feature as Popular ⭐</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-md cursor-pointer"
                >
                  {editingItem ? 'Update Dish' : 'Save New Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= LIGHTBOX: PAYMENT PROOF SCREENSHOT ================= */}
      {viewingProof && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Customer Bank Transfer Screenshot</span>
              </div>
              <button
                onClick={() => setViewingProof(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-800 max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={viewingProof}
                alt="Payment proof screenshot"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewingProof(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-stone-200 text-xs font-semibold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
