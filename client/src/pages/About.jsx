import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Eye, Wrench, Award, Users } from 'lucide-react';

export const About = () => {
  return (
    <div className="space-y-16 py-6 text-left max-w-4xl mx-auto">
      {/* Intro Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Story</h1>
        <p className="text-sm uppercase tracking-widest text-primary dark:text-primary-light font-bold">
          Serving with Integrity Since 2011
        </p>
        <div className="h-1 w-12 bg-primary rounded-full mx-auto mt-4" />
      </section>

      {/* Grid: Story & Values */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Company Roots</h2>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            Founded in 2011, **Siva Electronics** began as a small TV diagnostics shop with a singular focus: to offer honest, reliable electronics troubleshooting in our local community. Over the last decade and a half, we have expanded to become a premier Sales & Service Center in the region.
          </p>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            We specialize in Smart TV setups, genuine OEM spare parts, complex component repairs, and custom-assembled LED screens. By bypassing intermediate retail markups, we deliver luxury display setups directly to our customers at affordable pricing models.
          </p>
        </div>
        <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 shadow-xl flex items-center justify-center border border-slate-200 dark:border-slate-800">
          <div className="text-center p-6 text-white space-y-2">
            <Wrench className="w-16 h-16 text-primary-light mx-auto animate-pulse" />
            <span className="block font-bold text-lg">25+ Years Technical Experience</span>
            <span className="block text-xs text-slate-400">Micro-soldering, backlight arrays, and panel replacements</span>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="premium-card p-8 bg-white dark:bg-card-dark text-left space-y-4">
          <div className="h-12 w-12 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-2xl">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
            To provide high-quality sales and micro-electronic service adjustments that breathe life back into household entertainment systems. We focus on repair over replacement, saving client expenditure and preventing electronic waste.
          </p>
        </div>

        <div className="premium-card p-8 bg-white dark:bg-card-dark text-left space-y-4">
          <div className="h-12 w-12 bg-orange-550/10 text-accent dark:bg-orange-550/20 dark:text-accent flex items-center justify-center rounded-2xl">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Our Vision</h3>
          <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
            To become the premier smart display solution center in the state, recognized for pioneering custom TV assemblies, deploying professional home technicians, and maintaining a robust inventory of high-grade spare parts.
          </p>
        </div>
      </section>

      {/* Experience and Quality Badging */}
      <section className="text-center py-6 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">100% Quality Audited</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Award className="w-8 h-8 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Certified Engineers</span>
          </div>
          <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
            <Users className="w-8 h-8 text-green-500" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Thousands of Happy Clients</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
