import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';

/**
 * Toast Container — Placed once in root Layout.
 * Listens to uiStore and renders active toasts.
 */
export const ToastContainer = () => {
  const toasts = useUiStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full font-sans pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

const Toast = ({ id, type, message, duration = 5000 }) => {
  const removeToast = useUiStore((s) => s.removeToast);

  // Auto-dismiss
  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, removeToast]);

const TOAST_CONFIGS = {
    success: {
      icon: CheckCircle2,
      style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
      iconStyle: 'text-emerald-500',
    },
    error: {
      icon: XCircle,
      style: 'bg-danger/10 border-danger/20 text-danger',
      iconStyle: 'text-danger',
    },
    warning: {
      icon: AlertCircle,
      style: 'bg-warn/10 border-warn/20 text-warn',
      iconStyle: 'text-warn',
    },
    info: {
      icon: Info,
      style: 'bg-acid/10 border-acid/20 text-acid',
      iconStyle: 'text-acid',
    },
  };

  const config = TOAST_CONFIGS[type] || TOAST_CONFIGS.info;

  const Icon = config.icon;

  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)] pointer-events-auto ${config.style}`}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${config.iconStyle}`} />
      <div className="flex-1 text-sm font-medium pr-6">{message}</div>
      <button
        onClick={() => removeToast(id)}
        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// Requires this in index.css:
// @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
