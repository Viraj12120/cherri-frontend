import { create } from 'zustand';
import api from '../lib/axios';

/**
 * Payment Store — NOT persisted.
 *
 * Manages: Razorpay order creation, checkout state, verification.
 */
export const usePaymentStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────
  currentOrder: null,    // { razorpay_order_id, amount, currency }
  paymentStatus: 'idle', // 'idle' | 'creating' | 'processing' | 'success' | 'failed'
  plans: [],
  isFetchingPlans: false,
  error: null,

  // ── Actions ──────────────────────────────────────────────────────────

  fetchPlans: async (segment) => {
    set({ isFetchingPlans: true, error: null });
    try {
      const url = segment ? `/plans?segment=${segment}` : '/plans';
      const { data } = await api.get(url);
      set({ plans: data, isFetchingPlans: false });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to load subscription plans.';
      set({ isFetchingPlans: false, error: msg });
    }
  },

  createOrder: async (planId) => {
    set({ paymentStatus: 'creating', error: null });
    try {
      const { data } = await api.post('/subscriptions/create', { plan: planId.toUpperCase() });

      set({
        currentOrder: data,
        paymentStatus: 'processing',
      });

      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create subscription order.';
      set({ paymentStatus: 'failed', error: msg });
      throw err;
    }
  },

  verifyPayment: async (razorpayResponse) => {
    set({ paymentStatus: 'processing', error: null });
    try {
      const { data } = await api.post('/subscriptions/verify', razorpayResponse);
      set({ paymentStatus: 'success', error: null });
      
      // Refresh auth data to reflect new subscription/plan immediately
      const { useAuthStore } = await import('./authStore');
      await useAuthStore.getState().fetchMe();
      
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Payment verification failed.';
      set({ paymentStatus: 'failed', error: msg });
      throw err;
    }
  },

  /**
   * Reset payment state (e.g., after modal dismiss or starting over).
   */
  reset: () => {
    set({
      currentOrder: null,
      paymentStatus: 'idle',
      error: null,
    });
  },
}));
