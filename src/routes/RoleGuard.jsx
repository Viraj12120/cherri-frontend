import React from 'react';
import { ShieldAlert } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative">
          <div className="absolute inset-0 bg-danger/20 animate-ping rounded-3xl opacity-20 hidden md:block" style={{ animationDuration: '3s' }} />
          <ShieldAlert className="text-danger" size={36} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Access Restricted</h1>
        <p className="text-white/40 text-sm max-w-md leading-relaxed">
          Your current role (<strong className="text-white/70">{userRole || 'Guest'}</strong>) does not have the necessary permissions to view this content. 
          Please contact your workspace administrator to request elevated access.
        </p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
