import React from 'react';

/**
 * Button - Green -> Lime -> Yellow Futuristic Glass Button
 * Requirement: Primary = GREEN -> LIME, Important = LIME -> YELLOW, Success = GREEN, Achievement = YELLOW/GOLD
 */
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
  const baseStyle = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-[#168F3B] via-[#63C63D] to-[#B7E51D] hover:from-[#0B7A32] hover:via-[#36A852] hover:to-[#63C63D] text-slate-950 font-black shadow-lg shadow-[#63C63D]/25 focus:ring-[#63C63D] border border-[#B7E51D]/40',
    important: 'bg-gradient-to-r from-[#B7E51D] via-[#D5F51C] to-[#FFD900] hover:from-[#63C63D] hover:via-[#B7E51D] hover:to-[#FFC400] text-slate-950 font-black shadow-lg shadow-[#FFD900]/30 focus:ring-[#FFD900] border border-[#FFEA3A]/50',
    secondary: 'glass-card hover:bg-[#63C63D]/15 text-slate-900 dark:text-slate-100 border border-[#63C63D]/30 focus:ring-[#63C63D]',
    outline: 'border border-[#63C63D]/40 hover:border-[#B7E51D] text-[#36A852] dark:text-[#B7E51D] hover:text-slate-950 hover:bg-[#B7E51D] glass-pill focus:ring-[#63C63D]',
    success: 'bg-[#36A852] hover:bg-[#168F3B] text-white shadow-md shadow-[#36A852]/20 focus:ring-[#36A852]',
    achievement: 'bg-[#FFD900] hover:bg-[#FFC400] text-slate-950 font-black shadow-md shadow-[#FFD900]/25 focus:ring-[#FFD900]',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 focus:ring-rose-500',
    ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#63C63D]/10 bg-transparent'
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base font-extrabold'
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
