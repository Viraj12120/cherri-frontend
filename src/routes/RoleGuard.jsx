import React from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * Role-based access guard.
 *
 * Renders children only if the current user's role is in the allowed list.
 * Otherwise renders a 403 Forbidden page.
 *
 * @param {{ allowedRoles: string[], children: React.ReactNode }} props
 */
const RoleGuard = ({ allowedRoles = [], children }) => {
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role?.toUpperCase();

  if (!userRole || !allowedRoles.map((r) => r.toUpperCase()).includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
          <span className="text-2xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-white/50 text-sm max-w-md">
          You don't have permission to access this page. Contact your administrator
          if you believe this is an error.
        </p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
