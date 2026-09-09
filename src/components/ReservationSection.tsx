import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Calendar, Clock, Users, Send, CheckCircle2, Sparkles, AlertCircle, Utensils } from 'lucide-react';

export const ReservationSection: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { bookTable, restaurantSettings, user, addToast } = useRestaurant();

  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{ id: string; whatsappUrl: string } | null>(
    null
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Minimum date today
  const todayStr = new Date().toISOString().split('T')[0];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!date) newErrors.date = 'Please select a reservation date';
    if (!time) newErrors.time = 'Please select a preferred time';
    if (guests < 1) newErrors.guests = 'Minimum 1 guest';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { reservation, whatsappUrl } = await bookTable({
        name: name.trim(),
        phone: phone.trim(),
        date,
        time,
        guests: Number(guests),
        specialRequest: specialRequest.trim(),
      });

      setBookingSuccess({ id: reservation.id, whatsappUrl });
      addToast(`Table request ${reservation.id} submitted! Opening WhatsApp...`, 'success');

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
      addToast('Failed to submit reservation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation-section" className="relative">
      <div className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Fine Dining & Celebrations
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Reserve Your Table
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Whether it’s a romantic candlelit dinner, family Sunday feast, or corporate executive lunch, we prepare a memorable table for you.
            </p>
          </div>

          {bookingSuccess ? (
            <div className="p-8 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 text-center max-w-md mx-auto space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Booking Details Prepared!</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Your reservation request for <strong className="text-amber-400">{guests} guests</strong> on{' '}
                <strong className="text-white">{date}</strong> at <strong className="text-white">{time}</strong> has been logged.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={bookingSuccess.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Confirmation to WhatsApp</span>
                </a>
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="text-xs text-zinc-400 hover:text-white py-1"
                >
                  Book Another Table
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Guest Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Ngozi Okonjo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden ${
                      errors.name ? 'border-red-500' : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0812 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden ${
                      errors.phone ? 'border-red-500' : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Number of Guests <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25].map((num) => (
                      <option key={num} value={num} className="bg-zinc-900">
                        {num} {num === 1 ? 'Guest (Solo Diner)' : num >= 15 ? 'Guests (Private Party)' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Reservation Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden ${
                      errors.date ? 'border-red-500' : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                  {errors.date && <p className="text-[11px] text-red-400 mt-1">{errors.date}</p>}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Preferred Time <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="12:00">12:00 PM (Lunch)</option>
                    <option value="13:00">01:00 PM (Lunch)</option>
                    <option value="14:00">02:00 PM (Lunch)</option>
                    <option value="16:00">04:00 PM (Afternoon)</option>
                    <option value="18:00">06:00 PM (Dinner)</option>
                    <option value="19:00">07:00 PM (Dinner)</option>
                    <option value="20:00">08:00 PM (Prime Dinner)</option>
                    <option value="21:00">09:00 PM (Late Dinner)</option>
                    <option value="22:00">10:00 PM (Supper)</option>
                  </select>
                </div>

                {/* Special Request */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Special Request (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Window booth, birthday cake sparkler"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-zinc-400">
                  ⚡ Reservations confirmed directly on WhatsApp with table assignment within 10 minutes.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  <span>{isSubmitting ? 'Booking Table...' : 'Confirm Table via WhatsApp'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
