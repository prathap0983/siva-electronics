import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { Menu, X, Sun, Moon, Phone, MessageSquare, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PublicLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const { settings, loading } = useSettings();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/products', label: 'Products' },
    { path: '/spare-parts', label: 'Spare Parts' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/brands', label: 'Brands' },
    { path: '/contact', label: 'Contact' }
  ];

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const businessName = settings?.business_name || 'Siva Electronics';
  const phone = settings?.phone || '';
  const whatsapp = settings?.whatsapp || '';
  const address = settings?.address || '';
  const hours = settings?.business_hours || {};
  const socials = settings?.social_links || {};

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full transition-all border-b border-slate-200/50 dark:border-slate-800/40 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-10 w-auto rounded-lg" />
            ) : (
              <div className="h-10 w-10 bg-primary text-white flex items-center justify-center font-bold text-xl rounded-xl shadow-md group-hover:scale-105 transition-transform">
                S
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                {businessName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Sales & Service Center</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors relative py-2 ${
                    isActive
                      ? 'text-primary dark:text-primary-light'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-primary-light rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Shopping Cart Indicator */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[10px] h-5 w-5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Quick Contact CTA */}
            {phone && (
              <button
                type="button"
                onClick={() => window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-slate-950 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburguer and Theme Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Mobile Cart Link */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[8px] h-4 w-4 rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />
            {/* Slider Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 md:hidden flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-slate-950 dark:text-white">Navigation</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-6 h-6 text-slate-500" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={handleMobileLinkClick}
                      className="text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Mobile CTA */}
              <div className="flex flex-col gap-3 mt-auto">
                {phone && (
                  <button
                    type="button"
                    onClick={() => window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center justify-center gap-2 bg-primary text-slate-950 py-3 rounded-xl text-sm font-semibold shadow-md w-full"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </button>
                )}
                {whatsapp && (
                  <button
                    type="button"
                    onClick={() => window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank', 'noopener,noreferrer')}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md w-full"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Pages Content wrapper */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Business Info Column */}
            <div className="flex flex-col gap-3">
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-wide">
                {businessName}
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Your trusted sales & service center. Specialized in Smart LED TV sales, home repair services, custom TV assemblies, and genuine spare parts.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4 mt-2">
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                    Facebook
                  </a>
                )}
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
                    Instagram
                  </a>
                )}
                {socials.youtube && (
                  <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                    YouTube
                  </a>
                )}
              </div>
            </div>

            {/* Quick Contact & Address Column */}
            <div className="flex flex-col gap-4">
              <span className="font-bold text-sm tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Contact & Location
              </span>
              {phone && (
                <button
                  type="button"
                  onClick={() => window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors text-sm text-left w-full"
                >
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{phone}</span>
                </button>
              )}
              {whatsapp && (
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank', 'noopener,noreferrer')}
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-green-500 transition-colors text-sm text-left w-full"
                >
                  <MessageSquare className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>WhatsApp Chat</span>
                </button>
              )}
              {address && (
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-sm">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </div>
              )}
            </div>

            {/* Business Hours Column */}
            <div className="flex flex-col gap-4">
              <span className="font-bold text-sm tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Business Hours
              </span>
              <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span>Mon - Sat: {hours.weekdays || '9:00 AM - 8:30 PM'}</span>
                  <span>Sunday: {hours.sunday || '10:00 AM - 5:00 PM'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
            <span>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</span>
            <Link to="/admin" className="hover:text-primary transition-colors hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
