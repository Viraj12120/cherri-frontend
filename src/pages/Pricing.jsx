import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Pricing = () => {
  const { t } = useTranslation();

  const DefaultLimits = {
    free: ['Up to 50 medicines', '1 user', '1 location', 'No agent auto-orders'],
    starter: ['Up to 200 medicines', '3 users', '1 location', 'Both agents', 'NL query'],
    growth: ['Up to 1,000 medicines', '10 users', '3 locations', 'Priority support', 'CSV import', 'Reports'],
    pro: ['Unlimited medicines', 'Unlimited users', '10 locations', 'API access', 'Custom alerts', 'Dedicated onboarding'],
    enterprise: ['Custom SLA', 'Dedicated server', 'Compliance reports', 'Integration support']
  };

  const PRICING_PLANS = [
    {
      name: t('pricing_page.free.name'),
      price: t('pricing_page.free.price'),
      period: t('pricing_page.free.period'),
      limits: [
        t('pricing_page.free.l1', DefaultLimits.free[0]),
        t('pricing_page.free.l2', DefaultLimits.free[1]),
        t('pricing_page.free.l3', DefaultLimits.free[2]),
        t('pricing_page.free.l4', DefaultLimits.free[3])
      ],
      target: t('pricing_page.free.target'),
      highlight: false,
      cta: t('pricing_page.free.cta')
    },
    {
      name: t('pricing_page.starter.name'),
      price: t('pricing_page.starter.price'),
      period: t('pricing_page.starter.period'),
      limits: [
        t('pricing_page.starter.l1', DefaultLimits.starter[0]),
        t('pricing_page.starter.l2', DefaultLimits.starter[1]),
        t('pricing_page.starter.l3', DefaultLimits.starter[2]),
        t('pricing_page.starter.l4', DefaultLimits.starter[3]),
        t('pricing_page.starter.l5', DefaultLimits.starter[4])
      ],
      target: t('pricing_page.starter.target'),
      highlight: false,
      cta: t('pricing_page.starter.cta')
    },
    {
      name: t('pricing_page.growth.name'),
      price: t('pricing_page.growth.price'),
      period: t('pricing_page.growth.period'),
      limits: [
        t('pricing_page.growth.l1', DefaultLimits.growth[0]),
        t('pricing_page.growth.l2', DefaultLimits.growth[1]),
        t('pricing_page.growth.l3', DefaultLimits.growth[2]),
        t('pricing_page.growth.l4', DefaultLimits.growth[3]),
        t('pricing_page.growth.l5', DefaultLimits.growth[4]),
        t('pricing_page.growth.l6', DefaultLimits.growth[5])
      ],
      target: t('pricing_page.growth.target'),
      highlight: true, // Recommended plan
      cta: t('pricing_page.growth.cta')
    },
    {
      name: t('pricing_page.pro.name'),
      price: t('pricing_page.pro.price'),
      period: t('pricing_page.pro.period'),
      limits: [
        t('pricing_page.pro.l1', DefaultLimits.pro[0]),
        t('pricing_page.pro.l2', DefaultLimits.pro[1]),
        t('pricing_page.pro.l3', DefaultLimits.pro[2]),
        t('pricing_page.pro.l4', DefaultLimits.pro[3]),
        t('pricing_page.pro.l5', DefaultLimits.pro[4]),
        t('pricing_page.pro.l6', DefaultLimits.pro[5])
      ],
      target: t('pricing_page.pro.target'),
      highlight: false,
      cta: t('pricing_page.pro.cta')
    },
    {
      name: t('pricing_page.enterprise.name'),
      price: t('pricing_page.enterprise.price'),
      period: t('pricing_page.enterprise.period'),
      limits: [
        t('pricing_page.enterprise.l1', DefaultLimits.enterprise[0]),
        t('pricing_page.enterprise.l2', DefaultLimits.enterprise[1]),
        t('pricing_page.enterprise.l3', DefaultLimits.enterprise[2]),
        t('pricing_page.enterprise.l4', DefaultLimits.enterprise[3])
      ],
      target: t('pricing_page.enterprise.target'),
      highlight: false,
      cta: t('pricing_page.enterprise.cta')
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-void flex flex-col font-sans">
      <Navbar currentView="pricing" />

      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 lg:px-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-acid/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-white font-medium leading-[1.15] text-[clamp(40px,5vw,64px)] tracking-tight mb-6">
              {t('pricing_page.title_pt1')} <span className="text-acid">{t('pricing_page.title_pt2')}</span>
            </h1>
            <p className="text-white/50 text-[18px] max-w-[600px] mx-auto font-light leading-relaxed">
              {t('pricing_page.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
            {PRICING_PLANS.map((plan, i) => (
              <div
                key={i}
                className={`flex flex-col rounded-[24px] p-6 lg:p-7 relative transition-all duration-300 hover:-translate-y-2 ${plan.highlight
                    ? 'bg-white/5 border-2 border-acid/80 shadow-[0_0_40px_rgba(232,245,50,0.1)] xl:scale-105 z-10'
                    : 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                  }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-acid text-void text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    {t('pricing_page.recommended')}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-white text-[clamp(24px,2.5vw,32px)] font-bold tracking-tight leading-none">{plan.price}</span>
                    <span className="text-white/40 text-[11px] font-medium">{plan.period}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-white/70 text-[13px] leading-relaxed min-h-[40px]">
                    <span className="text-white/40 block mb-1 text-[11px] uppercase tracking-wider font-bold">{t('pricing_page.best_for')}</span>
                    {plan.target}
                  </p>
                </div>

                <div className="flex-1">
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-4">{t('pricing_page.whats_included')}</p>
                  <ul className="space-y-3">
                    {plan.limits.map((limit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-acid' : 'text-white/40'}`} />
                        <span className="text-white/80 text-[12px] leading-snug">{limit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  <button
                    className={`w-full h-12 rounded-full text-sm font-bold transition-all active:scale-95 ${plan.highlight
                        ? 'bg-acid text-void shadow-[0_4px_14px_rgba(232,245,50,0.3)] hover:brightness-110'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                      }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
