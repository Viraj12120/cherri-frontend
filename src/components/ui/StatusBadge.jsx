import React from 'react';

/**
 * Standardized status badge.
 * Maps backend status strings to colors.
 *
 * @param {{ status: string, className: string }} props
 */
const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toUpperCase();

  let colorClass = 'bg-white/10 text-white/70 border-white/10'; // default neutral

  if (['ACTIVE', 'COMPLETED', 'DELIVERED', 'PAID', 'SUCCESS', 'OPTIMAL'].includes(norm)) {
    colorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  } else if (['PENDING', 'PROCESSING', 'LOW', 'WARNING', 'AT_RISK'].includes(norm)) {
    colorClass = 'bg-warn/10 text-warn border-warn/20';
  } else if (['FAILED', 'CANCELLED', 'CRITICAL', 'OUT_OF_STOCK', 'DENIED'].includes(norm)) {
    colorClass = 'bg-danger/10 text-danger border-danger/20';
  } else if (['AGENT_RUNNING', 'DRAFT'].includes(norm)) {
    colorClass = 'bg-acid/10 text-acid border-acid/20';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colorClass} ${className}`}
    >
      {norm.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
