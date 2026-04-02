import React from 'react';
import { PlayCircle, RefreshCw, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeatureIntro = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-navy py-24 px-6 md:px-12 lg:px-20 reveal-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1200px] mx-auto">
        {/* Left Text */}
        <div className="flex flex-col gap-8">
          <div className="reveal-child">
            <span className="bg-white/5 text-white/40 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10 shadow-sm inline-flex">
              {t('feature_intro.badge')}
            </span>
          </div>

          <h2 className="reveal-child text-white font-medium leading-tight text-[clamp(28px,3.5vw,48px)] tracking-tight">
            {t('feature_intro.title_pt1')}<br />
            <span className="text-acid">{t('feature_intro.title_pt2')}</span>
          </h2>

          <p className="reveal-child text-white/55 text-[16px] leading-[1.75] max-w-[480px] font-light">
            {t('feature_intro.desc')}
          </p>

          <div className="flex flex-col gap-8 mt-4">
            {[
              {
                Icon: PlayCircle,
                title: t('feature_intro.f1_title'),
                body: t('feature_intro.f1_desc')
              },
              {
                Icon: RefreshCw,
                title: t('feature_intro.f2_title'),
                body: t('feature_intro.f2_desc')
              },
              {
                Icon: Heart,
                title: t('feature_intro.f3_title'),
                body: t('feature_intro.f3_desc')
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 reveal-child group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-white/40 group-hover:text-acid group-hover:border-acid/30 transition-all">
                  <item.Icon size={18} strokeWidth={2} />
                </div>
                <div className="pt-1">
                  <h4 className="text-white font-medium text-[15px] mb-1.5">{item.title}</h4>
                  <p className="text-white/40 text-[13px] leading-relaxed max-w-[320px] font-light">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Phone Mockup */}
        <div className="flex justify-center lg:justify-end reveal-child phone-mockup">
          <div className="w-[300px] h-[600px] bg-void border-[8px] border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-8">
            <div className="flex items-center gap-2 px-6 mb-8">
              <span className="text-acid text-xs">●</span>
              <span className="text-sm font-bold tracking-tight">Cherri+</span>
            </div>

            <div className="px-5 mb-8">
              <div className="h-10 bg-white/5 border border-white/10 rounded-full flex items-center px-4 gap-3 text-white/30 text-xs">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                Search drug or branch...
              </div>
            </div>

            <div className="flex gap-3 px-5 mb-8">
              <div className="h-8 px-4 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-[10px] text-white/60">
                Category ▾
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-acid/20 border border-void flex items-center justify-center text-acid text-[10px]">P</div>
                <div className="w-8 h-8 rounded-full bg-coral/20 border border-void flex items-center justify-center text-coral text-[10px]">A</div>
                <div className="w-8 h-8 rounded-full bg-white/10 border border-void flex items-center justify-center text-white text-[10px]">+</div>
              </div>
            </div>

            <div className="flex-1 px-5 space-y-4 overflow-hidden">
              {[
                { name: 'Metformin 500mg', role: 'Stock: 12 units · Branch 4, Pune', status: 'CRITICAL', color: 'text-danger bg-danger/10 border-danger/20' },
                { name: 'Insulin Glargine 100IU', role: 'Stock: 45 units · Mumbai Hub', status: 'LOW', color: 'text-warn bg-warn/10 border-warn/20' },
                { name: 'Amoxicillin 500mg', role: 'Stock: 320 units · All branches', status: 'OK', color: 'text-success bg-success/10 border-success/20' }
              ].map((person, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-xs">💊</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-white/90">{person.name}</div>
                    <div className="text-[11px] text-white/40">{person.role}</div>
                  </div>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${person.color} flex items-center gap-1`}>
                    <span className="text-[6px]">●</span> {person.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureIntro;
