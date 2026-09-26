import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * StudentTwinAvatar3D - Small 3D-Style Digital Student Companion Character
 * 
 * Features:
 * - Gender Personalization: Female / Male / Neutral
 * - Dynamic Theme Color Adaptation (Requirement 7):
 *   - Light Theme (Digital Sunrise): Illuminated by Sunrise (Warm White, Cream, Teal, Cyan, Sun Yellow, Soft Pink)
 *   - Dark Theme (Digital Night): Illuminated by Night (Deep Indigo, Purple, Magenta, Teal, Hot Pink)
 * - Dynamic Learning States (Requirement 13):
 *   - FOCUSED, LEARNING, IMPROVING, STRONG_MOMENTUM, NEEDS_REVISION, NEEDS_ATTENTION
 * - Orbital Holographic Rings, Floating Neural Nodes, Interactive Breath & Float
 */
export default function StudentTwinAvatar3D({
  gender = 'neutral',
  size = 'md', // 'sm' | 'md' | 'lg' | 'hero'
  animated = true,
  state = 'LEARNING', // 'FOCUSED' | 'LEARNING' | 'IMPROVING' | 'STRONG_MOMENTUM' | 'NEEDS_REVISION' | 'NEEDS_ATTENTION'
  className = ''
}) {
  const { isDark } = useTheme();
  const normalizedGender = (gender || 'neutral').toLowerCase();
  const isFemale = normalizedGender === 'female';
  const isMale = normalizedGender === 'male';

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    hero: 'w-48 h-48 sm:w-64 sm:h-64'
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  // State-based aura colors
  const stateColorMap = {
    FOCUSED: { text: 'text-cyan-400', glow: 'from-cyan-500/30 to-teal-500/20', badge: 'Focused' },
    LEARNING: { text: 'text-teal-400', glow: 'from-teal-500/30 to-indigo-500/20', badge: 'Learning' },
    IMPROVING: { text: 'text-amber-400', glow: 'from-amber-400/30 to-teal-500/20', badge: 'Improving' },
    STRONG_MOMENTUM: { text: 'text-emerald-400', glow: 'from-emerald-400/35 to-teal-500/20', badge: 'Strong Momentum' },
    NEEDS_REVISION: { text: 'text-pink-400', glow: 'from-pink-500/35 to-purple-500/20', badge: 'Needs Revision' },
    NEEDS_ATTENTION: { text: 'text-orange-400', glow: 'from-orange-500/35 to-pink-500/20', badge: 'Needs Attention' }
  };

  const currentStateInfo = stateColorMap[state] || stateColorMap.LEARNING;

  return (
    <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
      {/* 1. Theme-Adapted Background Aura Glow (Requirement 7) */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 animate-[twinGlowPulse_4s_ease-in-out_infinite] ${
          isDark
            ? `bg-gradient-to-tr ${currentStateInfo.glow}`
            : 'bg-gradient-to-tr from-amber-300/40 via-teal-300/30 to-orange-300/30'
        }`}
      />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_12px_28px_rgba(24,197,192,0.35)] relative z-10 ${
          animated ? 'animate-[float_6s_ease-in-out_infinite]' : ''
        }`}
        aria-label="Digital Twin AI Companion"
      >
        <defs>
          {/* Theme Color Palettes */}
          {/* Body Hoodie/Jacket Gradient */}
          <linearGradient id="twinBodyGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#18C5C0" />
                <stop offset="35%" stopColor="#6A35B8" />
                <stop offset="75%" stopColor="#9D1985" />
                <stop offset="100%" stopColor="#FF8500" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="40%" stopColor="#0D9488" />
                <stop offset="80%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FB7185" />
              </>
            )}
          </linearGradient>

          {/* Face Sphere Gradient */}
          <linearGradient id="twinFaceGrad" x1="60" y1="40" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#4FD7D0" />
                <stop offset="50%" stopColor="#22266F" />
                <stop offset="100%" stopColor="#6A35B8" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="50%" stopColor="#CCFBF1" />
                <stop offset="100%" stopColor="#99F6E4" />
              </>
            )}
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="twinHairGrad" x1="40" y1="20" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#FFD447" />
                <stop offset="50%" stopColor="#FF8500" />
                <stop offset="100%" stopColor="#F51F62" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EC4899" />
              </>
            )}
          </linearGradient>

          {/* Holographic Ring Gradient */}
          <linearGradient id="ringGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#18C5C0" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F51F62" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFD447" stopOpacity="0.9" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </>
            )}
          </linearGradient>

          <filter id="twinGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 2. Outer Holographic Orbiting Rings */}
        <ellipse
          cx="100"
          cy="155"
          rx="75"
          ry="22"
          stroke="url(#ringGrad)"
          strokeWidth="3"
          strokeDasharray="12 8 20 8"
          className={animated ? 'animate-[spin_20s_linear_infinite] origin-center' : ''}
          opacity="0.85"
        />

        <ellipse
          cx="100"
          cy="45"
          rx="60"
          ry="15"
          stroke="url(#ringGrad)"
          strokeWidth="2.5"
          strokeDasharray="8 6 14 6"
          className={animated ? 'animate-[spin_15s_linear_infinite_reverse] origin-center' : ''}
          opacity="0.75"
        />

        {/* 3. 3D Student Torso & Tech Hoodie */}
        <path
          d="M 50 160 C 50 120, 70 110, 100 110 C 130 110, 150 120, 150 160 C 150 180, 135 190, 100 190 C 65 190, 50 180, 50 160 Z"
          fill="url(#twinBodyGrad)"
          opacity="0.95"
        />

        {/* Zipper & Collar Accent Lines */}
        <path
          d="M 80 115 L 100 145 L 120 115"
          stroke={isDark ? '#4FD7D0' : '#0284C7'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="100" y1="145" x2="100" y2="185" stroke={isDark ? '#F51F62' : '#F59E0B'} strokeWidth="3" strokeDasharray="4 3" />

        {/* 4. Head Sphere Base */}
        <circle cx="100" cy="78" r="38" fill="url(#twinFaceGrad)" />
        <circle cx="100" cy="78" r="38" stroke="url(#ringGrad)" strokeWidth="2.5" opacity="0.85" />

        {/* 5. Hair Style Personalization (Female vs Male vs Neutral) */}
        {isFemale ? (
          <g fill="url(#twinHairGrad)">
            <path d="M 62 70 C 55 45, 80 32, 100 32 C 120 32, 145 45, 138 70 C 130 50, 115 42, 100 42 C 85 42, 70 50, 62 70 Z" />
            <path d="M 60 70 C 45 80, 42 105, 52 125 C 56 105, 62 85, 66 74 Z" />
            <path d="M 140 70 C 155 80, 158 105, 148 125 C 144 105, 138 85, 134 74 Z" />
          </g>
        ) : isMale ? (
          <path
            d="M 64 68 C 60 42, 78 30, 100 30 C 122 30, 140 42, 136 68 C 130 48, 116 40, 100 40 C 84 40, 70 48, 64 68 Z M 85 30 L 92 22 L 100 28 L 108 20 L 115 30 Z"
            fill="url(#twinHairGrad)"
          />
        ) : (
          <path
            d="M 63 68 C 58 40, 80 30, 100 30 C 120 30, 142 40, 137 68 C 128 48, 114 42, 100 42 C 86 42, 72 48, 63 68 Z"
            fill="url(#twinHairGrad)"
          />
        )}

        {/* 6. Smart Glasses / AR Student Visor */}
        <rect
          x="74"
          y="68"
          width="52"
          height="18"
          rx="9"
          fill={isDark ? '#070812' : '#0F172A'}
          stroke={isDark ? '#18C5C0' : '#0284C7'}
          strokeWidth="2.5"
        />
        <rect x="78" y="71" width="20" height="12" rx="6" fill={isDark ? '#4FD7D0' : '#38BDF8'} opacity="0.75" />
        <rect x="102" y="71" width="20" height="12" rx="6" fill={isDark ? '#4FD7D0' : '#38BDF8'} opacity="0.75" />
        <line x1="98" y1="77" x2="102" y2="77" stroke="#FFD447" strokeWidth="2" />

        {/* Eye Sparkles */}
        <circle cx="86" cy="76" r="2.5" fill="#FFF" className={animated ? 'animate-pulse' : ''} />
        <circle cx="110" cy="76" r="2.5" fill="#FFF" className={animated ? 'animate-pulse' : ''} />

        {/* Friendly Student Smile */}
        <path d="M 92 94 Q 100 100 108 94" stroke="#FFD447" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* 7. Neural Node Sparkles */}
        <g filter="url(#twinGlowFilter)">
          <circle cx="45" cy="60" r="4.5" fill={isDark ? '#18C5C0' : '#0284C7'} className={animated ? 'animate-bounce' : ''} />
          <circle cx="155" cy="65" r="5" fill={isDark ? '#F51F62' : '#EC4899'} className={animated ? 'animate-pulse' : ''} />
          <circle cx="140" cy="140" r="4" fill="#FFD447" className={animated ? 'animate-ping' : ''} />
          <circle cx="55" cy="135" r="4.5" fill={isDark ? '#9D1985' : '#8B5CF6'} />
        </g>
      </svg>
    </div>
  );
}
