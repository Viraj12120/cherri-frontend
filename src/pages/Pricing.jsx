import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Shield, Zap, Crown, Building, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Pricing = () => {
  const { t } = useTranslation();

  const DefaultLimits = {
    free: ['Up to 50 medicines', '1 user, 1 location', 'No agent auto-orders', 'Standard Support'],
    starter: ['Up to 1,000 medicines', '5 users, 1 location', 'Both AI agents', 'Priority support'],
    pro: ['Unlimited medicines', 'Unlimited users, 10 locations', 'API access', 'Custom alerts'],
    enterprise: ['Custom SLA', 'Dedicated server', 'Compliance reports', 'Integration support']
  };

  const PRICING_PLANS = [
    {
      id: 'plan_free',
      name: t('pricing_page.free.name', 'Free Trial'),
      price: t('pricing_page.free.price', 'Rs 0'),
      period: t('pricing_page.free.period', 'for 14 days'),
      limits: [
        t('pricing_page.free.l1', DefaultLimits.free[0]),
        t('pricing_page.free.l2', DefaultLimits.free[1]),
        t('pricing_page.free.l3', DefaultLimits.free[2]),
        t('pricing_page.free.l4', DefaultLimits.free[3])
      ],
      target: t('pricing_page.free.target', 'Any business wanting to try before buying.'),
      color: 'from-gray-500/20 to-slate-500/20',
      icon: Shield,
      cta: t('pricing_page.free.cta', 'Start Free Trial')
    },
    {
      id: 'plan_clinics',
      name: t('pricing_page.starter.name', 'Starter'),
      price: t('pricing_page.starter.price', 'Rs 4,999'),
      period: t('pricing_page.starter.period', 'per month'),
      limits: [
        t('pricing_page.starter.l1', DefaultLimits.starter[0]),
        t('pricing_page.starter.l2', DefaultLimits.starter[1]),
        t('pricing_page.starter.l3', DefaultLimits.starter[2]),
        t('pricing_page.starter.l4', DefaultLimits.starter[3])
      ],
      target: t('pricing_page.starter.target', 'Best for clinics and stores.'),
      color: 'from-blue-500/20 to-indigo-500/20',
      icon: Zap,
      cta: t('pricing_page.starter.cta', 'Get Started')
    },
    {
      id: 'plan_distributor',
      name: t('pricing_page.pro.name', 'Pro'),
      price: t('pricing_page.pro.price', 'Rs 7,999'),
      period: t('pricing_page.pro.period', 'per month'),
      limits: [
        t('pricing_page.pro.l1', DefaultLimits.pro[0]),
        t('pricing_page.pro.l2', DefaultLimits.pro[1]),
        t('pricing_page.pro.l3', DefaultLimits.pro[2]),
        t('pricing_page.pro.l4', DefaultLimits.pro[3])
      ],
      target: t('pricing_page.pro.target', 'Best for distributors.'),
      color: 'from-acid/10 to-emerald-500/10',
      borderColor: 'border-acid/30',
      badge: t('pricing_page.pro.badge', 'Most Popular'),
      icon: Crown,
      cta: t('pricing_page.pro.cta', 'Upgrade Now')
    },
    {
      id: 'plan_enterprise',
      name: t('pricing_page.enterprise.name', 'Enterprise'),
      price: t('pricing_page.enterprise.price', 'Custom'),
      period: t('pricing_page.enterprise.period', 'contact sales'),
      limits: [
        t('pricing_page.enterprise.l1', DefaultLimits.enterprise[0]),
        t('pricing_page.enterprise.l2', DefaultLimits.enterprise[1]),
        t('pricing_page.enterprise.l3', DefaultLimits.enterprise[2]),
        t('pricing_page.enterprise.l4', DefaultLimits.enterprise[3])
      ],
      target: t('pricing_page.enterprise.target', 'For company and hospitals.'),
      color: 'from-purple-500/20 to-pink-500/20',
      icon: Building,
      cta: t('pricing_page.enterprise.cta', 'Contact Sales')
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {PRICING_PLANS.map((plan, i) => {
              const isPro = plan.id === 'plan_distributor';

              return (
                <div 
                  key={plan.id}
                  className={`bg-[#0A0C10] border rounded-3xl p-8 flex flex-col relative group transition-all duration-500 hover:translate-y-[-8px] ${plan.borderColor || 'border-white/5'}`}
                >
                  {plan.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-acid text-void text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_4px_20px_rgba(232,245,50,0.3)] z-10">
                      {plan.badge}
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-b ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl z-0 pointer-events-none`} />
                  
                  <div className="mb-8 relative z-10">
                     <div className="p-3 bg-white/5 rounded-2xl inline-flex mb-6 text-white group-hover:text-acid transition-colors">
                        <plan.icon size={28} />
                     </div>
                     <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                     <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                        <span className="text-xs text-white/40">{plan.period}</span>
                     </div>
                     <p className="text-xs text-white/50 leading-relaxed">{plan.target}</p>
                  </div>

                  <div className="space-y-4 flex-1 mb-8 relative z-10">
                     {plan.limits.map((feature, idx) => (
                       <div key={idx} className="flex items-start gap-3">
                          <div className="mt-1 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                             <Check size={10} className="text-success" />
                          </div>
                          <span className="text-xs text-white/70">{feature}</span>
                       </div>
                     ))}
                  </div>

                  <div className="mt-auto relative z-10">
                    <button
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${isPro ? 'bg-acid text-void shadow-[0_4px_30px_rgba(232,245,50,0.2)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    >
                      {plan.cta}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
