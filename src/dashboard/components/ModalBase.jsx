import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ onClose, children, maxW = 'max-w-2xl' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={onClose}>
    <div className={`bg-[#0f0f11] border border-white/10 rounded-2xl w-full ${maxW} shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export const ModalHeader = ({ icon: Icon, title, subtitle, onClose, accent = 'text-white' }) => (
  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {Icon && <Icon size={18} className={accent} />}
      <div>
        <p className="font-bold text-sm text-white">{title}</p>
        {subtitle && <p className="text-[10px] text-white/30 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
      <X size={16} />
    </button>
  </div>
);
