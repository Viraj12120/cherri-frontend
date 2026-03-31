import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { PATHS } from '../routes/paths';

/**
 * 404 Not Found page.
 */
const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-navy/50 via-void to-void">
    <div className="max-w-md w-full">
      <h1 className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 leading-none select-none mb-4">
        404
      </h1>
      <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Lost in the aisles?</h2>
      <p className="text-white/40 text-sm mb-10 leading-relaxed">
        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps it never existed in our inventory.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => window.history.back()}
          className="flex flex-1 items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white/60 font-bold text-sm rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/5"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
        <Link
          to={PATHS.home}
          className="flex flex-1 items-center justify-center gap-2 px-6 py-3 bg-acid text-void font-bold text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(232,245,50,0.15)]"
        >
          <Home size={16} /> Return Home
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
