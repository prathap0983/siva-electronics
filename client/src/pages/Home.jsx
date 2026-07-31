import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, MessageSquare, ShieldCheck, Cpu, Clock, CheckCircle2, 
  Tv, Wrench, ArrowRight, Award, Users, Star, StarHalf
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';
import api from '../api/api.js';
import Skeleton from '../components/Skeleton.jsx';

export const Home = () => {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredParts, setFeaturedParts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch featured products (limited to 4)
        const productsRes = await api.get('/products?featured=true&limit=4');
        setFeaturedProducts(productsRes.data.products || []);

        // Fetch spare parts (limit to 3)
        const partsRes = await api.get('/spare-parts');
        setFeaturedParts(partsRes.data.slice(0, 3) || []);

        // Fetch gallery items (limit to 6)
        const galleryRes = await api.get('/gallery');
        setGalleryItems(galleryRes.data.slice(0, 6) || []);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const phone = settings?.phone || '+91 8072300191';
  const whatsapp = settings?.whatsapp || '+918072300191';
  const address = settings?.address || 'Siva electronics, north car street, Wava complex, tiruchendur 628215';

  // Curated Review listings
  const reviews = [
    { name: 'Prathap', role: 'Google Review', rating: 5, comment: 'Best service center in Tiruchendur.' },
    { name: 'Vetrivel D', role: 'Google Review', rating: 5, comment: 'Good service 👍 value for money.' },
    { name: 'Alaguselvi Alagu', role: 'Google Review', rating: 5, comment: 'Low price and best service.' },
    { name: 'rama lakshmi', role: 'Google Review', rating: 5, comment: 'Best service.' },
    { name: 'Thangam Thangam', role: 'Google Review', rating: 5, comment: 'Quick service and low price charges.' },
    { name: 'Suresh Reporter', role: 'Google Review', rating: 5, comment: 'Best service.' },
    { name: 'PRATHAP FF', role: 'Google Review', rating: 5, comment: 'Value for money 👍🏻' },
    { name: 'Manoj', role: 'Google Review', rating: 5, comment: 'Best quality ❤️' },
    { name: 'Chinnaraja Pandian', role: 'Google Review', rating: 5, comment: 'Best service and low price.' },
    { name: 'Revathi S X- B', role: 'Google Review', rating: 5, comment: 'Quick service.' }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. Large Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-left max-w-2xl">

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Siva Electronics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium italic"
          >
            "Your Trusted Sales & Service Center"
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-650 dark:text-slate-350 leading-relaxed"
          >
            Expert Smart TV sales, professional diagnostic repairs, home services, and original spare parts. Specializing in custom-assembled high-end LED TVs tailored for your budget.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2.5 bg-primary hover:bg-primary-hover text-white px-7 py-4 rounded-full text-sm font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 {phone.replace(/[^0-9]/g, '').slice(-10)}</span>
            </a>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-green-600 hover:bg-green-700 text-white px-7 py-4 rounded-full text-sm font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </motion.div>
        </div>

        {/* Hero Banner Image Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          {/* Custom SVG/Visual representation of premium TV screen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-primary/40 flex flex-col items-center justify-center p-6 text-center">
            <Tv className="w-20 h-20 text-white/90 mb-4 animate-pulse" />
            <span className="text-2xl font-bold text-white tracking-wide">SMART LED TV</span>
            <span className="text-xs text-slate-300 uppercase tracking-widest mt-1">Ultra HD 4K Sales & Assembly</span>
            
            {/* Custom Assembly Badge */}
            <div className="absolute bottom-6 bg-accent text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Custom Assembly Available
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Business Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="premium-card p-8 text-left space-y-4">
          <div className="h-12 w-12 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Genuine TV Parts Only</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We source original motherboards, backlight LED strips, and display panels directly from manufacturers to guarantee device longevity.
          </p>
        </div>

        <div className="premium-card p-8 text-left space-y-4">
          <div className="h-12 w-12 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">LED TV Home Installation</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Our expert technicians carry out home diagnosis, wall-mounting setups, and repairs right in front of your eyes for maximum transparency.
          </p>
        </div>

        <div className="premium-card p-8 text-left space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="h-12 w-12 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light flex items-center justify-center rounded-2xl">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Custom Assembly TV</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Order smart LED TVs custom-assembled with high-grade IPS display panels and Android motherboards to fit custom requirements and budgets.
          </p>
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex justify-center text-primary dark:text-primary-light">
              <Award className="w-8 h-8" />
            </div>
            <p className="text-3xl font-extrabold text-slate-950 dark:text-white">25+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Experience</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-center text-primary">
              <Tv className="w-8 h-8" />
            </div>
            <p className="text-3xl font-extrabold text-slate-950 dark:text-white">5,000+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">TVs Repaired</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center text-primary">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-3xl font-extrabold text-slate-950 dark:text-white">4,200+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Happy Clients</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center text-primary">
              <Wrench className="w-8 h-8" />
            </div>
            <p className="text-3xl font-extrabold text-slate-950 dark:text-white">100%</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Satisfaction</p>
          </div>
        </div>
      </section>

      {/* 4. Featured Products (TVs) */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Featured Smart & LED TVs</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Discover our best-selling smart TVs and custom assemblies.</p>
          </div>
          <Link to="/products" className="group text-sm font-bold text-primary dark:text-primary-light flex items-center gap-1 hover:underline">
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton /><Skeleton /><Skeleton /><Skeleton />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="premium-card flex flex-col overflow-hidden text-left bg-white dark:bg-card-dark">
                {/* Image */}
                <div className="aspect-video w-full relative bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
                  {prod.image_url || prod.product_images?.[0]?.image_url ? (
                    <img 
                      src={prod.image_url || prod.product_images[0].image_url} 
                      alt={prod.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-450 dark:text-slate-600">
                      <Tv className="w-12 h-12" />
                    </div>
                  )}
                  {prod.is_featured && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                      Popular
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary dark:text-primary-light uppercase tracking-widest">
                      {prod.brand?.name || 'Smart TV'}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-extrabold text-base text-slate-950 dark:text-white">
                      ₹{parseFloat(prod.price).toLocaleString('en-IN')}
                    </span>
                    <Link
                      to="/products"
                      className="text-xs font-bold text-primary hover:text-primary-hover dark:text-primary-light dark:hover:text-white flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <Tv className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-slate-650 dark:text-slate-350 font-bold mb-1">Products Coming Soon</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Our stock is currently being updated. Contact us directly to place orders.</p>
          </div>
        )}
      </section>

      {/* 5. Featured Spare Parts */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Original Spare Parts</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Genuine components for repair shops and DIY diagnostics.</p>
          </div>
          <Link to="/spare-parts" className="group text-sm font-bold text-primary dark:text-primary-light flex items-center gap-1 hover:underline">
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Skeleton /><Skeleton /><Skeleton />
          </div>
        ) : featuredParts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featuredParts.map((part) => (
              <div key={part.id} className="premium-card p-5 bg-white dark:bg-card-dark text-left flex gap-4 items-center">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-450 dark:text-slate-600">
                  {part.image_url ? (
                    <img src={part.image_url} alt={part.name} className="w-full h-full object-cover" />
                  ) : (
                    <Wrench className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-grow space-y-1">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest">
                    {part.brand?.name || 'Original Part'}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{part.name}</h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-extrabold text-xs text-slate-950 dark:text-white">
                      ₹{parseFloat(part.price).toLocaleString('en-IN')}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      part.stock_qty > 0 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                    }`}>
                      {part.stock_qty > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <Wrench className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-slate-650 dark:text-slate-350 font-bold mb-1">Spare Parts Coming Soon</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Genuine spare parts catalogs are being indexed.</p>
          </div>
        )}
      </section>

      {/* 6. Customer Reviews Grid */}
      <section className="space-y-8 bg-slate-100/50 dark:bg-slate-900/30 py-12 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 px-6 sm:px-12 text-center transition-all">
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-sm text-slate-500 dark:text-slate-450">Real reviews from our retail shop and repair service visits.</p>
        </div>

        <div className="space-y-6 overflow-hidden w-full relative py-4">
          {/* Gradient Overlays for a premium fading effect on the edges */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-bg-light dark:from-bg-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-bg-light dark:from-bg-dark to-transparent z-10 pointer-events-none" />

          {/* Row 1: Right to Left */}
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee flex gap-6 pr-6">
              {[...reviews.slice(0, 5), ...reviews.slice(0, 5)].map((rev, index) => (
                <div key={index} className="w-[280px] sm:w-[340px] flex-shrink-0 bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between space-y-4 whitespace-normal">
                  <div className="space-y-2">
                    {/* Rating stars */}
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-xs italic text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center font-bold text-xs">
                      {rev.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{rev.name}</span>
                      <span className="text-[10px] text-slate-400">{rev.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee-reverse flex gap-6 pr-6">
              {[...reviews.slice(5, 10), ...reviews.slice(5, 10)].map((rev, index) => (
                <div key={index} className="w-[280px] sm:w-[340px] flex-shrink-0 bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between space-y-4 whitespace-normal">
                  <div className="space-y-2">
                    {/* Rating stars */}
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-xs italic text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center font-bold text-xs">
                      {rev.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{rev.name}</span>
                      <span className="text-[10px] text-slate-400">{rev.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Quick Business Highlights Gallery Preview */}
      {galleryItems.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="text-left space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Latest Shop Gallery</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Glimpses of our workshop repair center and wall mounts.</p>
            </div>
            <Link to="/gallery" className="group text-sm font-bold text-primary dark:text-primary-light flex items-center gap-1 hover:underline">
              <span>View Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-850">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Call To Action Footer Banner */}
      <section className="relative overflow-hidden bg-primary text-slate-950 rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-primary-light/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 to-primary-hover/20" />
        <div className="relative max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">Need TV Repairs?</h2>
          <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium">
            Experiencing display issues, dark screens, double images, or motherboard failure? Get in touch for an instant estimate.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2.5 bg-slate-950 text-white hover:bg-slate-850 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Technician</span>
            </a>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-green-700 hover:bg-green-800 text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
