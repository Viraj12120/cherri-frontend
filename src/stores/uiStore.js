import { create } from 'zustand';

/**
 * UI Store — NOT persisted.
 *
 * Manages: sidebar state, active tab, toast notifications.
 */
export const useUiStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────
  sidebarOpen: false,
  activeTab: null,
  toasts: [],

  // ── Actions ──────────────────────────────────────────────────────────

  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  /**
   * Add a toast notification.
   * @param {{ type?: 'success'|'error'|'warning'|'info', message: string, duration?: number }} toast
   */
  addToast: (toast) => {
    const id = toast.id || Date.now() + Math.random();
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          type: toast.type || 'info',
          message: toast.message,
          duration: toast.duration || 5000,
        },
      ],
    }));
    return id;
  },

  /**
   * Remove a specific toast by ID.
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  /**
   * Clear all toasts.
   */
  clearToasts: () => set({ toasts: [] }),
}));
