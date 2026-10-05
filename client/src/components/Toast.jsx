import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext } from '../context/ToastContext';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function ToastItem({ toast, onClose }) {
  const { message, type } = toast;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900',
    warning: 'border-amber-200 dark:border-amber-800/80 bg-white dark:bg-slate-900',
    error: 'border-red-200 dark:border-red-800/80 bg-white dark:bg-slate-900',
    info: 'border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-900',
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-slideUp text-xs ${borders[type] || borders.info}`}
    >
      <div className="flex items-center gap-2.5">
        {icons[type] || icons.info}
        <span className="font-medium text-slate-800 dark:text-slate-200">{message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ToastProvider;
