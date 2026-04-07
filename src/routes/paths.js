/**
 * Typed route constants — use these everywhere instead of magic strings.
 */
export const PATHS = {
  home: '/',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  acceptInvite: '/accept-invite',
  googleCallback: '/auth/callback',
  pricing: '/pricing',

  // React Router Base Definitions
  dashboardBase: '/dashboard/:tenantId',

  // Dashboard Dynamic URL Generators
  dashboard: (t) => `/dashboard/${t}`,
  inventory: (t) => `/dashboard/${t}/inventory`,
  medicines: (t) => `/dashboard/${t}/medicines`,
  medicineDetail: (t, id) => `/dashboard/${t}/medicines/${id}`,
  orders: (t) => `/dashboard/${t}/orders`,
  orderDetail: (t, id) => `/dashboard/${t}/orders/${id}`,
  suppliers: (t) => `/dashboard/${t}/suppliers`,
  alerts: (t) => `/dashboard/${t}/alerts`,
  alertDetail: (t, id) => `/dashboard/${t}/alerts/${id}`,
  agents: (t) => `/dashboard/${t}/agents`,
  agentDetail: (t, id) => `/dashboard/${t}/agents/${id}`,
  aiQuery: (t) => `/dashboard/${t}/ai-query`,
  redistributions: (t) => `/dashboard/${t}/redistributions`,
  billing: (t) => `/dashboard/${t}/billing`,
  settings: (t) => `/dashboard/${t}/settings`,
  users: (t) => `/dashboard/${t}/users`,
  auditLog: (t) => `/dashboard/${t}/audit-log`,

  notFound: '/404',
};
