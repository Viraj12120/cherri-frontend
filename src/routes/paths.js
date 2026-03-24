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
  pricing: '/pricing',

  // Dashboard
  dashboard: '/dashboard',
  inventory: '/dashboard/inventory',
  medicines: '/dashboard/medicines',
  orders: '/dashboard/orders',
  orderDetail: (id) => `/dashboard/orders/${id}`,
  suppliers: '/dashboard/suppliers',
  alerts: '/dashboard/alerts',
  agents: '/dashboard/agents',
  agentDetail: (id) => `/dashboard/agents/${id}`,
  aiQuery: '/dashboard/ai-query',
  redistributions: '/dashboard/redistributions',
  billing: '/dashboard/billing',
  settings: '/dashboard/settings',
  users: '/dashboard/users',
  auditLog: '/dashboard/audit-log',

  notFound: '/404',
};
