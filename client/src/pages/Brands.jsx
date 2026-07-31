import React from 'react';
import { ShieldAlert, Award, ShieldCheck, Heart } from 'lucide-react';

export const Brands = () => {
  const brandList = [
    { name: 'Samsung', desc: 'QLED, OLED, Crystal UHD Smart TVs repair specialists.' },
    { name: 'LG', desc: 'OLED, NanoCell, ThinQ Smart TVs panel calibration.' },
    { name: 'Sony', desc: 'Bravia OLED, Google TV motherboard micro-soldering.' },
    { name: 'MI', desc: 'PatchWall TV software flashes, backlight swap.' },
    { name: 'OnePlus', desc: 'Nord TV power module repairs, display updates.' },
    { name: 'TCL', desc: 'Mini-LED display replacements, logical board reflow.' },
    { name: 'Panasonic', desc: 'Viera TV system troubleshooting, original boards.' },
    { name: 'Vu', desc: 'Cinema TV screens, logic repair service.' },
    { name: 'Haier', desc: 'Diagnostic checks, power board replacements.' },
    { name: 'Hisense', desc: 'ULED display repair, standby lights repair.' },
    { name: 'Motorola', desc: 'Android TV interface troubleshooting, parts replacement.' },
    { name: 'Realme', desc: 'Smart TV backlight restoration, LED displays.' },
    { name: 'Custom Assembled TVs', desc: 'Tailored panel displays, budget configuration assembly.' }
  ];

  return (
    <div className="space-y-16 py-6 text-left max-w-4xl mx-auto">
      {/* Page Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Supported Brands</h1>
        <p className="text-sm uppercase tracking-widest text-primary dark:text-primary-light font-bold">
          Sales & Services for all major brands
        </p>
        <div className="h-1 w-12 bg-primary rounded-full mx-auto mt-4" />
      </section>

      {/* Intro Context */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="p-4 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light rounded-2xl flex-shrink-0">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Multi-Brand Engineering Expertise</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Our diagnostic workshop is fully equipped with micro-soldering stations, panel bonding machines, and testing rigs specifically calibrated to address issues across different manufacturer configurations. We carry specific logic boards and backlight arrays for all the brands listed below.
          </p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {brandList.map((brand, idx) => (
          <div key={idx} className="premium-card p-6 bg-white dark:bg-card-dark hover:border-primary transition-all">
            <h3 className="font-bold text-base text-slate-950 dark:text-white mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {brand.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {brand.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Note on custom assembled screens */}
      <section className="bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-250/30 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-450">
        All brand names and registered trademarks listed above are the property of their respective owners. Siva Electronics acts as an independent sales and repair service center.
      </section>
    </div>
  );
};

export default Brands;
