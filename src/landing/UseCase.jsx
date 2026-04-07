import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const UseCase = () => {
  const { t } = useTranslation();

  const USE_CASE_DATA = [
    {
      id: 'pharmacist',
      label: t('use_case.lbl_pharmacist'),
      pain: t('use_case.pain_pharmacist'),
      how: t('use_case.how_pharmacist'),
      outcomes: [
        t('use_case.o1_pharmacist'),
        t('use_case.o2_pharmacist'),
        t('use_case.o3_pharmacist'),
        t('use_case.o4_pharmacist')
      ]
    },
    {
      id: 'distributor',
      label: t('use_case.lbl_distributor'),
      pain: t('use_case.pain_distributor'),
      how: t('use_case.how_distributor'),
      outcomes: [
        t('use_case.o1_distributor'),
        t('use_case.o2_distributor'),
        t('use_case.o3_distributor'),
        t('use_case.o4_distributor')
      ]
    },
    {
      id: 'scm',
      label: t('use_case.lbl_scm'),
      pain: t('use_case.pain_scm'),
      how: t('use_case.how_scm'),
      outcomes: [
        t('use_case.o1_scm'),
        t('use_case.o2_scm'),
        t('use_case.o3_scm'),
        t('use_case.o4_scm')
      ]
    },
    {
      id: 'executive',
      label: t('use_case.lbl_executive'),
      pain: t('use_case.pain_executive'),
      how: t('use_case.how_executive'),
      outcomes: [
        t('use_case.o1_executive'),
        t('use_case.o2_executive'),
        t('use_case.o3_executive'),
        t('use_case.o4_executive')
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(USE_CASE_DATA[0].id);

  const activeContent = USE_CASE_DATA.find(t => t.id === activeTab);

  return (
    <section className="bg-void py-24 px-6 md:px-12 lg:px-20 reveal-section">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-20 items-start">
        {/* Left: Phone Mockup */}
        <div className="flex justify-center lg:justify-start pt-12">
          <div className="w-[300px] h-[600px] bg-void border-[8px] border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col pt-8 use-case-phone">
            <div className="flex items-center gap-2 px-6 mb-8">
              <span className="text-acid text-xs">●</span>
              <span className="text-xs font-bold font-mono">Cherri+</span>
            </div>

            <div className="px-6 mb-8">
              <div className="h-9 bg-white/5 border border-white/12 rounded-lg flex items-center px-4 gap-2">
                <span className="text-white/20 text-xs">🔍</span>
                <div className="text-white/30 text-xs font-light">Search anything...</div>
              </div>
            </div>

            <div className="flex gap-2 px-6 mb-8">
              <div className="h-6 px-3 bg-white/5 border border-white/10 rounded-full flex items-center text-[10px] text-white/50">Category ▾</div>
              <div className="h-6 w-6 border-2 border-white/30 rounded-full"></div>
            </div>

            <div className="flex-1 px-5 space-y-4">
              {[
                { name: 'Paracetamol 500mg', role: 'Fast Restock Needed', status: 'CRITICAL', color: 'text-danger bg-danger/10 border-danger/20' },
                { name: 'Insulin 100IU', role: 'Expiry Alert — 14 days left', status: 'EXPIRING', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-3 group hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-medium px-2 py-0.5 rounded-full border ${item.color} flex items-center gap-1`}>
                      <span className="text-[6px]">●</span> {item.status}
                    </span>
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-white/90 mb-0.5">{item.name}</div>
                    <div className="text-[11px] text-white/40">{item.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="use-case-text flex flex-col gap-8">
          <div>
            <span className="bg-white/5 text-white/40 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10 shadow-sm inline-flex">
              {t('use_case.badge')}
            </span>
          </div>

          <h2 className="text-white font-medium leading-tight text-[clamp(28px,3.5vw,48px)]">
            {t('use_case.title_pt1')}<br /><span className="text-acid">{t('use_case.title_pt2')}</span>
          </h2>

          <p className="text-white/55 text-[16px] leading-[1.7] max-w-[500px] font-light">
            {t('use_case.desc')}
          </p>

          <div className="mt-4">
            {/* Tabs Header */}
            <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto pb-1 no-scrollbar">
              {USE_CASE_DATA.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 px-1 whitespace-nowrap text-[13px] font-medium transition-all duration-250 ${activeTab === tab.id
                    ? 'text-white border-b-2 border-acid'
                    : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px] transition-all duration-250 ease-in-out">
              <div key={activeContent.id} className="animate-[fade-in_0.3s_ease-out]">
                <div className="bg-white/5 border border-white/10 p-5 rounded-xl mb-6 relative">
                  <span className="absolute -top-3 left-4 bg-void px-2 text-[10px] text-acid font-medium uppercase tracking-wider">Pain</span>
                  <p className="text-white/70 text-[14px] italic leading-relaxed">"{activeContent.pain}"</p>
                </div>

                <h4 className="text-white text-sm font-medium mb-2">How Cherri+ Solves It:</h4>
                <p className="text-white/55 text-[14px] leading-relaxed mb-6 font-light">{activeContent.how}</p>

                <h4 className="text-white text-sm font-medium mb-3">Outcome:</h4>
                <ul className="space-y-3">
                  {activeContent.outcomes.map((outcome, i) => (
                    <li key={i} className="flex gap-3 text-white/70 text-[14px] leading-snug">
                      <span className="text-acid/70 shrink-0">→</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-6">
            <a 
              href="mailto:developer@cherriplus.com?subject=Cherri+%20Review%20Request"
              className="h-12 w-full sm:w-auto px-8 flex items-center justify-center bg-acid border border-acid rounded-full text-sm font-bold text-void hover:bg-white hover:text-void hover:border-white transition-all duration-300 active:scale-95 shadow-[0_4px_14px_rgba(232,245,50,0.2)]"
            >
              Send Review to Developer
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCase;
