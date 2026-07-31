import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({ 
  isOpen, 
  title = 'Are you sure?', 
  message = 'This action cannot be undone.', 
  confirmText = 'Delete', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  isDangerous = true
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-slate-900"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl z-10 text-left overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dialog Body */}
          <div className="flex gap-4">
            <div className={`h-11 w-11 rounded-full flex-shrink-0 flex items-center justify-center ${
              isDangerous 
                ? 'bg-red-550/10 text-red-500' 
                : 'bg-orange-550/10 text-orange-550'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {message}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-sm font-semibold transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`px-4 py-2 text-white font-semibold rounded-xl text-sm transition-colors ${
                    isDangerous 
                      ? 'bg-red-650 hover:bg-red-700' 
                      : 'bg-primary hover:bg-primary-hover'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
