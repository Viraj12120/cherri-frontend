import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { Lock } from 'lucide-react';
import { useUiStore } from '../stores/uiStore';

/**
 * FeatureGateWrapper
 * 
 * Conditional wrapper that checks for feature access in authStore.
 * Modes:
 * - 'hide': Renders nothing if access is denied.
 * - 'blur': Renders children with a blur filter and a lock overlay.
 * - 'lock': Renders a "Locked" placeholder instead of children.
 * - 'disabled': Renders children but with pointer-events-none and grayscale.
 */
const FeatureGateWrapper = ({ 
  featureKey, 
  children, 
  fallback = null, 
  mode = 'hide',
  showUpgradeModal = true 
}) => {
  const hasAccess = useAuthStore((s) => s.features[featureKey]);
  const isDev = import.meta.env.DEV;

  // If user has access, just render children
  if (hasAccess || isDev) {
    return <>{children}</>;
  }

  // Handle different access denied modes
  if (mode === 'hide') {
    return fallback;
  }

  if (mode === 'blur') {
    return (
      <div className="relative group cursor-not-allowed">
        <div className="blur-[4px] pointer-events-none select-none opacity-50 grayscale transition-all">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-void/20 backdrop-blur-[2px] rounded-xl border border-white/5 z-10 transition-all group-hover:bg-void/40">
           <div className="p-3 bg-navy border border-white/10 rounded-full mb-3 shadow-xl">
             <Lock size={20} className="text-acid" />
           </div>
           <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Upgrade Required</p>
        </div>
      </div>
    );
  }

  if (mode === 'disabled') {
    return (
      <div className="opacity-40 grayscale pointer-events-none relative select-none">
        {children}
        <div className="absolute top-2 right-2">
            <Lock size={12} className="text-white/40" />
        </div>
      </div>
    );
  }

  if (mode === 'lock') {
    return (
      <div className="w-full h-full min-h-[100px] flex flex-col items-center justify-center p-8 bg-navy/30 border border-dashed border-white/10 rounded-2xl">
        <div className="p-4 bg-acid/10 rounded-full mb-4">
          <Lock size={24} className="text-acid" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">Feature Locked</h3>
        <p className="text-xs text-white/40 text-center mb-6 max-w-[200px]">
          Access to <strong>{featureKey.replace('_', ' ')}</strong> is not included in your current plan.
        </p>
        <button className="px-4 py-2 bg-acid text-void text-[11px] font-bold rounded-lg shadow-lg hover:scale-[1.02] transition-all">
           Upgrade to Unlock
        </button>
      </div>
    );
  }

  return fallback;
};

export default FeatureGateWrapper;
