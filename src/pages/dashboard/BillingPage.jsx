import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Crown, Shield, ArrowRight, Loader2, Sparkles, Building } from 'lucide-react';
import { usePaymentStore } from '../../stores/paymentStore';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { loadRazorpay } from '../../lib/razorpay';

import Skeleton from '../../components/ui/Skeleton';

const getPlanStyles = (plan, isActive) => {
  const name = plan.name.toLowerCase();
  
  if (plan.is_enterprise) {
    return {
      color: 'from-purple-500/20 to-pink-500/20',
      icon: Building,
      buttonText: 'Contact Us',
      description: 'Custom solutions for hospital chains and large networks.'
    };
  }
  
  if (name.includes('pro') || name.includes('distributor') || name.includes('wholesale')) {
    return {
      color: 'from-acid/10 to-emerald-500/10',
      borderColor: 'border-acid/30',
      icon: Crown,
      buttonText: isActive ? 'Active Plan' : 'Upgrade',
      badge: 'Recommended',
      description: 'Advanced features for scaling operations.'
    };
  }

  // Default / Starter / Growth
  return {
    color: 'from-blue-500/20 to-indigo-500/20',
    icon: Zap,
    buttonText: isActive ? 'Active Plan' : 'Upgrade',
    description: 'Perfect for small to medium pharmacies.'
  };
};

const BillingPage = () => {
  const { user, organization } = useAuthStore();
  const { 
    createOrder, 
    verifyPayment, 
    paymentStatus, 
    reset,
    plans,
    isFetchingPlans,
    fetchPlans
  } = usePaymentStore();
  const addToast = useUiStore(s => s.addToast);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchPlans(organization?.segment);
  }, [organization?.segment]);

  useEffect(() => {
    // Clean up payment state on mount
    reset();
    
    // Pre-load Razorpay SDK so it's ready when user clicks Upgrade
    loadRazorpay().catch(err => {
      console.warn('Razorpay pre-load failed:', err.message);
    });
  }, []);

  useEffect(() => {
    // If not on free trial, do nothing
    const normalizedPlan = user?.subscription_plan?.toLowerCase() || 'free';
    if (normalizedPlan !== 'free') return;

    // Use user.created_at + 14 days, or default to exactly 14 days from now if missing
    const trialStart = user?.created_at ? new Date(user.created_at).getTime() : Date.now();
    const trialEnd = trialStart + 14 * 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = trialEnd - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const handlePayment = async (plan) => {
    if (plan.id === 'enterprise') {
      addToast({ type: 'info', message: 'Our sales team will contact you shortly!' });
      return;
    }

    try {
      setSelectedPlanId(plan.id);

      await loadRazorpay();

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        throw new Error('Razorpay Key ID is missing. Please check your environment configuration.');
      }

      const order = await createOrder(plan.id);

      const options = {
        key: razorpayKeyId,
        name: 'Cherri+ Pharma',
        description: `Subscription: ${plan.name} Plan`,
        image: '/vite.svg',
        handler: async (response) => {
          try {
            await verifyPayment(response);
            await useAuthStore.getState().fetchMe();
            addToast({ type: 'success', message: 'Payment successful! Your plan has been upgraded.' });
          } catch (err) {
            addToast({ type: 'error', message: 'Payment verification failed. Please contact support.' });
          }
        },
        prefill: {
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Guest',
          email: user?.email || 'guest@example.com',
        },
        theme: {
          color: '#E8F532',
        },
      };

      if (order.amount) options.amount = order.amount;
      if (order.currency) options.currency = order.currency;

      if (order.razorpay_subscription_id || order.subscription_id) {
        options.subscription_id = order.razorpay_subscription_id || order.subscription_id;
      } else if (order.razorpay_order_id || order.order_id) {
        options.order_id = order.razorpay_order_id || order.order_id;
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Razorpay Payment Failed:', response.error);
        const errorDesc = response.error ? response.error.description || response.error.reason : 'Unknown error';
        addToast({ 
          type: 'error', 
          message: `Payment failed: ${errorDesc}` 
        });
      });
      rzp.open();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to initialize payment.' });
    } finally {
      setSelectedPlanId(null);
    }
  };

  const currentPlanName = user?.subscription_plan || 'Free';
  const currentPlan = plans.find(p => p.name.toLowerCase() === currentPlanName.toLowerCase());

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
      <div className="bg-[#161618] border border-white/5 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-acid/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="w-16 h-16 rounded-2xl bg-acid/10 flex items-center justify-center border border-acid/20 shrink-0 relative z-10">
          <Zap className="text-acid" size={32} />
        </div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <h3 className="text-lg font-bold text-white mb-1">
            Current Plan: {currentPlanName}
          </h3>
          <div className="text-white/40 text-sm mt-2 flex flex-col gap-2">
            {user?.subscription_plan && user.subscription_plan.toLowerCase() !== 'free' 
              ? 'You are on an active subscription.' 
              : <>
                  <span className="opacity-70">Your trial ends in:</span>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="font-mono text-acid font-black tracking-wider bg-acid/10 border border-acid/20 px-3 py-1.5 rounded-lg text-lg animate-pulse">
                      {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                  <span className="text-xs text-white/30 block">
                    After 14 days, your subscription mandate will activate and full access will be granted.
                  </span>
                </>}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-success/10 px-4 py-2 rounded-xl text-success text-xs font-bold border border-success/20 relative z-10">
          <Shield size={14} /> Active Account Status
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {isFetchingPlans ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#161618] border border-white/5 rounded-3xl p-8 h-[500px]">
              <Skeleton h="40px" w="40px" className="rounded-xl mb-6" />
              <Skeleton h="24px" w="60%" className="mb-4" />
              <Skeleton h="40px" w="40%" className="mb-8" />
              <div className="space-y-4 mb-8">
                <Skeleton h="16px" w="90%" />
                <Skeleton h="16px" w="80%" />
                <Skeleton h="16px" w="85%" />
              </div>
              <Skeleton h="48px" w="100%" className="rounded-2xl mt-auto" />
            </div>
          ))
        ) : plans.length > 0 ? (
          plans.map((plan) => {
            const userPlan = user?.subscription_plan?.toLowerCase() || 'free';
            const isActive = plan.name.toLowerCase() === userPlan.toLowerCase();
            const styles = getPlanStyles(plan, isActive);
            const isLoading = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-[#0A0C10] border rounded-3xl p-8 flex flex-col relative group transition-all duration-500 ${isActive ? 'border-acid shadow-[0_0_30px_rgba(232,245,50,0.15)] bg-[#0c0e12]' : 'border-white/5 opacity-80 hover:opacity-100 hover:translate-y-[-8px]'}`}
              >
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-acid text-void text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-[0_4px_20px_rgba(232,245,50,0.4)] z-20 whitespace-nowrap">
                    Current Active Plan
                  </div>
                )}

                {styles.badge && !isActive && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white/10 text-white/80 text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10 z-10">
                    {styles.badge}
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-b ${styles.color} ${isActive ? 'opacity-20' : 'opacity-0'} group-hover:opacity-30 transition-opacity rounded-3xl -z-10`} />

                <div className="mb-8">
                  <div className={`p-3 rounded-2xl inline-flex mb-6 transition-colors ${isActive ? 'bg-acid text-void' : 'bg-white/5 text-white group-hover:text-acid'}`}>
                    <styles.icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-white">
                      {plan.price_monthly === 0 ? 'Free' : `${plan.currency} ${plan.price_monthly.toLocaleString()}`}
                    </span>
                    <span className="text-xs text-white/40">{plan.price_monthly === 0 ? 'trial' : '/ month'}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{styles.description}</p>
                </div>

                <div className="space-y-4 flex-1 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-acid/20' : 'bg-success/10'}`}>
                        <Check size={10} className={isActive ? 'text-acid' : 'text-success'} />
                      </div>
                      <span className="text-xs text-white/70">
                        {feature.feature_obj.description || feature.feature_obj.key}
                        {feature.limit_value ? ` (${feature.limit_value})` : ''}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePayment(plan)}
                  disabled={isLoading || isActive}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'bg-acid/10 text-acid border border-acid/20' : styles.badge ? 'bg-acid text-void shadow-[0_4px_30px_rgba(232,245,50,0.2)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : isActive ? 'Active Plan' : styles.buttonText}
                  {!isLoading && !isActive && <ArrowRight size={18} />}
                  {isActive && <Check size={18} />}
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-white/5">
              <Sparkles className="text-acid/20 mx-auto mb-4" size={48} />
              <p className="text-white/40 font-bold">No public plans available for this account type.</p>
              <p className="text-white/20 text-xs mt-2 italic">Please contact support for enterprise white-label solutions.</p>
          </div>
        )}
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
