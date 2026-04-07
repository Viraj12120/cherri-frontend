import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowRight, 
  CreditCard, 
  Sparkles, 
  Zap, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { PATHS } from '../../routes/paths';

/**
 * TrialExpiredOverlay
 * 
 * A premium, non-dismissible overlay that blocks access to the dashboard
 * when the 14-day free trial has expired.
 */
const TrialExpiredOverlay = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams();

  const handleUpgrade = () => {
    navigate(PATHS.billing(tenantId));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-void/80 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="max-w-2xl w-full mx-6 relative">
        
        {/* Animated Background Glows */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-acid/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="bg-[#111113] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl overflow-hidden relative">
          
          {/* Top Pattern */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-acid/50 to-transparent" />
          
          <div className="flex flex-col items-center text-center">
            
            {/* Icon Group */}
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-acid/10 rounded-3xl flex items-center justify-center border border-acid/20 animate-bounce-slow">
                <AlertTriangle className="text-acid" size={40} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-void border border-white/10 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="text-acid" size={14} />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Your Free Trial has <span className="text-acid">Expired</span>
            </h1>
            
            <p className="text-white/50 text-lg mb-10 max-w-md leading-relaxed">
              Your 14-day premium access has come to an end. 
              To continue managing your pharmacy with Cherri+ AI, please choose a subscription plan.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10">
              {[
                { icon: Zap, label: 'AI Orders' },
                { icon: ShieldCheck, label: 'Full Security' },
                { icon: Building2, label: 'Multi-Store' },
                { icon: CreditCard, label: 'Analytics' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 group hover:bg-white/10 transition-colors">
                  <item.icon size={20} className="text-white/40 group-hover:text-acid transition-colors" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleUpgrade}
              className="group relative w-full md:w-auto px-10 py-5 bg-acid text-void font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(232,245,50,0.2)]"
            >
              <CreditCard size={20} />
              <span>UPGRADE NOW</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="mt-8 text-[11px] text-white/20 font-medium tracking-wide flex items-center gap-2">
              <ShieldCheck size={12} /> SECURE RAZORPAY CHECKOUT
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center mt-6 text-white/20 text-xs italic">
          "Don't let your pharmacy operations slow down. Re-activate in seconds."
        </p>
      </div>
    </div>
  );
};

export default TrialExpiredOverlay;
