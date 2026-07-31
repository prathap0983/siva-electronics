import React from 'react';
import { 
  Tv, Wrench, Shield, CheckCircle, RefreshCw, Smartphone, 
  Settings, Home as HomeIcon, LayoutGrid, HelpCircle, PhoneCall
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';

export const Services = () => {
  const { settings } = useSettings();

  const phone = settings?.phone || '+91 8072300191';

  const services = [
    {
      title: 'Smart TV Sales',
      icon: Tv,
      desc: 'Top-tier Smart TVs loaded with Android OS, built-in apps, and high-contrast LED displays in various sizes (32" to 75").'
    },
    {
      title: 'LED TV Sales',
      icon: LayoutGrid,
      desc: 'Energy-efficient high-definition LED television sales with extended store warranty policies.'
    },
    {
      title: 'Backlight Replacement',
      icon: RefreshCw,
      desc: 'Fixing sound-but-no-picture issues by replacing faulty LED backlight strips with original high-intensity components.'
    },
    {
      title: 'Display Replacement',
      icon: Smartphone,
      desc: 'Expert panel replacements for cracked, lined, or double-imaging screens at cost-effective prices.'
    },
    {
      title: 'Power Supply Repair',
      icon: Settings,
      desc: 'Diagnosing power failures, dead standby lights, and voltage fluctuations in internal power boards.'
    },
    {
      title: 'Motherboard Repair',
      icon: Wrench,
      desc: 'Micro-soldering, firmware flashing, and BGA repairs on logic boards to recover dead TVs.'
    },
    {
      title: 'Home Service',
      icon: HomeIcon,
      desc: 'Technicians deploy straight to your home for diagnostic checkups, saving you the hassle of carrying heavy TVs.'
    },
    {
      title: 'Wall Mount Installation',
      icon: Shield,
      desc: 'Professional installation using heavy-duty steel mounts (fixed, tilting, or swivel options) for maximum safety.'
    },
    {
      title: 'Custom TV Assembly',
      icon: LayoutGrid,
      desc: 'Custom-assembled LED TVs constructed using high-quality IPS panels and custom motherboards matching specific budgets.'
    }
  ];

  const steps = [
    { number: '1', title: 'Schedule Visit', desc: 'Call us or request a technician via phone/WhatsApp.' },
    { number: '2', title: 'On-Site Diagnosis', desc: 'Our engineer checks the TV and identifies the failure.' },
    { number: '3', title: 'Cost Estimation', desc: 'We present a transparent parts and service cost estimate.' },
    { number: '4', title: 'Quality Repair', desc: 'Upon approval, we swap parts and test for 2+ hours.' },
    { number: '5', title: 'Warranty Delivery', desc: 'Get your TV back along with a service guarantee invoice.' }
  ];

  return (
    <div className="space-y-20 py-6 text-left max-w-5xl mx-auto">
      
      {/* Intro */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Services</h1>
        <p className="text-sm uppercase tracking-widest text-primary dark:text-primary-light font-bold">
          Professional Sales, Installation & Diagnostic Repairs
        </p>
        <div className="h-1 w-12 bg-primary rounded-full mx-auto mt-4" />
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv, index) => {
          const Icon = srv.icon;
          return (
            <div key={index} className="premium-card p-8 bg-white dark:bg-card-dark flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-12 w-12 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-2xl">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{srv.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* How it Works / Timeline */}
      <section className="space-y-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 transition-all text-center">
        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-990 dark:text-white">Our Service Workflow</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Five easy steps to repair your home television.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4 relative">
          {steps.map((st, idx) => (
            <div key={idx} className="space-y-3 text-center flex flex-col items-center">
              <div className="h-10 w-10 bg-primary text-white flex items-center justify-center font-bold rounded-full shadow">
                {st.number}
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{st.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[150px]">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-hover/30 to-slate-950/80" />
        <div className="relative max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Need Home Diagnostics?</h2>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Call Siva Electronics right now to book a home service technician. We repair and wall mount all models: Sony, Samsung, LG, MI, OnePlus, and more!
          </p>
          <a
            href="tel:+918072300191"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-slate-950 px-6 py-3.5 rounded-full text-sm font-bold shadow transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Book Home Visit</span>
          </a>
        </div>
      </section>

    </div>
  );
};

export default Services;
