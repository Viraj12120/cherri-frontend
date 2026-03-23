import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, MessageSquare, ToggleRight, BellRing, Settings, RefreshCw, FileText, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeatureGrid = () => {
  const { t } = useTranslation();
  const [aiEnabled, setAiEnabled] = useState(true);
  const [trackerStep, setTrackerStep] = useState(3);
  const [isTrackerHovered, setIsTrackerHovered] = useState(false);

  useEffect(() => {
    if (isTrackerHovered) return;
    const interval = setInterval(() => {
      setTrackerStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [isTrackerHovered]);
  return (
    <section className="bg-dark py-24 px-6 md:px-12 lg:px-20 reveal-section">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center mb-16">
        <div className="reveal-child mb-6">
          <span className="text-acid/80 text-[10px] font-bold tracking-widest uppercase">
            {t('feature_grid.badge')}
          </span>
        </div>

        <h2 className="reveal-child text-center text-white font-medium leading-tight text-[clamp(28px,3vw,40px)] max-w-[600px] mb-6">
          {t('feature_grid.title_pt1')}<br />
          <span className="text-acid">{t('feature_grid.title_pt2')}</span>
        </h2>

        <p className="reveal-child text-center text-white/50 text-[16px] leading-relaxed max-w-[560px] font-light">
          {t('feature_grid.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-[1000px] mx-auto">
        {/* Card A: Lead Routing (Wide 6/12) */}
        <div className="md:col-span-6 lg:col-span-6 bg-white/5 border border-white/10 rounded-[24px] p-8 flex flex-col gap-4 reveal-child group hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
          <h4 className="text-white font-medium text-lg group-hover:text-acid transition-colors duration-300">{t('feature_grid.c1_title')}</h4>
          <p className="text-white/40 text-[14px] leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
            {t('feature_grid.c1_desc')}
          </p>
          <div className="mt-auto pt-6">
            <div className="bg-dark/50 border border-white/5 rounded-full p-2 flex items-center justify-between group-hover:border-acid/30 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-acid/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></div>
              <div className="relative z-10 flex items-center gap-3 px-3 text-white/30 text-xs">
                <Search size={14} className="group-hover:text-acid transition-colors duration-300" />
                📦 Enter drug or category...
              </div>
              <div className="relative z-10 bg-white/10 group-hover:bg-acid group-hover:text-void transition-colors duration-300 rounded-full px-4 py-1.5 text-xs font-semibold text-white">Run Forecast →</div>
            </div>
          </div>
        </div>

        {/* Card B: Email Tracking (Wide 6/12) */}
        <div className="md:col-span-6 lg:col-span-6 bg-white/5 border border-white/10 rounded-[24px] p-8 flex flex-col gap-4 reveal-child group hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
          <h4 className="text-white font-medium text-lg group-hover:text-acid transition-colors duration-300">{t('feature_grid.c2_title')}</h4>
          <p className="text-white/40 text-[14px] leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
            {t('feature_grid.c2_desc')}
          </p>
          <div className="mt-auto pt-6 flex justify-center h-24 items-end pb-4 transition-all duration-500">
            <div className="w-16 h-16 rounded-2xl bg-acid/20 border border-acid/50 flex items-center justify-center text-acid group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-[0_0_20px_rgba(232,245,50,0.2)]">
              <RefreshCw size={28} className="group-hover:animate-spin" />
            </div>
          </div>
        </div>

        {/* Card C: Expiry Tracking (Narrow 4/12) */}
        <div
          className="md:col-span-2 lg:col-span-4 bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-3 reveal-child items-center text-center group hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
          onMouseEnter={() => setIsTrackerHovered(true)}
          onMouseLeave={() => setIsTrackerHovered(false)}
        >
          <h4 className="text-white font-medium text-[15px] leading-[1.3] group-hover:text-acid transition-colors duration-300">{t('feature_grid.c3_title')}</h4>
          <p className="text-white/40 text-[12px] leading-[1.6] font-light group-hover:text-white/60 transition-colors duration-300">
            {t('feature_grid.c3_desc')}
          </p>
          <div className="mt-auto w-full pt-4 space-y-2 relative group/slider">
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={trackerStep}
              onChange={(e) => setTrackerStep(parseInt(e.target.value))}
              className="absolute top-[20px] left-0 w-full h-8 opacity-0 z-20 cursor-grab active:cursor-grabbing"
            />
            <div className="h-1 bg-white/20 w-full absolute top-[28px] z-0 left-0 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-acid via-acid to-danger transition-all duration-500 ease-out"
                style={{ width: `${(trackerStep / 3) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between relative z-10 w-full pointer-events-none items-center mt-0.5">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full ring-2 ring-dark transition-all duration-500 ${trackerStep >= step
                      ? (step === 3 ? 'bg-danger' : 'bg-acid')
                      : 'bg-white/20'
                    } ${trackerStep === step ? 'scale-150 shadow-[0_0_10px_rgba(232,245,50,0.5)]' : ''} ${trackerStep === 3 && step === 3 ? 'scale-150 shadow-[0_0_10px_rgba(255,80,97,0.5)]' : ''}`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] px-1 pt-1 pointer-events-none w-full">
              <span className={`transition-colors duration-500 ${trackerStep >= 0 ? 'text-white' : 'text-white/30'}`}>Ordered</span>
              <span className={`transition-colors duration-500 ${trackerStep >= 1 ? 'text-white' : 'text-white/30'}`}>Received</span>
              <span className={`transition-colors duration-500 ${trackerStep >= 2 ? 'text-white' : 'text-white/30'}`}>Active</span>
              <span className={`transition-colors duration-500 ${trackerStep >= 3 ? 'text-danger font-bold' : 'text-white/30'}`}>Expiring</span>
            </div>
          </div>
        </div>

        {/* Card D: Pipeline Stage (Narrow 4/12) */}
        <div className="md:col-span-2 lg:col-span-4 bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-3 reveal-child group hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
          <h4 className="text-white font-medium text-[15px] leading-[1.3] group-hover:text-acid transition-colors duration-300">{t('feature_grid.c4_title')}</h4>
          <p className="text-white/40 text-[12px] leading-[1.6] font-light group-hover:text-white/60 transition-colors duration-300">
            {t('feature_grid.c4_desc')}
          </p>
          <div className="mt-auto flex justify-center pt-6 pb-2">
            <div className="flex -space-x-4 group-hover:-space-x-1 transition-all duration-500 ease-in-out">
              <div className="w-10 h-10 rounded-full bg-acid/20 border-2 border-void flex items-center justify-center text-acid text-xs font-bold transition-transform duration-500 z-0">B4</div>
              <div className="w-10 h-10 rounded-full bg-coral/20 border-2 border-void flex items-center justify-center text-coral text-xs font-bold transition-transform duration-500 z-10">MH</div>
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-void flex items-center justify-center text-white text-xs font-bold transition-transform duration-500 z-20">NG</div>
              <div className="w-10 h-10 rounded-full bg-dark border-2 border-void flex items-center justify-center text-white/50 text-[10px] font-bold transition-transform duration-500 z-30">+14</div>
            </div>
          </div>
        </div>

        {/* Card E: Chat with AI (Narrow 4/12) */}
        <div className="md:col-span-2 lg:col-span-4 bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-3 reveal-child justify-between group hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-white font-medium text-[15px] leading-[1.3] group-hover:text-acid transition-colors duration-300">{t('feature_grid.c5_title')}</h4>
            <p className="text-white/40 text-[12px] leading-[1.6] font-light mt-2 group-hover:text-white/60 transition-colors duration-300">
              {t('feature_grid.c5_desc')}
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4 relative z-10">
            <div className="bg-white/10 text-white/80 p-2 rounded-lg rounded-tl-sm text-[10px] w-fit max-w-[80%] self-start group-hover:-translate-y-1 transition-transform duration-300">{t('feature_grid.c5_q')}</div>
            <div className="bg-acid text-void font-medium p-2 rounded-lg rounded-tr-sm text-[10px] w-fit max-w-[80%] self-end group-hover:-translate-y-1 transition-transform duration-300 delay-75">{t('feature_grid.c5_a')}</div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-acid/10 rounded-full blur-xl group-hover:bg-acid/20 transition-colors duration-500 opacity-0 group-hover:opacity-100"></div>
        </div>

        {/* Card F: Auto-replenishment (Narrow 3/12 instead of 6 to fit) */}
        <div className="md:col-span-6 lg:col-span-6 bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-3 reveal-child group hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
          <h4 className="text-white font-medium text-[15px] leading-[1.3] group-hover:text-acid transition-colors duration-300">{t('feature_grid.c6_title')}</h4>
          <p className="text-white/40 text-[12px] leading-[1.5] font-light group-hover:text-white/60 transition-colors duration-300">
            {t('feature_grid.c6_desc')}
          </p>
          <div
            className="mt-auto flex items-center justify-center gap-4 bg-dark/50 p-3 rounded-full border border-white/5 group-hover:border-acid/30 transition-colors duration-300 cursor-pointer"
            onClick={() => setAiEnabled(!aiEnabled)}
          >
            <span className={`text-[10px] transition-colors ${!aiEnabled ? 'font-bold text-white' : 'text-white/40 group-hover:text-white/60'}`}>Manual ordering</span>
            <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors duration-300 relative ${aiEnabled ? 'bg-acid' : 'bg-white/10'}`}>
              <div className={`w-3 h-3 rounded-full absolute transition-all duration-300 ${aiEnabled ? 'left-[22px] bg-void' : 'left-1 bg-white/50'}`}></div>
            </div>
            <span className={`text-[10px] transition-transform ${aiEnabled ? 'font-bold text-acid group-hover:scale-105' : 'text-white/40 group-hover:text-white/60'}`}>AI-Managed</span>
          </div>
        </div>



        {/* Card H: Push Notifications (Narrow 3/12 converted to wide or whatever fits) */}
        <div className="md:col-span-12 lg:col-span-6 bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 reveal-child group hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
          <div className="flex flex-col gap-4 relative z-10">
            <div>
              <h4 className="text-white font-medium text-[15px] leading-[1.3] group-hover:text-acid transition-colors duration-300">{t('feature_grid.c7_title')}</h4>
              <p className="text-white/40 text-[12px] leading-[1.6] font-light mt-1 group-hover:text-white/60 transition-colors duration-300">
                {t('feature_grid.c7_desc')}
              </p>
            </div>
            <div className="flex gap-2 relative mt-auto">
              <div className="bg-dark/80 border border-white/10 rounded-lg p-3 group-hover:border-acid/30 transition-colors duration-500 group-hover:-translate-y-1 relative shadow-lg z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-2 bg-danger rounded-full animate-pulse shadow-[0_0_10px_rgba(255,80,97,0.8)]" />
                  <div className="text-[8px] text-white">Critical stock — Branch 4, Pune</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-2 bg-warn rounded-full animate-pulse" />
                  <div className="text-[8px] text-white">Redistribution suggested — Nashik WH</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-2 bg-success rounded-full animate-pulse" />
                  <div className="text-[8px] text-white">PO #4892 approved — Metformin</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-coral/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          {/* Decorative Shape Bottom Right */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-gradient-to-br from-acid/10 to-transparent rounded-[40px] rotate-12 blur-2xl group-hover:blur-xl group-hover:bg-acid/20 transition-all duration-700 pointer-events-none z-0"></div>
          <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-0">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="text-acid rotate-45 group-hover:rotate-90 transition-transform duration-1000 ease-out">
              <rect x="20" y="20" width="60" height="60" rx="16" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};



export default FeatureGrid;
