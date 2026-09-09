import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  Reservation,
  ReservationStatus,
  Review,
  RestaurantSettings,
  UserProfile,
  ContactMessage,
  AppView,
} from '../types';
import { INITIAL_MENU_ITEMS } from '../data/menuData';
import { INITIAL_REVIEWS } from '../data/reviewsData';
import {
  DEFAULT_RESTAURANT_SETTINGS,
  BANK_PAYMENT_DETAILS,
  ADMIN_CONFIG,
  generateWhatsAppOrderMessage,
  generateWhatsAppReservationMessage,
  buildWhatsAppUrl,
} from '../config/restaurantConfig';
import {
  auth,
  db,
  isFirebaseConfigured,
  resetPassword,
  formatFirebaseAuthError,
  FIREBASE_PROJECT_ID,
  handleFirestoreError,
  OperationType,
} from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface RestaurantContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  cartCount: number;

  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    phone: string;
    deliveryAddress: string;
    orderNote?: string;
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    paymentReference?: string;
    paymentProofUrl?: string;
    amountPaid?: number;
  }) => Promise<{ order: Order; whatsappUrl: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus) => void;

  reservations: Reservation[];
  bookTable: (data: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
  }) => Promise<{ reservation: Reservation; whatsappUrl: string }>;
  updateReservationStatus: (reservationId: string, status: ReservationStatus) => void;

  reviews: Review[];
  addReview: (reviewData: {
    customerName: string;
    rating: number;
    review: string;
    dishMentioned?: string;
  }) => void;

  contactMessages: ContactMessage[];
  sendContactMessage: (msg: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => void;

  restaurantSettings: RestaurantSettings;
  updateRestaurantSettings: (newSettings: Partial<RestaurantSettings>) => void;

  user: UserProfile | null;
  isAdmin: boolean;
  loginCustomer: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  registerCustomer: (profile: {
    displayName: string;
    email: string;
    phone?: string;
    defaultAddress?: string;
    password?: string;
  }) => Promise<boolean>;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  resetAdminPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;

  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  activeView: AppView;
  setActiveView: (view: AppView) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;

  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Menu Items State (persisted in localStorage or Firestore)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('savanna_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('savanna_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  // 2. Cart State (persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('savanna_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savanna_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Restaurant Settings (persisted in localStorage)
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('savanna_settings');
    return saved ? { ...DEFAULT_RESTAURANT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_RESTAURANT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('savanna_settings', JSON.stringify(restaurantSettings));
  }, [restaurantSettings]);

  // 4. Orders History
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('savanna_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savanna_orders', JSON.stringify(orders));
  }, [orders]);

  // 5. Reservations History
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('savanna_reservations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savanna_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // 6. Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('savanna_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('savanna_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // 7. Contact Messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('savanna_messages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savanna_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  // 8. Auth State & User Profile
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('savanna_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('savanna_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('savanna_user_profile');
    }
  }, [user]);

  const isAdmin = user?.role === 'admin';

  // Listen to Firebase auth if configured
  useEffect(() => {
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          // Check if authorized admin email
          const isUserAdmin = fbUser.email?.toLowerCase() === ADMIN_CONFIG.email.toLowerCase();
          setUser((prev) => ({
            uid: fbUser.uid,
            displayName: fbUser.displayName || prev?.displayName || fbUser.email?.split('@')[0] || 'Diner',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || prev?.phone,
            defaultAddress: prev?.defaultAddress,
            role: isUserAdmin ? 'admin' : (prev?.role || 'customer'),
            createdAt: prev?.createdAt || new Date().toISOString(),
          }));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // 9. Navigation & UI modals
  const [activeView, setActiveView] = useState<AppView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // 10. Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const deliveryFee =
    cartSubtotal === 0 || cartSubtotal >= restaurantSettings.freeDeliveryThreshold
      ? 0
      : restaurantSettings.deliveryFee;
  const cartTotal = cartSubtotal + deliveryFee;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cart Handlers
  const addToCart = (item: MenuItem, quantity: number = 1) => {
    if (!item.isAvailable) {
      addToast(`${item.name} is currently sold out.`, 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { menuItem: item, quantity }];
    });
    addToast(`Added ${item.name} to your cart`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((c) => c.menuItem.id === itemId);
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
    if (item) {
      addToast(`Removed ${item.menuItem.name} from cart`, 'info');
    }
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === itemId ? { ...c, quantity } : c))
    );
  };

  const clearCart = () => {
    setCart([]);
    addToast('Shopping cart cleared', 'info');
  };

  // Order Placement
  const placeOrder = async (orderData: {
    customerName: string;
    phone: string;
    deliveryAddress: string;
    orderNote?: string;
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    paymentReference?: string;
    paymentProofUrl?: string;
    amountPaid?: number;
  }) => {
    const orderId = 'SB-' + Math.floor(100000 + Math.random() * 900000);
    const orderItems = cart.map((c) => ({
      id: c.menuItem.id,
      name: c.menuItem.name,
      quantity: c.quantity,
      price: c.menuItem.price,
    }));

    const paymentMethodLabel =
      orderData.paymentMethod === 'bank_transfer'
        ? `Bank Transfer (${BANK_PAYMENT_DETAILS.bankName})`
        : 'WhatsApp Direct';

    const defaultPaymentStatus: PaymentStatus =
      orderData.paymentMethod === 'bank_transfer' ? 'payment_submitted' : 'pending';

    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      phone: orderData.phone,
      deliveryAddress: orderData.deliveryAddress,
      orderNote: orderData.orderNote,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartTotal,
      status: 'new',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus || defaultPaymentStatus,
      paymentReference: orderData.paymentReference || '',
      paymentProofUrl: orderData.paymentProofUrl || '',
      amountPaid: orderData.amountPaid ?? cartTotal,
      createdAt: new Date().toISOString(),
      userId: user?.uid,
    };

    // Construct WhatsApp message with the exact format required by the restaurant
    const msg = generateWhatsAppOrderMessage({
      customerName: orderData.customerName,
      phone: orderData.phone,
      deliveryAddress: orderData.deliveryAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartTotal,
      paymentMethod: paymentMethodLabel,
      orderNote: orderData.orderNote,
    });

    newOrder.whatsappMessage = msg;

    // Save locally
    setOrders((prev) => [newOrder, ...prev]);

    // Save to Firestore if available
    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'orders', orderId), newOrder);
      } catch (err) {
        console.warn('Firestore order save failed:', err);
      }
    }

    // Auto update user default delivery info if logged in
    if (user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              phone: prev.phone || orderData.phone,
              defaultAddress: prev.defaultAddress || orderData.deliveryAddress,
            }
          : null
      );
    }

    // Clear cart
    setCart([]);

    const whatsappUrl = buildWhatsAppUrl(restaurantSettings.whatsappNumber, msg);
    return { order: newOrder, whatsappUrl };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (db && isFirebaseConfigured) {
      try {
        updateDoc(doc(db, 'orders', orderId), { status });
      } catch (err) {
        console.warn('Firestore order update failed:', err);
      }
    }
    addToast(`Order ${orderId} marked as ${status.replace('_', ' ')}`, 'info');
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
    );
    if (db && isFirebaseConfigured) {
      try {
        updateDoc(doc(db, 'orders', orderId), { paymentStatus });
      } catch (err) {
        console.warn('Firestore order payment update failed:', err);
      }
    }
    addToast(`Order ${orderId} payment status updated to ${paymentStatus.replace('_', ' ')}`, 'info');
  };

  // Table Reservation
  const bookTable = async (data: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
  }) => {
    const resId = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      id: resId,
      name: data.name,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      specialRequest: data.specialRequest,
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: user?.uid,
    };

    setReservations((prev) => [newReservation, ...prev]);

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'reservations', resId), newReservation);
      } catch (err) {
        console.warn('Firestore reservation save failed:', err);
      }
    }

    const msg = generateWhatsAppReservationMessage(data);
    const whatsappUrl = buildWhatsAppUrl(restaurantSettings.whatsappNumber, msg);
    return { reservation: newReservation, whatsappUrl };
  };

  const updateReservationStatus = (reservationId: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status } : r))
    );
    if (db && isFirebaseConfigured) {
      try {
        updateDoc(doc(db, 'reservations', reservationId), { status });
      } catch (err) {
        console.warn('Firestore reservation update failed:', err);
      }
    }
    addToast(`Reservation marked as ${status}`, 'info');
  };

  // Reviews
  const addReview = (reviewData: {
    customerName: string;
    rating: number;
    review: string;
    dishMentioned?: string;
  }) => {
    const revId = 'REV-' + Date.now();
    const newRev: Review = {
      id: revId,
      customerName: reviewData.customerName,
      rating: reviewData.rating,
      review: reviewData.review,
      date: 'Just now',
      verified: true,
      dishMentioned: reviewData.dishMentioned,
      avatarUrl: user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewData.customerName)}&background=f59e0b&color=000` : undefined,
    };
    setReviews((prev) => [newRev, ...prev]);

    if (db && isFirebaseConfigured) {
      try {
        setDoc(doc(db, 'reviews', revId), newRev);
      } catch (err) {
        console.warn('Firestore review save failed:', err);
      }
    }
    addToast('Thank you for your review!', 'success');
  };

  // Contact Message
  const sendContactMessage = (msg: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    const msgId = 'MSG-' + Date.now();
    const newMsg: ContactMessage = {
      id: msgId,
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      subject: msg.subject,
      message: msg.message,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };
    setContactMessages((prev) => [newMsg, ...prev]);

    if (db && isFirebaseConfigured) {
      try {
        setDoc(doc(db, 'contactMessages', msgId), newMsg);
      } catch (err) {
        console.warn('Firestore message save failed:', err);
      }
    }
    addToast('Message received! Our team will respond shortly.', 'success');
  };

  // Restaurant Settings
  const updateRestaurantSettings = (newSettings: Partial<RestaurantSettings>) => {
    setRestaurantSettings((prev) => ({ ...prev, ...newSettings }));
    if (db && isFirebaseConfigured) {
      try {
        setDoc(doc(db, 'restaurantSettings', 'general'), { ...restaurantSettings, ...newSettings });
      } catch (err) {
        console.warn('Firestore settings update failed:', err);
      }
    }
    addToast('Restaurant settings updated successfully', 'success');
  };

  // Authentication Handlers
  const loginCustomer = async (email: string, pass: string): Promise<boolean> => {
    if (!auth) {
      addToast('Firebase Authentication is not available. Please verify Firebase setup.', 'error');
      return false;
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const isUserAdmin = cred.user.email?.toLowerCase() === ADMIN_CONFIG.email.toLowerCase();
      setUser({
        uid: cred.user.uid,
        displayName: cred.user.displayName || email.split('@')[0],
        email: cred.user.email || email,
        role: isUserAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      });
      addToast(`Welcome back, ${cred.user.displayName || email}!`, 'success');
      return true;
    } catch (err: unknown) {
      const errorMsg = formatFirebaseAuthError(err);
      addToast(`Login error: ${errorMsg}`, 'error');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!auth) {
      addToast('Firebase Authentication is not available.', 'error');
      return false;
    }
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const isUserAdmin = cred.user.email?.toLowerCase() === ADMIN_CONFIG.email.toLowerCase();
      setUser({
        uid: cred.user.uid,
        displayName: cred.user.displayName || 'Google Diner',
        email: cred.user.email || '',
        role: isUserAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      });
      addToast(`Signed in with Google as ${cred.user.displayName}`, 'success');
      return true;
    } catch (err: unknown) {
      const errorMsg = formatFirebaseAuthError(err);
      addToast(`Google Sign-In: ${errorMsg}`, 'error');
      return false;
    }
  };

  const registerCustomer = async (profile: {
    displayName: string;
    email: string;
    phone?: string;
    defaultAddress?: string;
    password?: string;
  }): Promise<boolean> => {
    if (!auth || !profile.password) {
      addToast('Password is required for registration.', 'error');
      return false;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, profile.email.trim(), profile.password);
      const newUserProfile: UserProfile = {
        uid: cred.user.uid,
        displayName: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        defaultAddress: profile.defaultAddress,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      setUser(newUserProfile);
      if (db) {
        await setDoc(doc(db, 'users', cred.user.uid), newUserProfile);
      }
      addToast(`Welcome to Savanna Bites, ${profile.displayName}!`, 'success');
      return true;
    } catch (err: unknown) {
      const errorMsg = formatFirebaseAuthError(err);
      addToast(`Registration error: ${errorMsg}`, 'error');
      return false;
    }
  };

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if the email matches the designated restaurant administrator email
    if (cleanEmail !== ADMIN_CONFIG.email.toLowerCase()) {
      addToast(`Access restricted: Only authorized administrator (${ADMIN_CONFIG.email}) can log in.`, 'error');
      return false;
    }

    if (!auth) {
      addToast('Firebase Authentication is not initialized for project "savanna-bites".', 'error');
      return false;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const adminUser: UserProfile = {
        uid: cred.user.uid,
        displayName: cred.user.displayName || 'Administrator',
        email: cred.user.email || cleanEmail,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setUser(adminUser);
      addToast('Administrator authenticated successfully via Firebase!', 'success');
      return true;
    } catch (err: unknown) {
      const fbError = err as { code?: string; message?: string };
      const code = fbError?.code || '';
      const message = fbError?.message || String(err);

      if (
        code === 'auth/invalid-credential' ||
        message.includes('auth/invalid-credential') ||
        message.includes('INVALID_LOGIN_CREDENTIALS')
      ) {
        addToast('Invalid credentials. Please verify your administrator password.', 'error');
      } else if (
        code === 'auth/user-not-found' ||
        message.includes('auth/user-not-found') ||
        message.includes('EMAIL_NOT_FOUND')
      ) {
        addToast(`Admin account (${ADMIN_CONFIG.email}) was not found in Firebase Authentication for project "${FIREBASE_PROJECT_ID}".`, 'error');
      } else if (
        code === 'auth/wrong-password' ||
        message.includes('auth/wrong-password') ||
        message.includes('INVALID_PASSWORD')
      ) {
        addToast('Incorrect administrator password. Please try again or use Forgot Password.', 'error');
      } else if (
        code === 'auth/configuration-not-found' ||
        message.includes('auth/configuration-not-found') ||
        message.includes('CONFIGURATION_NOT_FOUND')
      ) {
        addToast(`Firebase Authentication configuration not found for project "${FIREBASE_PROJECT_ID}". Please ensure Email/Password provider is enabled in Firebase Console.`, 'error');
      } else if (
        code === 'auth/too-many-requests' ||
        message.includes('auth/too-many-requests') ||
        message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')
      ) {
        addToast('Access temporarily blocked due to too many failed login attempts. Please reset your password or try again later.', 'error');
      } else {
        addToast(`Authentication failed: ${message}`, 'error');
      }
      return false;
    }
  };

  const resetAdminPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    return await resetPassword(email.trim().toLowerCase());
  };

  const logout = async () => {
    if (auth && isFirebaseConfigured) {
      await signOut(auth);
    }
    setUser(null);
    if (activeView === 'admin' || activeView === 'account') {
      setActiveView('home');
    }
    addToast('Logged out successfully', 'info');
  };

  // Menu Management
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newId = 'menu-' + Date.now();
    const newItem: MenuItem = { ...itemData, id: newId };
    setMenuItems((prev) => [newItem, ...prev]);
    if (db && isFirebaseConfigured) {
      try {
        setDoc(doc(db, 'menuItems', newId), newItem);
      } catch (err) {
        console.warn('Firestore add menu failed:', err);
      }
    }
    addToast(`Added ${newItem.name} to menu`, 'success');
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    if (db && isFirebaseConfigured) {
      try {
        updateDoc(doc(db, 'menuItems', id), updates);
      } catch (err) {
        console.warn('Firestore update menu failed:', err);
      }
    }
    addToast('Menu item updated', 'success');
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find((m) => m.id === id);
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    if (db && isFirebaseConfigured) {
      try {
        deleteDoc(doc(db, 'menuItems', id));
      } catch (err) {
        console.warn('Firestore delete menu failed:', err);
      }
    }
    if (item) {
      addToast(`Deleted ${item.name} from menu`, 'info');
    }
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.isAvailable;
          addToast(
            `${item.name} is now ${next ? 'Available (In Stock)' : 'Unavailable (Sold Out)'}`,
            next ? 'success' : 'info'
          );
          if (db && isFirebaseConfigured) {
            try {
              updateDoc(doc(db, 'menuItems', id), { isAvailable: next });
            } catch (err) {
              console.warn(err);
            }
          }
          return { ...item, isAvailable: next };
        }
        return item;
      })
    );
  };

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        cartCount,

        orders,
        placeOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,

        reservations,
        bookTable,
        updateReservationStatus,

        reviews,
        addReview,

        contactMessages,
        sendContactMessage,

        restaurantSettings,
        updateRestaurantSettings,

        user,
        isAdmin,
        loginCustomer,
        loginWithGoogle,
        registerCustomer,
        loginAdmin,
        resetAdminPassword,
        logout,

        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,

        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
