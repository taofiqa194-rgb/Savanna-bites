export type MenuCategory =
  | 'All'
  | 'Nigerian Dishes'
  | 'Rice & Pasta'
  | 'Swallow & Soups'
  | 'Grills'
  | 'Fast Food'
  | 'Snacks'
  | 'Drinks'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<MenuCategory, 'All'>;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  preparationTime?: string;
  calories?: string;
  tags?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: string[];
}

export type PaymentStatus = 'pending' | 'payment_submitted' | 'verified' | 'rejected';

export type PaymentMethod = 'bank_transfer' | 'whatsapp';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'
  | 'pending'
  | 'delivered';

export interface OrderItemSummary {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  orderNote?: string;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paymentProofUrl?: string;
  amountPaid?: number;
  createdAt: string;
  userId?: string;
  whatsappMessage?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'cancelled';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
  userId?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
  dishMentioned?: string;
  avatarUrl?: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  heroDescription: string;
  phone: string;
  phone2?: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  announcement: string;
  googleMapsUrl?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  defaultAddress?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'resolved';
}

export type AppView =
  | 'home'
  | 'menu'
  | 'about'
  | 'reservations'
  | 'contact'
  | 'account'
  | 'admin';
