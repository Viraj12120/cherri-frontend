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
      organization: null, // { name, segment }
      features: {},       // { 'feature_key': bool }
      usage: {},          // { 'metric': { current, limit } }

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
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return data.user;
        } catch (err) {
          const message =
            err.response?.data?.detail || 'Login failed. Please try again.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      /**
       * Get Google OAuth Login URL — GET /auth/google/login
       */
      getGoogleAuthUrl: async () => {
        set({ isLoading: true, error: null });
        try {
          // Backend should return { url: "..." }
          const { data } = await api.get('/auth/google/login');
          set({ isLoading: false });
          return data.url;
        } catch (err) {
          const message =
            err.response?.data?.detail || 'Failed to fetch Google auth URL.';
          set({ isLoading: false, error: message });
          return null;
        }
      },

      /**
       * Handle Google Callback — POST /auth/google/callback?code=...
       * Replaces fetchTokensFromCookies
       */
      handleGoogleCallback: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get(`/auth/google/callback?code=${code}`);
          
          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch user profile
          await get().fetchMe();
          
          return get().user;
        } catch (err) {
          const message = err.response?.data?.detail || 'Google authentication failed.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      /**
       * Register — POST /auth/register (JSON)
       */
      register: async ({ tenantName, tenant_segment, email, password, firstName, lastName }) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', {
            tenant_name: tenantName,
            tenant_segment: tenant_segment,
            user_email: email,
            user_password: password,
            user_first_name: firstName,
            user_last_name: lastName,
          });

          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return data.user;
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
            organization: {
              name: data.organization_name,
              segment: data.organization_segment,
            },
            features: data.features || {},
            usage: data.usage || {},
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
          organization: null,
          features: {},
          usage: {},
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      /**
       * Check Feature Access
       */
      checkFeatureAccess: (featureKey) => {
        const { features } = get();
        return !!features[featureKey];
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
            email: 'dev@Cherri+.local',
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
      name: 'Cherri+-auth',
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
