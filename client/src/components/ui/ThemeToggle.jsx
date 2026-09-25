import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Sparkles } from 'lucide-react';

export default function ThemeToggle({ className = '', showLabel = true }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 select-none cursor-pointer border ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 text-teal-300 border-teal-500/40 shadow-lg shadow-teal-500/10'
          : 'bg-amber-50/90 hover:bg-amber-100/90 text-amber-900 border-amber-400/50 shadow-md shadow-amber-400/20'
      } ${className}`}
      title={isDark ? 'Switch to ☀️ Digital Sunrise (Light)' : 'Switch to 🌙 Digital Night (Dark)'}
      aria-label="Toggle Theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-teal-300 animate-[pulse_3s_ease-in-out_infinite]" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 animate-[spin_12s_linear_infinite]" />
        )}
      </div>

      {showLabel && (
        <span className="tracking-wide flex items-center space-x-1">
          <span>{isDark ? '🌙 Digital Night' : '☀️ Digital Sunrise'}</span>
        </span>
      )}
    </button>
  );
}
