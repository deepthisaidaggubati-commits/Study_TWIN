import React from 'react';

export default function Card({ children, className = '', title, subtitle, headerAction }) {
  return (
    <div className={`bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/60">
          <div>
            {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
