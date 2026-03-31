import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

/**
 * Agent Store — Now persists the daily limits.
 *
 * Manages: agent trigger cooldowns, running state, logs, AI status.
 */

const COOLDOWN_MS = 60_000; // 60 seconds
const DAILY_LIMIT = 2; // user request: trigger agents 2 times only a day

// Helper to get today's date string
const getTodayStr = () => new Date().toISOString().split('T')[0];

export const useAgentStore = create(
  persist(
    (set, get) => ({
      // ── State ────────────────────────────────────────────────────────────
      triggerCooldowns: {}, // { [medicineId]: timestampMs }
      runningAgents: {},    // { [medicineId]: boolean }
      agentLogs: [],
      aiStatus: null,       // from GET /ai/status
      
      // Persisted state for daily limits
      dailyTriggers: { date: getTodayStr(), count: 0 },

      // ── Actions ──────────────────────────────────────────────────────────

      /**
       * Check if a trigger can fire for the given medicine.
       */
      canTrigger: (medicineId) => {
        const state = get();
        // Check daily limit first
        const today = getTodayStr();
        if (state.dailyTriggers.date === today && state.dailyTriggers.count >= DAILY_LIMIT) {
          return false;
        }

        const cooldown = state.triggerCooldowns[medicineId];
        if (!cooldown) return true;
        return Date.now() - cooldown > COOLDOWN_MS;
      },

      /**
       * Get remaining cooldown seconds for a medicine (0 if none).
       */
      getCooldownRemaining: (medicineId) => {
        const state = get();
        const cooldown = state.triggerCooldowns[medicineId];
        if (!cooldown) return 0;
        const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - cooldown)) / 1000);
        return Math.max(0, remaining);
      },

      /**
       * Get daily limit info
       */
      getDailyLimitInfo: () => {
        const state = get();
        const today = getTodayStr();
        if (state.dailyTriggers.date !== today) {
           return { count: 0, limit: DAILY_LIMIT };
        }
        return { count: state.dailyTriggers.count, limit: DAILY_LIMIT };
      },

      /**
       * Trigger replenishment agent — POST /agents/replenishment/trigger
       */
      triggerReplenishment: async (medicineId) => {
        const state = get();
        const today = getTodayStr();
        
        // Reset count if new day
        let currentCount = state.dailyTriggers.date === today ? state.dailyTriggers.count : 0;

        if (currentCount >= DAILY_LIMIT) {
          throw new Error(`Daily limit reached. You can only trigger agents ${DAILY_LIMIT} times a day.`);
        }

        // Guard: check cooldown
        const cooldown = state.triggerCooldowns[medicineId];
        if (cooldown && Date.now() - cooldown <= COOLDOWN_MS) {
          const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - cooldown)) / 1000);
          throw new Error(`Agent was triggered recently. Please wait ${remaining} seconds.`);
        }

        // Guard: already running
        if (state.runningAgents[medicineId]) {
          throw new Error('Agent is already running for this medicine.');
        }

        // Mark as running
        set((s) => ({
          runningAgents: { ...s.runningAgents, [medicineId]: true },
        }));

        try {
          const { data } = await api.post('/agents/replenishment/trigger', {
            medicine_id: medicineId,
          });

          // Start cooldown AND increment daily count
          set((s) => ({
            triggerCooldowns: { ...s.triggerCooldowns, [medicineId]: Date.now() },
            runningAgents: { ...s.runningAgents, [medicineId]: false },
            dailyTriggers: { date: today, count: currentCount + 1 }
          }));

          return data;
        } catch (err) {
          // Clear running state
          set((s) => ({
            runningAgents: { ...s.runningAgents, [medicineId]: false },
          }));

          // Start cooldown on rate limit
          if (err?.response?.status === 429) {
            set((s) => ({
              triggerCooldowns: { ...s.triggerCooldowns, [medicineId]: Date.now() },
            }));
          }

          throw err;
        }
      },

      /**
       * Fetch agent action logs — GET /agent-actions/
       */
      fetchAgentLogs: async (filters = {}) => {
        try {
          const { data } = await api.get('/agent-actions/', { params: filters });
          set({ agentLogs: Array.isArray(data) ? data : data.items || [] });
          return data;
        } catch (err) {
          throw err;
        }
      },

      /**
       * Fetch AI service status — GET /ai/status
       */
      fetchAiStatus: async () => {
        try {
          const { data } = await api.get('/ai/status');
          set({ aiStatus: data });
          return data;
        } catch (err) {
          set({ aiStatus: { status: 'unavailable' } });
          throw err;
        }
      },
    }),
    {
      name: 'agent-store-storage', 
      partialize: (state) => ({ dailyTriggers: state.dailyTriggers }), // Only persist the dailyTriggers
    }
  )
);
