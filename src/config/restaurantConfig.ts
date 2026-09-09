import { RestaurantSettings } from '../types';

export const BANK_PAYMENT_DETAILS = {
  bankName: 'Moniepoint',
  accountNumber: '9076930244',
  accountName: 'Abbas Taofiq Ayomide',
};

export const ADMIN_CONFIG = {
  email: 'taofiqa194@gmail.com',
};

export const DEFAULT_RESTAURANT_SETTINGS: RestaurantSettings = {
  restaurantName: 'Savanna Bites',
  tagline: 'Good Food. Great Moments.',
  heroDescription:
    'Experience delicious Nigerian and continental dishes prepared fresh with quality ingredients and served with love.',
  phone: '09076930244',
  whatsappNumber: '2349076930244', // Clean digits for WhatsApp wa.me links
  email: 'taofiqa194@gmail.com',
  address: 'Asa Dam, Ilorin, Kwara State, Nigeria',
  city: 'Ilorin, Kwara State, Nigeria',
  openingHours: 'Mon - Sun: 9:00 AM - 11:00 PM (Kitchen closes at 10:30 PM)',
  deliveryFee: 1000,
  freeDeliveryThreshold: 20000,
  announcement: '🔥 Fresh delicacies prepared daily at Asa Dam, Ilorin! Call or WhatsApp 09076930244',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Asa+Dam+Ilorin+Kwara+State+Nigeria',
};

/**
 * Format currency in Nigerian Naira (₦)
 */
export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG');
}

/**
 * Generates the standardized WhatsApp order message required by the restaurant
 */
export function generateWhatsAppOrderMessage(order: {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  orderNote?: string;
}): string {
  const itemsList = order.items
    .map(
      (item) =>
        `- ${item.name} × ${item.quantity}\n  ${formatNaira(item.price)} each`
    )
    .join('\n');

  return `Restaurant: Savanna Bites

Customer Name: ${order.customerName}
Phone: ${order.phone}
Delivery Address: ${order.deliveryAddress}

Order:
${itemsList}

Subtotal: ${formatNaira(order.subtotal)}
Delivery fee: ${formatNaira(order.deliveryFee)}
Total: ${formatNaira(order.total)}

Payment method: ${order.paymentMethod}

Order note: ${order.orderNote && order.orderNote.trim() !== '' ? order.orderNote : 'None'}`;
}

/**
 * Generates the WhatsApp table reservation message
 */
export function generateWhatsAppReservationMessage(reservation: {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
}): string {
  return `Restaurant: Savanna Bites

I would like to book a table at Asa Dam, Ilorin.

Guest Name: ${reservation.name}
Phone: ${reservation.phone}
Date: ${reservation.date}
Time: ${reservation.time}
Number of Guests: ${reservation.guests}

Special Request: ${
    reservation.specialRequest && reservation.specialRequest.trim() !== ''
      ? reservation.specialRequest
      : 'None'
  }`;
}

/**
 * Build direct WhatsApp URL for sending message
 */
export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  // Strip any leading plus or spaces
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
