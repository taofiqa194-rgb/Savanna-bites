import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  formatNaira,
  BANK_PAYMENT_DETAILS,
  DEFAULT_RESTAURANT_SETTINGS,
} from '../config/restaurantConfig';
import {
  X,
  Send,
  User,
  Phone,
  FileText,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Building2,
  Copy,
  Check,
  UploadCloud,
  ShieldCheck,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    user,
    restaurantSettings,
    addToast,
  } = useRestaurant();

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');

  // Customer delivery details
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.defaultAddress || '');
  const [orderNote, setOrderNote] = useState('');

  // Bank transfer specific state
  const [hasMadePayment, setHasMadePayment] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Form errors & submission
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generated Order Number for current session
  const [sessionOrderId] = useState(
    () => 'SB-' + Math.floor(100000 + Math.random() * 900000)
  );

  // Completed order state
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    whatsappUrl: string;
    method: PaymentMethod;
  } | null>(null);

  if (!isCheckoutOpen) return null;

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_PAYMENT_DETAILS.accountNumber);
      setCopiedAccount(true);
      addToast(
        `Copied Moniepoint account number: ${BANK_PAYMENT_DETAILS.accountNumber}`,
        'success'
      );
      setTimeout(() => setCopiedAccount(false), 2500);
    } catch {
      addToast(`Account Number: ${BANK_PAYMENT_DETAILS.accountNumber}`, 'info');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('File too large. Please upload an image under 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProofImage(reader.result as string);
        addToast('Payment proof screenshot attached!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      newErrors.customerName = 'Please enter your full name (minimum 2 characters)';
    }
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      newErrors.phone = 'Please enter a valid active phone number';
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      newErrors.deliveryAddress = 'Please provide a clear delivery address and landmark in Ilorin';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please complete all required delivery fields', 'error');
      return;
    }

    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const { order, whatsappUrl } = await placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        orderNote: orderNote.trim(),
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'bank_transfer' ? 'payment_submitted' : 'pending',
        paymentReference: paymentReference.trim(),
        paymentProofUrl: proofImage || undefined,
        amountPaid: cartTotal,
      });

      setCompletedOrder({
        orderId: order.id,
        whatsappUrl,
        method: paymentMethod,
      });

      if (paymentMethod === 'bank_transfer') {
        addToast(
          `Order ${order.id} received! Payment submitted for admin verification.`,
          'success'
        );
      } else {
        addToast(`Order ${order.id} logged! Opening WhatsApp...`, 'success');
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to process order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    setHasMadePayment(false);
    setProofImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-stone-200 animate-in zoom-in-95 duration-200 my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {paymentMethod === 'bank_transfer' ? (
                <CreditCard className="w-5 h-5" />
              ) : (
                <MessageSquare className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                {completedOrder
                  ? 'Order Confirmation'
                  : 'Checkout & Payment'}
              </h2>
              <p className="text-xs text-zinc-400">
                {completedOrder
                  ? 'Thank you for ordering with Savanna Bites'
                  : 'Fast delivery from our kitchen at Asa Dam, Ilorin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Order Number: {completedOrder.orderId}
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-3">
                Order Placed Successfully!
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong className="text-white">{customerName}</strong>.
                {completedOrder.method === 'bank_transfer'
                  ? ' Your payment details have been submitted. Our manager at Asa Dam, Ilorin will verify the bank transfer and begin kitchen preparation.'
                  : ` Your order details are ready to send to our team on WhatsApp (${restaurantSettings.phone}).`}
              </p>
            </div>

            {/* Order status card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-xs text-left max-w-md mx-auto space-y-2.5">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Total Amount:</span>
                <span className="text-amber-400 font-mono font-bold text-base">
                  {formatNaira(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Payment Method:</span>
                <span className="text-white font-medium">
                  {completedOrder.method === 'bank_transfer'
                    ? `Bank Transfer (${BANK_PAYMENT_DETAILS.bankName})`
                    : 'WhatsApp Direct'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Payment Status:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold text-[11px]">
                  {completedOrder.method === 'bank_transfer'
                    ? 'Payment Submitted (Pending Admin Verification)'
                    : 'Pending Confirmation'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Delivery Address:</span>
                <span className="text-white font-medium text-right max-w-[200px] truncate">
                  {deliveryAddress}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={completedOrder.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Notify via WhatsApp (09076930244)</span>
              </a>
              <button
                onClick={handleClose}
                className="py-3 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-stone-200 text-sm font-semibold transition cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-6">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Bank Transfer (Moniepoint) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-amber-500/10 border-amber-500/50 text-white ring-1 ring-amber-500/50'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Bank Transfer</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                        Moniepoint
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Pay directly to restaurant account and upload receipt
                    </p>
                  </div>
                </button>

                {/* Option 2: WhatsApp Direct */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white ring-1 ring-emerald-500/50'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      paymentMethod === 'whatsapp'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">WhatsApp Order</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                        09076930244
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Send full order details directly to WhatsApp chat
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Bank Transfer Details Card (Displayed when bank transfer is chosen) */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-sm text-white">Savanna Bites Official Bank Account</h4>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Please transfer exactly <strong className="text-amber-400 font-mono">{formatNaira(cartTotal)}</strong>
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
                    Order Ref: {sessionOrderId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 block font-mono">Bank Name</span>
                    <span className="text-sm font-extrabold text-white">{BANK_PAYMENT_DETAILS.bankName}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/40 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-amber-400 block font-mono">Account Number</span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <span className="text-base font-mono font-black text-amber-300 block tracking-wider mt-0.5">
                      {BANK_PAYMENT_DETAILS.accountNumber}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 block font-mono">Account Name</span>
                    <span className="text-xs font-bold text-white block truncate">{BANK_PAYMENT_DETAILS.accountName}</span>
                  </div>
                </div>

                {!hasMadePayment ? (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition cursor-pointer border border-zinc-700"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Account Number (9076930244)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasMadePayment(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition shadow-md cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Have Made Payment</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-3">
                    <div className="flex items-center justify-between text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Transfer Confirmation Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setHasMadePayment(false)}
                        className="text-[11px] underline text-zinc-400 hover:text-white cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                          Payment Reference / Sender Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Session ID or Transfer Name"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                          Attach Payment Screenshot / Proof
                        </label>
                        <label className="flex items-center justify-center gap-2 w-full bg-zinc-950 border border-dashed border-zinc-700 hover:border-amber-500 rounded-xl px-3 py-2 text-xs text-zinc-300 cursor-pointer transition">
                          <UploadCloud className="w-4 h-4 text-amber-400" />
                          <span className="truncate">
                            {proofImage ? 'Screenshot Attached ✓' : 'Upload Receipt'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {proofImage && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-700">
                        <img src={proofImage} alt="Receipt preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProofImage(null)}
                          className="absolute top-1 right-1 p-0.5 bg-black/80 rounded-full text-white hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Delivery Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Contact & Address */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  Delivery & Contact Information
                </h3>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Customer Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Taofiq Abbas"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full bg-zinc-900 border rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-hidden ${
                      errors.customerName
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Phone Number (WhatsApp Active) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      placeholder="e.g. 09076930244"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-zinc-900 border rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-hidden ${
                        errors.phone
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-zinc-800 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Delivery Address & Landmark <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Asa Dam Road, near Stadium junction, Ilorin"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className={`w-full bg-zinc-900 border rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-hidden resize-none ${
                      errors.deliveryAddress
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.deliveryAddress}
                    </p>
                  )}
                </div>

                {/* Optional Order Note */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Order Note / Special Request (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra pepper sauce, call when arriving"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500"
                  />
                </div>
              </div>

              {/* Right Column: Order Summary & Review */}
              <div className="flex flex-col justify-between bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Order Summary ({cart.length} items)
                  </h3>

                  {/* Items List */}
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 divide-y divide-zinc-800/80">
                    {cart.map(({ menuItem, quantity }) => (
                      <div key={menuItem.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex-1 pr-2">
                          <span className="font-semibold text-stone-200">{menuItem.name}</span>
                          <span className="text-zinc-500 ml-1">× {quantity}</span>
                        </div>
                        <span className="font-mono text-amber-400 font-medium">
                          {formatNaira(menuItem.price * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1.5 text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-stone-200">{formatNaira(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery (Ilorin)</span>
                      <span className="font-mono text-stone-200">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-400 font-bold">FREE</span>
                        ) : (
                          formatNaira(deliveryFee)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                      <span>Total</span>
                      <span className="font-mono text-amber-400 text-base">
                        {formatNaira(cartTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit button & disclaimer */}
                <div className="mt-5 pt-3 border-t border-zinc-800">
                  <div className="text-[11px] text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 mb-3 space-y-1">
                    <span className="font-semibold text-zinc-300 block">
                      {paymentMethod === 'bank_transfer'
                        ? '🛡️ Verification Notice:'
                        : '💬 WhatsApp Direct:'}
                    </span>
                    <p className="text-[10.5px] leading-relaxed text-zinc-400">
                      {paymentMethod === 'bank_transfer'
                        ? 'Bank transfer payments are submitted for manual verification by the restaurant administrator. We do not claim instant automated verification until confirmed.'
                        : 'Your order will be formatted and opened in WhatsApp chat with restaurant number 09076930244 for fast confirmation.'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50 ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/10'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/10'
                    }`}
                  >
                    {paymentMethod === 'bank_transfer' ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {isSubmitting
                            ? 'Submitting Order...'
                            : hasMadePayment
                            ? 'Submit Order with Payment Details'
                            : 'Place Order via Bank Transfer'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Formatting Order...' : 'Place Order via WhatsApp'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
