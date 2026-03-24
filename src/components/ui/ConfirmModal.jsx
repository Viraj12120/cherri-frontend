import React, { useEffect } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

/**
 * Generic Modal for confirming destructive or critical actions.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.confirmText='Confirm']
 * @param {string} [props.cancelText='Cancel']
 * @param {boolean} [props.isDestructive=false]
 * @param {boolean} [props.isLoading=false]
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-void/80 backdrop-blur-sm" 
        onClick={() => !isLoading && onClose()}
      />
      
      <div className="relative bg-[#161618] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl p-6 overflow-hidden animate-[modalIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-danger/10 text-danger' : 'bg-acid/10 text-acid'}`}>
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="text-white/40 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDestructive
                ? 'bg-danger text-white hover:brightness-110'
                : 'bg-acid text-void hover:brightness-110'
            }`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
