import React from 'react';
import { Tablet, Laptop, Smartphone } from 'lucide-react';

const MobileRestriction = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void text-white p-8 text-center md:hidden">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-acid/20 blur-3xl rounded-full"></div>
        <div className="relative flex items-center justify-center gap-4">
          <Smartphone size={48} className="text-white/20" />
          <div className="h-12 w-px bg-white/10 mx-2"></div>
          <div className="flex gap-2">
            <Tablet size={32} className="text-acid animate-pulse" />
            <Laptop size={32} className="text-acid animate-pulse" />
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4 tracking-tight">Desktop/Tablet Experience Only</h2>
      <p className="text-white/60 text-sm max-w-[280px] leading-relaxed mb-8 font-medium">
        CherriPlus Dashboard is optimized for high-performance inventory management on larger screens. 
        Please switch to a Tablet or Desktop for the full experience.
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Recommended Width</span>
          <span className="text-sm font-bold text-acid">768px+</span>
        </div>
      </div>
      
      <div className="mt-12 opacity-30 select-none">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">CherriPlus System v1.0.4</span>
      </div>
    </div>
  );
};

export default MobileRestriction;
