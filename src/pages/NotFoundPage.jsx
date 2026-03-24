import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../routes/paths';

/**
 * 404 Not Found page.
 */
const NotFoundPage = () => (
  <div className="min-h-screen bg-void flex flex-col items-center justify-center text-center px-6">
    <h1 className="text-[120px] font-black text-white/5 leading-none select-none">404</h1>
    <h2 className="text-2xl font-bold text-white -mt-8 mb-3">Page not found</h2>
    <p className="text-white/50 text-sm max-w-md mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link
      to={PATHS.home}
      className="px-6 py-2.5 bg-acid text-void font-bold text-sm rounded-full hover:brightness-110 transition-all"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
