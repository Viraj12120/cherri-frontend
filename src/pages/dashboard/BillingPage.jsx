import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Crown, Shield, ArrowRight, Loader2, Sparkles, Building } from 'lucide-react';
import { usePaymentStore } from '../../stores/paymentStore';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';

const PLANS = [
  {
    id: 'plan_free',
    name: 'Free Trial',
    price: 'Rs 0',
    period: 'for 14 days',
    description: 'Any business wanting to try before buying.',
    features: [
      'Up to 50 medicines',
      '1 user, 1 location',
      'No agent auto-orders',
      'Standard Support'
    ],
    color: 'from-gray-500/20 to-slate-500/20',
    icon: Shield,
    buttonText: 'Current Plan'
  },
  {
    id: 'plan_clinics',
    name: 'Starter',
    price: 'Rs 4,999',
    period: 'per month',
    description: 'Best for clinics and stores.',
    features: [
      'Up to 1,000 medicines',
      '5 users, 1 location',
      'Both AI agents',
      'Priority support'
    ],
    color: 'from-blue-500/20 to-indigo-500/20',
    icon: Zap,
    buttonText: 'Upgrade'
  },
  {
    id: 'plan_distributor',
    name: 'Pro',
    price: 'Rs 7,999',
    period: 'per month',
    description: 'Best for distributors.',
    features: [
      'Unlimited medicines',
      'Unlimited users, 10 locations',
      'API access',
      'Custom alerts'
    ],
    color: 'from-acid/10 to-emerald-500/10',
    borderColor: 'border-acid/30',
    badge: 'Most Popular',
    icon: Crown,
    buttonText: 'Upgrade'
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact sales',
    description: 'For company and hospitals.',
    features: [
      'Custom SLA',
      'Dedicated server',
      'Compliance reports',
      'Integration support'
    ],
    color: 'from-purple-500/20 to-pink-500/20',
    icon: Building,
    buttonText: 'Contact Us'
  }
];

const BillingPage = () => {
  const { user } = useAuthStore();
  const { createOrder, verifyPayment, paymentStatus, currentOrder, reset } = usePaymentStore();
  const addToast = useUiStore(s => s.addToast);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    // Clean up payment state on mount
    reset();
  }, []);

  const handlePayment = async (plan) => {
    if (plan.id === 'plan_enterprise') {
      addToast({ type: 'info', message: 'Our sales team will contact you shortly!' });
      return;
    }

    try {
      setSelectedPlan(plan.id);

      // Fail-safe: Dynamically load Razorpay script if it's missing (e.g. ad-blockers or slow cache)
      if (!window.Razorpay) {
        const scriptLoaded = await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay SDK. Please check your internet connection or disable ad-blockers.');
        }
      }

      const order = await createOrder(plan.id);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Cherri+ Pharma',
        description: `Subscription: ${plan.name} Plan`,
        image: '/vite.svg',
        order_id: order.razorpay_order_id || order.order_id,
        handler: async (response) => {
          try {
            await verifyPayment(response);
            addToast({ type: 'success', message: 'Payment successful! Your plan has been upgraded.' });
          } catch (err) {
            addToast({ type: 'error', message: 'Payment verification failed. Please contact support.' });
          }
        },
        prefill: {
          name: `${user?.first_name} ${user?.last_name}`,
          email: user?.email,
        },
        theme: {
          color: '#E8F532',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        addToast({ type: 'error', message: `Payment failed: ${response.error.description}` });
      });
      rzp.open();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to initialize payment.' });
    } finally {
      setSelectedPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 pb-24">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="text-acid" size={24} />
          <h1 className="text-2xl font-bold text-white tracking-tight">Subscription & Billing</h1>
        </div>
        <p className="text-white/40 text-sm max-w-2xl">
          Scale your pharmacy business with our AI-powered operational tools.
          Manage your subscription, view invoices, and upgrade your experience.
        </p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-[#161618] border border-white/5 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-acid/10 flex items-center justify-center border border-acid/20 shrink-0">
          <Zap className="text-acid" size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-white mb-1">Current Plan: Free Trial</h3>
          <p className="text-white/40 text-sm">Your trial expires in <span className="text-acid font-bold">14 days</span>. Upgrade now to unlock full agent capabilities.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-white/60 text-xs font-bold border border-white/5">
          <Shield size={14} className="text-success" /> Verified Identity
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan) => {
          const isPro = plan.id === 'plan_distributor';
          const isLoading = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-[#0A0C10] border rounded-3xl p-8 flex flex-col relative group transition-all duration-500 hover:translate-y-[-8px] ${plan.borderColor || 'border-white/5'}`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-acid text-void text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_4px_20px_rgba(232,245,50,0.3)]">
                  {plan.badge}
                </div>
              )}

              <div className={`absolute inset-0 bg-gradient-to-b ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10`} />

              <div className="mb-8">
                <div className="p-3 bg-white/5 rounded-2xl inline-flex mb-6 text-white group-hover:text-acid transition-colors">
                  <plan.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-xs text-white/40">{plan.period}</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-success" />
                    </div>
                    <span className="text-xs text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePayment(plan)}
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 ${isPro ? 'bg-acid text-void shadow-[0_4px_30px_rgba(232,245,50,0.2)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : plan.buttonText}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 text-white/20 text-[10px] uppercase font-bold tracking-[0.2em] mb-4">
          <Sparkles size={14} /> Powered by Razorpay Security
        </div>
        <p className="text-[10px] text-white/20 max-w-lg mx-auto leading-relaxed">
          Your transactions are secure and encrypted. Cherri+ does not store your credit card details.
          Invoices will be sent to <strong>{user?.email}</strong>.
        </p>
      </div>
    </div>
  );
};

export default BillingPage;
