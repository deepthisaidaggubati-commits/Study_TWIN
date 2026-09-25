import React from 'react';

export default function Card({ children, className = '', title, subtitle, headerAction }) {
  return (
    <div className={`bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/90 border border-slate-800/80 dark:border-slate-800/80 light:border-amber-200/80 backdrop-blur-md rounded-2xl p-6 shadow-xl dark:shadow-2xl light:shadow-md transition-all duration-300 ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/60 dark:border-slate-800/60 light:border-amber-200/60">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-100 dark:text-white light:text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
