import axios from 'axios';

/**
 * Cherri+ Axios instance.
 *
 * - Base URL from VITE_API_URL env variable
 * - Request interceptor: attaches Bearer token from authStore
 * - Response interceptor: handles 401 → refresh → retry once → logout
 *
 * NOTE: authStore is imported lazily inside interceptors via dynamic import
 * getter to avoid circular dependency (authStore also imports this api instance).
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Lazy getter for authStore — avoids circular import at module evaluation time
// ---------------------------------------------------------------------------
let _authStoreModule = null;

const getAuthStore = () => {
  if (!_authStoreModule) {
    // This runs only once; by the time interceptors fire, the module is loaded
    _authStoreModule = import('../stores/authStore');
  }
  return _authStoreModule;
};

// ---------------------------------------------------------------------------
// Request Interceptor — attach access token
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  async (config) => {
    const mod = await getAuthStore();
    const token = mod.useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response Interceptor — handle 401 refresh flow
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 — skip retries and auth endpoints
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request and wait
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const mod = await getAuthStore();
      const store = mod.useAuthStore.getState();
      const refreshToken = store.refreshToken;

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh endpoint using raw axios (not our instance) to avoid interceptor loops
      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const newAccessToken = data.access_token;
      const newRefreshToken = data.refresh_token || refreshToken;

      // Update store with new tokens
      mod.useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

      // Resolve queued requests with new token
      processQueue(null, newAccessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Refresh failed — force logout and redirect
      const mod = await getAuthStore();
      mod.useAuthStore.getState().logout();

      if (typeof window !== 'undefined') {
        const publicPaths = ['/', '/login', '/signup', '/pricing', '/forgot-password', '/reset-password'];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { api };
export default api;
