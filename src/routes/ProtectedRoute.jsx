import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { PATHS } from './paths';

/**
 * Route guard for authenticated-only pages.
 *
 * If not authenticated, redirects to /login with the current path as
 * a `redirect` query parameter so the user returns after login.
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectTo = `${PATHS.login}?redirect=${encodeURIComponent(
      location.pathname + location.search,
    )}`;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
