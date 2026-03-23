import React from 'react';
import { useTranslation } from 'react-i18next';

const Outcomes = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-navy py-24 px-6 md:px-12 lg:px-20 reveal-section">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16 items-start">
        {/* Left Stats */}
        <div className="flex flex-col gap-8">
          <div className="reveal-child">
            <span className="bg-white/5 text-white/50 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border border-white/10 uppercase inline-flex">
              {t('outcomes.badge')}
            </span>
          </div>
          
          <h2 className="reveal-child text-white font-medium leading-[1.15] text-[clamp(32px,4vw,56px)] max-w-[500px]">
            {t('outcomes.title_pt1')}<br />
            <span className="text-acid">{t('outcomes.title_pt2')}</span>
          </h2>
          
          <p className="reveal-child text-white/40 text-[14px] leading-relaxed max-w-[480px]">
            {t('outcomes.desc')}
          </p>

          <div className="flex flex-col gap-10 mt-6">
            <div className="reveal-child">
              <h3 className="text-white font-bold text-[clamp(48px,6vw,80px)] font-sans leading-none stat-revenue tracking-tight">{t('outcomes.stat1')}</h3>
              <p className="text-white/50 text-[16px] mt-2 font-medium">{t('outcomes.stat1_desc')}</p>
              <p className="text-white/30 text-[12px] italic mt-1">{t('outcomes.stat1_sub')}</p>
            </div>
            
            <div className="w-full h-px bg-white/5" />
            
            <div className="reveal-child">
              <h3 className="text-white font-bold text-[clamp(48px,6vw,80px)] font-sans leading-none stat-revenue-pct tracking-tight">{t('outcomes.stat2')}</h3>
              <p className="text-white/50 text-[16px] mt-2 font-medium">{t('outcomes.stat2_desc')}</p>
              <p className="text-white/30 text-[12px] italic mt-1">{t('outcomes.stat2_sub')}</p>
            </div>
            
            <div className="reveal-child flex gap-4 md:gap-8 justify-between mt-4">
               <div>
                  <h4 className="text-acid text-xl font-bold metric-strip-number">{t('outcomes.m1_val')}</h4>
                  <p className="text-white/50 text-[10px] leading-snug mt-1 max-w-[80px]">{t('outcomes.m1_lbl')}</p>
               </div>
               <div>
                  <h4 className="text-acid text-xl font-bold metric-strip-number">{t('outcomes.m2_val')}</h4>
                  <p className="text-white/50 text-[10px] leading-snug mt-1 max-w-[80px]">{t('outcomes.m2_lbl')}</p>
               </div>
               <div>
                  <h4 className="text-acid text-xl font-bold metric-strip-number">{t('outcomes.m3_val')}</h4>
                  <p className="text-white/50 text-[10px] leading-snug mt-1 max-w-[80px]">{t('outcomes.m3_lbl')}</p>
               </div>
               <div>
                  <h4 className="text-acid text-xl font-bold metric-strip-number">{t('outcomes.m4_val')}</h4>
                  <p className="text-white/50 text-[10px] leading-snug mt-1 max-w-[80px]">{t('outcomes.m4_lbl')}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Testimonials */}
        <div className="space-y-6">
          {[
            {
              quote: t('outcomes.t1_q'),
              author: t('outcomes.t1_a'),
              title: t('outcomes.t1_d'),
              avatar: "RS"
            },
            {
              quote: t('outcomes.t2_q'),
              author: t('outcomes.t2_a'),
              title: t('outcomes.t2_d'),
              avatar: "MJ"
            }
          ].map((item, i) => (
            <div key={i} className="reveal-child testimonial-card bg-white/[0.04] border border-white/[0.08] p-10 rounded-xl relative group hover:border-white/[0.18] hover:-translate-y-[2px] transition-all duration-300">
              <span className="text-acid text-[36px] font-serif absolute top-6 left-6 scale-75 group-hover:scale-100 transition-transform duration-300">❝</span>
              <p className="text-white text-[15px] leading-[1.7] mb-8 pl-4">
                {item.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-white/5 text-white text-sm font-bold">
                   {item.avatar}
                </div>
                <div>
                   <h5 className="text-white font-bold text-[14px]">{item.author}</h5>
                   <p className="text-white/40 text-[13px]">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Outcomes;
