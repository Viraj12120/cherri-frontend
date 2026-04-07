import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Shield, Zap, Crown, Building, ArrowRight, Loader2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import { useAuthStore } from '../stores/authStore';
import { usePaymentStore } from '../stores/paymentStore';
import { useUiStore } from '../stores/uiStore';
import { loadRazorpay } from '../lib/razorpay';
import api from '../lib/axios';

const SEGMENTS = [
  { id: 'clinic', label: 'Clinics & Stores', icon: Shield },
  { id: 'distributor', label: 'Distributors', icon: Zap },
  { id: 'hospital', label: 'Hospitals & Networks', icon: Building }
];

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, organization } = useAuthStore();
  const { createOrder, verifyPayment } = usePaymentStore();
  const addToast = useUiStore(s => s.addToast);

  const [activeSegment, setActiveSegment] = useState(organization?.segment || 'clinic');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadRazorpay().catch(err => console.warn('Razorpay pre-load failed:', err.message));
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [activeSegment]);

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const { data } = await api.get('/plans', { params: { segment: activeSegment } });
      setPlans(data);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to load pricing plans.' });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handlePayment = async (plan) => {
    if (plan.is_enterprise || activeSegment === 'hospital') {
      navigate('/contact-sales'); // Or handle enterprise lead POST
      return;
    }

    if (!user) {
      addToast({ type: 'info', message: 'Please log in to subscribe.' });
      navigate(PATHS.login);
      return;
    }

    try {
      setSelectedPlanId(plan.id);
      await loadRazorpay();

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      const order = await createOrder(plan.id);

      const options = {
        key: razorpayKeyId,
        name: 'Cherri+ Pharma',
        description: `Subscription: ${plan.name} Plan`,
        image: '/vite.svg',
        handler: async (response) => {
          try {
            await verifyPayment(response);
            addToast({ type: 'success', message: 'Plan upgraded successfully!' });
            navigate(PATHS.dashboard(user.tenant_id));
          } catch (err) {
            addToast({ type: 'error', message: 'Payment verification failed.' });
          }
        },
        prefill: {
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
          email: user?.email,
        },
        theme: { color: '#E8F532' },
      };

      if (order.razorpay_subscription_id) options.subscription_id = order.razorpay_subscription_id;
      else if (order.razorpay_order_id) options.order_id = order.razorpay_order_id;

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Payment failed.' });
    } finally {
      setSelectedPlanId(null);
    }
  };

  const getPlanIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('starter') || n.includes('basic')) return Shield;
    if (n.includes('pro') || n.includes('growth')) return Zap;
    if (n.includes('enterprise')) return Crown;
    return Box;
  };

  const getPlanColor = (name) => {
    const n = name.toLowerCase();
    if (n.includes('starter')) return 'from-gray-500/20 to-slate-500/20';
    if (n.includes('pro')) return 'from-acid/10 to-emerald-500/10';
    if (n.includes('enterprise')) return 'from-purple-500/20 to-pink-500/20';
    return 'from-blue-500/20 to-indigo-500/20';
  };

  return (
    <div className="min-h-screen bg-void flex flex-col font-sans">
      <Navbar currentView="pricing" />

      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 lg:px-20 relative">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-white font-medium text-[clamp(40px,5vw,64px)] tracking-tight mb-6">
            Scale with <span className="text-acid">Confidence</span>
          </h1>
          
          {/* Segment Tabs */}
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl max-w-2xl mx-auto mb-12">
            {SEGMENTS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSegment(s.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${activeSegment === s.id ? 'bg-acid text-void shadow-xl' : 'text-white/40 hover:text-white'}`}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-xs font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-white/30'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-white/10 rounded-full relative p-1"
            >
              <div className={`w-4 h-4 bg-acid rounded-full transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold transition-colors ${billingCycle === 'annual' ? 'text-white' : 'text-white/30'}`}>Annual</span>
              <span className="bg-success/20 text-success text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Save 20%</span>
            </div>
          </div>

          {isLoadingPlans ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="animate-spin text-acid" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map(plan => {
                const Icon = getPlanIcon(plan.name);
                const color = getPlanColor(plan.name);
                const isSelected = selectedPlanId === plan.id;
                const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual / 12;

                return (
                  <div key={plan.id} className="bg-[#0A0C10] border border-white/5 rounded-3xl p-8 flex flex-col group transition-all hover:translate-y-[-8px] relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                    
                    <div className="mb-8 relative z-10">
                      <div className="p-3 bg-white/5 rounded-2xl inline-flex mb-6 text-white group-hover:text-acid transition-colors">
                        <Icon size={28} />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-bold text-white">Rs {Math.round(price).toLocaleString()}</span>
                        <span className="text-xs text-white/40">/mo</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed min-h-[40px]">
                        {activeSegment === 'clinic' ? 'Best for local pharmacy stores' : activeSegment === 'distributor' ? 'Optimized for high-volume supply chains' : 'Custom compliance and network features'}
                      </p>
                    </div>

                    <div className="space-y-4 flex-1 mb-8 relative z-10">
                      {plan.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check size={14} className={f.enabled ? 'text-success' : 'text-white/10'} />
                          <span className={`text-xs ${f.enabled ? 'text-white/70' : 'text-white/20 line-through'}`}>
                            {f.feature_obj.description} {f.limit_value ? `(Up to ${f.limit_value})` : ''}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePayment(plan)}
                      disabled={isSelected}
                      className={`mt-auto w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn ${plan.name.toLowerCase().includes('pro') ? 'bg-acid text-void shadow-xl' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    >
                      {isSelected ? <Loader2 size={18} className="animate-spin" /> : 
                       (activeSegment === 'hospital' || plan.is_enterprise ? 'Contact Sales' : 'Start 14-day Trial')}
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-20 p-8 border border-white/5 rounded-[40px] bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="flex items-center gap-6">
                <div className="p-5 bg-acid rounded-3xl">
                    <Building size={40} className="text-void" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Enterprise Solutions</h3>
                    <p className="text-sm text-white/40 max-w-sm">Custom features, dedicated support, and multi-region deployment for large healthcare networks.</p>
                </div>
            </div>
            <button className="px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all">
                Talk to an Expert
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
