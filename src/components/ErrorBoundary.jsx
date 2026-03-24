import React from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-navy/50 via-void to-void">
          <div className="max-w-md w-full bg-[#161618] border border-white/5 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6 border border-danger/20">
               <AlertTriangle className="text-danger" size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              An unexpected error occurred. Our team has been notified. 
              Please try refreshing the page or returning home.
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-acid text-void py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95"
              >
                <RefreshCcw size={18} /> Refresh Page
              </button>
              
              <a 
                href="/"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/60 font-bold text-sm hover:bg-white/10 transition-all"
              >
                <Home size={18} /> Return Home
              </a>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-void border border-white/5 rounded-xl text-left overflow-auto max-h-40">
                 <p className="text-[10px] font-mono text-danger/80 break-all">
                    {this.state.error?.toString()}
                 </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
