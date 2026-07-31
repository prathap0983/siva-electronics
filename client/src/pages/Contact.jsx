import React from 'react';
import { Phone, MessageSquare, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';

export const Contact = () => {
  const { settings } = useSettings();

  const businessName = settings?.business_name || 'Siva Electronics';
  const phone = settings?.phone || '+91 8072300191';
  const whatsapp = settings?.whatsapp || '8072300191';
  const address = settings?.address || 'Siva electronics,north car street,vava complex,tiruchendur 628205';
  const hours = settings?.business_hours || {};

  // Clean WhatsApp number
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-16 py-6 text-left max-w-5xl mx-auto animate-enter">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Contact Us</h1>
        <p className="text-sm uppercase tracking-widest text-primary dark:text-primary-light font-bold">
          Get in touch directly by Phone or WhatsApp
        </p>
        <div className="h-1 w-12 bg-primary rounded-full mx-auto mt-4" />
      </section>

      {/* Two Column details and map layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Visit Our Center</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We are located in the heart of the town. Bring your Smart/LED television in for a quick diagnostics test, or contact us to schedule a home pickup or installation service.
            </p>
          </div>

          <div className="space-y-6">
            {/* Phone */}
            <div className="flex gap-4 items-start">
              <div className="h-12 w-12 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-2xl flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Call Shop</span>
                <button
                  type="button"
                  onClick={() => window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors hover:underline text-left"
                >
                  {phone}
                </button>
                <p className="text-xs text-slate-450">Tap to call our service representative</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex gap-4 items-start">
              <div className="h-12 w-12 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 flex items-center justify-center rounded-2xl flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">WhatsApp Chat</span>
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/${cleanWhatsapp}`, '_blank', 'noopener,noreferrer')}
                  className="text-lg font-bold text-slate-900 dark:text-white hover:text-green-500 transition-colors hover:underline text-left"
                >
                  Send a Message
                </button>
                <p className="text-xs text-slate-450">Instant quotes, compatibility questions, screen images</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4 items-start">
              <div className="h-12 w-12 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-2xl flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Address</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed max-w-sm">
                  {address}
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex gap-4 items-start">
              <div className="h-12 w-12 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-2xl flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Operating Hours</span>
                <div className="text-sm font-semibold text-slate-750 dark:text-slate-350 space-y-1">
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-500">Mon - Sat:</span>
                    <span>{hours.weekdays || '9:00 AM - 8:30 PM'}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-500">Sunday:</span>
                    <span>{hours.sunday || '10:00 AM - 5:00 PM'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Embed */}
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interactive Location Map</h2>
          <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
            <iframe 
              title="Siva Electronics Location Map"
              src="https://maps.google.com/maps?q=8.497879612056023,78.11939355271882&z=17&output=embed" 
              className="w-full h-full border-0"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-450 mt-2 px-2">
            <span>Tiruchendur, Tamil Nadu Region</span>
            <a 
              href="https://www.google.com/maps?q=8.497879612056023,78.11939355271882" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-primary flex items-center gap-0.5 hover:underline"
            >
              <span>Open in Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
