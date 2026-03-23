import React from 'react';
import { useTranslation } from 'react-i18next';

const FinalCTA = () => {
  const { t } = useTranslation();
  return (
    <section className="px-6 md:px-12 lg:px-20 py-24 bg-void reveal-section relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-acid/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center relative z-10 pb-16 border-b border-white/10">
        <span className="text-acid text-[11px] font-bold tracking-widest uppercase mb-6 bg-acid/10 px-3 py-1.5 rounded-full border border-acid/20">
          {t('final_cta.badge')}
        </span>
        
        <h2 className="text-white font-medium leading-[1.15] text-[clamp(32px,4vw,56px)] max-w-[700px] mb-6">
          {t('final_cta.title_pt1')} <span className="text-acid">{t('final_cta.title_pt2')}</span>
        </h2>
        
        <p className="text-white/50 text-[16px] leading-relaxed max-w-[500px] mb-10 font-light">
          {t('final_cta.desc')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full sm:w-auto">
          <button className="h-12 bg-acid text-void font-bold text-sm px-8 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_14px_rgba(232,245,50,0.3)] w-full sm:w-auto">
            {t('final_cta.btn1')}
          </button>
          <button className="h-12 bg-transparent text-white border border-white/20 font-medium text-sm px-8 rounded-full hover:bg-white/5 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            {t('final_cta.btn2')}
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
           <div className="flex items-center gap-2 text-white/40 text-[11px]">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
             {t('final_cta.trust1')}
           </div>
           
           <div className="text-acid/70 text-[11px] font-medium bg-acid/5 px-2 py-1 rounded">
             {t('final_cta.trust2')}
           </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
