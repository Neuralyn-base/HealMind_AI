import React from 'react';

const AnalyticsCard = ({ title, children }) => (
  <div className="bg-white/90 rounded-3xl shadow-md p-6 flex flex-col gap-2 min-h-[180px] w-full">
    {title && (
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-bold text-primary-700">{title}</span>
      </div>
    )}
    <div className="flex-1">{children}</div>
  </div>
);

export default AnalyticsCard; 