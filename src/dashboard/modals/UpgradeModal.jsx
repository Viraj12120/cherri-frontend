import React from 'react';
import { X, Sparkles, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

/**
 * UpgradeModal
 * 
 * A standardized modal for "Feature Locked" or "Limit Reached" scenarios.
 * One-click trigger for the upgrade/payment flow.
 */
const UpgradeModal = ({ isOpen, onClose, featureName, limitReached = false }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/80 backdrop-blur-xl transition-all animate-fadeIn" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0A0C10] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.8)] animate-scaleUp">
        {/* Top Gradient Header */}
        <div className="h-40 relative bg-gradient-to-br from-acid/20 to-navy overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,245,50,0.1),transparent_70%)]" />
            <div className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white/50 hover:text-white" onClick={onClose}>
                <X size={20} />
            </div>
            
            <div className="flex flex-col items-center justify-center h-full pt-4">
                <div className="p-4 bg-acid rounded-3xl shadow-[0_4px_30px_rgba(232,245,50,0.3)] mb-4">
                    <Sparkles size={32} className="text-void" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Elevate Your Presence</h2>
            </div>
        </div>

        <div className="p-8">
            <div className="text-center mb-10">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {limitReached ? `You've reached your ${featureName} limit` : `Unlock the power of ${featureName}`}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-[300px] mx-auto">
                    Your current plan is great for starting out, but our <strong>Pro</strong> tier offers even more power.
                </p>
            </div>

            <div className="space-y-4 mb-10">
                {[
                    'Priority AI replenishment agent',
                    'Multi-location inventory sync',
                    'Real-time expiry alerts & recovery',
                    'Advanced usage forecasting'
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:border-acid/20 transition-all">
                        <div className="shrink-0 text-acid group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={18} />
                        </div>
                        <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{item}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => {
                    navigate(PATHS.pricing);
                    onClose();
                }}
                className="w-full py-4 bg-acid text-void font-black text-sm rounded-2xl shadow-[0_8px_30px_rgba(232,245,50,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-tight"
            >
                Upgrade to Pro Now
                <ArrowRight size={18} />
            </button>
            
            <button 
                onClick={onClose}
                className="w-full mt-4 py-2 text-[11px] font-bold text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
            >
                Continue with Limited Plan
            </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
