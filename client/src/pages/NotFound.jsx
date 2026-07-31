import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-6 relative">
          <Tv className="w-16 h-16" />
          <span className="absolute -bottom-1 -right-1 bg-accent text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
            404
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Use the button below to navigate back to the home page.
        </p>

        <Link
          to="/"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
