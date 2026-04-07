import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

/**
 * UsageMeter 
 * 
 * Progress bar component showing usage vs limits.
 * Color codes:
 * - Green: < 80%
 * - Yellow: 80% to 99%
 * - Red: >= 100%
 */
const UsageMeter = ({ metricKey, label, icon: Icon }) => {
  const usageData = useAuthStore((s) => s.usage[metricKey]) || { current: 0, limit: 100 };
  const { current, limit } = usageData;
  
  // Calculate percentage
  const percentage = limit ? Math.min(100, (current / limit) * 100) : 0;
  
  // Determine color based on threshold
  let barColor = 'bg-success';
  let textColor = 'text-success';
  if (percentage >= 100) {
    barColor = 'bg-danger';
    textColor = 'text-danger';
  } else if (percentage >= 80) {
    barColor = 'bg-warning';
    textColor = 'text-warning';
  }

  return (
    <div className="p-4 bg-navy/50 border border-white/5 rounded-2xl group transition-all hover:bg-navy hover:border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${textColor}`}>
              <Icon size={16} />
            </div>
          )}
          <span className="text-[11px] font-bold text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xs font-bold ${textColor}`}>{current.toLocaleString()}</span>
          <span className="text-[10px] text-white/30">/ {limit?.toLocaleString() || '∞'}</span>
        </div>
      </div>

      <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,0,0,0.3)] ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px]">
        {percentage >= 100 ? (
          <div className="flex items-center gap-1.5 text-danger font-bold">
            <AlertCircle size={10} />
            Limit Reached
          </div>
        ) : percentage >= 80 ? (
          <div className="flex items-center gap-1.5 text-warning font-bold">
            <AlertCircle size={10} />
            Approaching Limit
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-success/50 font-medium">
             <CheckCircle2 size={10} />
             Healthy Usage
          </div>
        )}

        {percentage >= 80 && (
          <button className="flex items-center gap-0.5 text-acid hover:underline font-bold">
            Upgrade <ArrowUpRight size={10} />
          </button>
        )}
      </div>
    </div>
  );
};

export default UsageMeter;
