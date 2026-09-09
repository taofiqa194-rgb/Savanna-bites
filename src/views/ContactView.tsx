import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { buildWhatsAppUrl } from '../config/restaurantConfig';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { restaurantSettings, sendContactMessage, addToast, user } = useRestaurant();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('Please fill in your name, email, and message', 'error');
      return;
    }

    sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim() || 'General Inquiry',
      message: message.trim(),
    });

    setIsSubmitted(true);
  };

  const directWhatsAppUrl = buildWhatsAppUrl(
    restaurantSettings.whatsappNumber,
    'Hello Savanna Bites, I would like to get in touch with your team regarding an inquiry or event.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          Get in Touch
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Contact & Location
        </h1>
        <p className="text-sm text-zinc-400">
          Have questions about our dishes, catering requests, or directions to our Asa Dam, Ilorin dining lounge? We’d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Phone Numbers Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Call Us Directly</h3>
                <p className="text-xs text-zinc-400">Lines open 9:00 AM – 11:00 PM daily</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-sm font-mono">
              <a
                href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 text-stone-200 hover:text-amber-400 transition"
              >
                <span>Primary: {restaurantSettings.phone}</span>
                <span className="text-xs font-sans text-amber-400 font-bold">Call Now</span>
              </a>

              {restaurantSettings.phone2 && (
                <a
                  href={`tel:${restaurantSettings.phone2.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 text-stone-200 hover:text-amber-400 transition"
                >
                  <span>Orders: {restaurantSettings.phone2}</span>
                  <span className="text-xs font-sans text-amber-400 font-bold">Call Now</span>
                </a>
              )}
            </div>
          </div>

          {/* WhatsApp Direct Chat Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-zinc-900 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">WhatsApp Customer Support</h3>
                <p className="text-xs text-zinc-400">Instant answers & order confirmations</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300">
              Chat directly with our kitchen manager for custom meal boxes, bulk party small chops, or VIP table setups.
            </p>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition shadow-lg shadow-emerald-500/15"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Start WhatsApp Conversation</span>
            </a>
          </div>

          {/* Location & Opening Hours */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Restaurant Address</h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {restaurantSettings.address}
                </p>
                {restaurantSettings.googleMapsUrl && (
                  <a
                    href={restaurantSettings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline mt-2 font-semibold"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Opening Hours</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{restaurantSettings.openingHours}</p>
                <p className="text-xs text-amber-400/90 mt-1">Delivery runs throughout opening hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form & Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-amber-400" />
              <h2 className="font-display text-xl font-bold text-white">Send Us a Direct Message</h2>
            </div>

            {isSubmitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Message Delivered!</h3>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                  Thank you, <strong className="text-white">{name}</strong>. Our guest relations team has received your message and will reply to <strong className="text-amber-400">{email}</strong> within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                    setSubject('');
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Your Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chioma Eze"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="chioma@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="0802 345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Corporate Catering, Feedback"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Your Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you need..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Interactive Map Visual */}
          <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                Lekki Phase 1 Prime Location
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Dine-in Open Today
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-21/9 bg-zinc-950 border border-zinc-800/80 group">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80"
                alt="Lagos Admiralty Way Area Map"
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                <span className="font-display text-base font-bold text-white">Savanna Bites Lounge</span>
                <p className="text-xs text-zinc-300">Plot 14B Admiralty Way (Opposite Prince Ebeano Supermarket)</p>
                <a
                  href="https://maps.google.com/?q=Lekki+Phase+1+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold mt-2"
                >
                  <span>Open in Google Navigation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
