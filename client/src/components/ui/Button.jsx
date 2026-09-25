import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-teal-500 via-purple-600 to-pink-600 hover:from-teal-400 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg shadow-teal-500/25 focus:ring-teal-500 border border-teal-400/30',
    secondary: 'bg-slate-900/90 dark:bg-slate-900/90 light:bg-white hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-amber-50 text-slate-100 dark:text-white light:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-amber-200 focus:ring-teal-500',
    outline: 'border border-slate-800 dark:border-slate-800 light:border-amber-300 hover:border-teal-500/60 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-slate-950/40 dark:bg-slate-950/40 light:bg-white/60 focus:ring-teal-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 focus:ring-rose-500',
    ghost: 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-900/60 bg-transparent'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-semibold'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : children}
    </button>
  );
}
