import React, { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false); // Reset dismissal so it shows again if they drop offline later
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-danger text-white py-2 px-4 shadow-lg animate-in slide-in-from-top duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WifiOff size={16} />
          <p className="text-sm font-bold">You are currently offline</p>
          <span className="text-xs text-white/70 hidden sm:inline">&middot; Some actions might not be saved until you reconnect</span>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default OfflineBanner;
