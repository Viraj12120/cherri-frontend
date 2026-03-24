import React from 'react';

/**
 * Placeholder page — replaced in later steps.
 * @param {{ title: string }} props
 */
const PlaceholderPage = ({ title = 'Coming Soon' }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <div className="w-14 h-14 rounded-2xl bg-acid/10 border border-acid/20 flex items-center justify-center mb-6">
      <span className="text-xl">🚧</span>
    </div>
    <h1 className="text-xl font-bold text-white mb-2">{title}</h1>
    <p className="text-white/40 text-sm">This page will be wired up in a later step.</p>
  </div>
);

export default PlaceholderPage;
