import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', showLabel = true }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 select-none cursor-pointer border ${
        isDark
          ? 'glass-panel text-[#B7E51D] border-[#63C63D]/40 shadow-lg shadow-[#63C63D]/10 hover:border-[#B7E51D]'
          : 'bg-[#FDFDF5] hover:bg-[#F5FFEB] text-[#0B7A32] border-[#36A852]/40 shadow-md shadow-[#36A852]/15'
      } ${className}`}
      title={isDark ? 'Switch to ☀️ Digital Sunrise (Light)' : 'Switch to 🌙 Digital Night (Dark)'}
      aria-label="Toggle Theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-[#B7E51D] animate-[pulse_3s_ease-in-out_infinite]" />
        ) : (
          <Sun className="w-4 h-4 text-[#FFD900] animate-[spin_12s_linear_infinite]" />
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
