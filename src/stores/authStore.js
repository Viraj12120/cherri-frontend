import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

/**
 * Auth Store — persisted to localStorage.
 *
 * Manages: user profile, tokens, auth status.
 * Login uses x-www-form-urlencoded as required by the backend.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Actions ────────────────────────────────────────────────────────

      /**
       * Login — POST /auth/login (x-www-form-urlencoded)
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new URLSearchParams();
          formData.append('username', email);
          formData.append('password', password);

          const { data } = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });

          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          });

          // Fetch full user profile
          await get().fetchMe();

          return true;
        } catch (err) {
          const message =
            err.response?.data?.detail || 'Login failed. Please try again.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      /**
       * Register — POST /auth/register (JSON)
       */
      register: async ({ tenantName, email, password, firstName, lastName }) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', {
            tenant_name: tenantName,
            user_email: email,
            user_password: password,
            user_first_name: firstName,
            user_last_name: lastName,
          });

          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          });

          await get().fetchMe();

          return true;
        } catch (err) {
          const message =
            err.response?.data?.detail ||
            'Registration failed. Please try again.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      /**
       * Fetch current user profile — GET /auth/me
       */
      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({
            user: data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          // If this fails, tokens are likely invalid
          set({ isLoading: false });
          throw err;
        }
      },

      /**
       * Refresh access token — POST /auth/refresh
       */
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const { data } = await api.post('/auth/refresh', {
            refresh_token: refreshToken,
          });

          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token || refreshToken,
          });

          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      /**
       * Set tokens directly (used by axios interceptor after refresh)
       */
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      /**
       * Logout — POST /auth/logout, then clear state
       */
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Best-effort — server may be unreachable
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      /**
       * Clear error state
       */
      clearError: () => set({ error: null }),

      /**
       * DEV ONLY: Bypass login for frontend development
       */
      devLogin: () => {
        set({
          user: {
            id: 'dev-mock-id',
            first_name: 'Dev',
            last_name: 'User',
            email: 'dev@cherriplus.local',
            role: 'ADMIN',
            tenant_id: 'dev-tenant-id'
          },
          accessToken: 'mock.token.here',
          refreshToken: 'mock.refresh.here',
          isAuthenticated: true,
          error: null,
          isLoading: false
        });
      },
    }),
    {
      name: 'cherriplus-auth',
      // Only persist these fields — not loading/error
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
