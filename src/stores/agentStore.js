import { create } from 'zustand';
import api from '../lib/axios';

/**
 * Agent Store — NOT persisted (cooldowns are session-only).
 *
 * Manages: agent trigger cooldowns, running state, logs, AI status.
 */

const COOLDOWN_MS = 60_000; // 60 seconds

export const useAgentStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────
  triggerCooldowns: {}, // { [medicineId]: timestampMs }
  runningAgents: {},    // { [medicineId]: boolean }
  agentLogs: [],
  aiStatus: null,       // from GET /ai/status

  // ── Actions ──────────────────────────────────────────────────────────

  /**
   * Check if a trigger can fire for the given medicine.
   * Returns true if no cooldown or cooldown has expired.
   */
  canTrigger: (medicineId) => {
    const cooldown = get().triggerCooldowns[medicineId];
    if (!cooldown) return true;
    return Date.now() - cooldown > COOLDOWN_MS;
  },

  /**
   * Get remaining cooldown seconds for a medicine (0 if none).
   */
  getCooldownRemaining: (medicineId) => {
    const cooldown = get().triggerCooldowns[medicineId];
    if (!cooldown) return 0;
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - cooldown)) / 1000);
    return Math.max(0, remaining);
  },

  /**
   * Trigger replenishment agent — POST /agents/replenishment/trigger
   */
  triggerReplenishment: async (medicineId) => {
    // Guard: check cooldown
    if (!get().canTrigger(medicineId)) {
      const remaining = get().getCooldownRemaining(medicineId);
      throw new Error(`Agent was triggered recently. Please wait ${remaining} seconds.`);
    }

    // Guard: already running
    if (get().runningAgents[medicineId]) {
      throw new Error('Agent is already running for this medicine.');
    }

    // Mark as running
    set((state) => ({
      runningAgents: { ...state.runningAgents, [medicineId]: true },
    }));

    try {
      const { data } = await api.post('/agents/replenishment/trigger', {
        medicine_id: medicineId,
      });

      // Start cooldown
      set((state) => ({
        triggerCooldowns: { ...state.triggerCooldowns, [medicineId]: Date.now() },
        runningAgents: { ...state.runningAgents, [medicineId]: false },
      }));

      return data;
    } catch (err) {
      // Clear running state
      set((state) => ({
        runningAgents: { ...state.runningAgents, [medicineId]: false },
      }));

      // Start cooldown on rate limit
      if (err.response?.status === 429) {
        set((state) => ({
          triggerCooldowns: { ...state.triggerCooldowns, [medicineId]: Date.now() },
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
}));
