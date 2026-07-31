import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            let Icon = CheckCircle;
            let bgColor = 'bg-white dark:bg-slate-800 border-green-500 text-green-600 dark:text-green-400';
            
            if (toast.type === 'error') {
              Icon = AlertCircle;
              bgColor = 'bg-white dark:bg-slate-800 border-red-500 text-red-600 dark:text-red-400';
            } else if (toast.type === 'warning') {
              Icon = AlertTriangle;
              bgColor = 'bg-white dark:bg-slate-800 border-orange-500 text-orange-600 dark:text-orange-400';
            } else if (toast.type === 'info') {
              Icon = Info;
              bgColor = 'bg-white dark:bg-slate-800 border-primary text-primary dark:text-primary-light';
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg pointer-events-auto ${bgColor}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-grow text-sm font-medium text-slate-800 dark:text-slate-100 break-words">
                  {toast.message}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
