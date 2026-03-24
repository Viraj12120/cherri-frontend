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
  error: null,

  // ── Actions ──────────────────────────────────────────────────────────

  /**
   * Create a Razorpay order on the backend.
   */
  createOrder: async (planId) => {
    set({ paymentStatus: 'creating', error: null });
    try {
      const { data } = await api.post('/subscriptions/create-order', {
        plan_id: planId,
      });

      set({
        currentOrder: {
          razorpay_order_id: data.razorpay_order_id || data.order_id,
          amount: data.amount,
          currency: data.currency || 'INR',
        },
        paymentStatus: 'processing',
      });

      return data;
    } catch (err) {
      const message =
        err.response?.data?.detail || 'Failed to create payment order.';
      set({ paymentStatus: 'failed', error: message });
      throw err;
    }
  },

  /**
   * Verify payment with backend after Razorpay checkout success.
   */
  verifyPayment: async (razorpayResponse) => {
    set({ paymentStatus: 'processing', error: null });
    try {
      const { data } = await api.post('/subscriptions/verify-payment', {
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      });

      set({ paymentStatus: 'success', error: null });
      return data;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        'Payment verification failed. Please contact support.';
      set({ paymentStatus: 'failed', error: message });
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
