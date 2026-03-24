import React from 'react';

/**
 * Skeleton loader component for loading states.
 * @param {{ className: string, shape: 'rect'|'circle'|'text', w: string, h: string }} props
 */
const Skeleton = ({ className = '', shape = 'rect', w, h }) => {
  const baseStyle = 'bg-white/5 animate-pulse relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.03] before:to-transparent';

  let shapeStyle = 'rounded-md';
  if (shape === 'circle') shapeStyle = 'rounded-full';
  if (shape === 'text') shapeStyle = 'rounded h-4';

  const inlineStyle = {};
  if (w) inlineStyle.width = w;
  if (h) inlineStyle.height = h;

  return (
    <div
      className={`${baseStyle} ${shapeStyle} ${className}`}
      style={inlineStyle}
    />
  );
};

// Table row skeleton wrapper
export const TableRowSkeleton = ({ columns = 5 }) => (
  <div className="flex items-center gap-4 py-4 border-b border-white/5">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} className="flex-1" h="20px" />
    ))}
  </div>
);

export default Skeleton;
