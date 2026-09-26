import React from 'react';

/**
 * Card - Glassmorphic Transparent Floating Container
 * Uses requirement 3 glass surfaces, soft glows, floating composition over background.
 */
export default function Card({ children, className = '', title, subtitle, headerAction, hover = true }) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 ${
        hover ? 'hover:-translate-y-1' : ''
      } ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/20 dark:border-slate-700/30">
          <div>
            {title && (
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
