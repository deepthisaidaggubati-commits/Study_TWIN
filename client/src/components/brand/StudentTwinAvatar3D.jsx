import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * StudentTwinAvatar3D - Small 3D-Style Digital Student Companion
 * Palette: Green (#168F3B, #36A852) -> Lime (#63C63D, #B7E51D) -> Yellow (#FFD900, #FFC400)
 */
export default function StudentTwinAvatar3D({
  gender = 'neutral',
  size = 'md', // 'sm' | 'md' | 'lg' | 'hero'
  animated = true,
  state = 'LEARNING',
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

  const stateColorMap = {
    FOCUSED: { text: 'text-[#63C63D]', glow: 'from-[#168F3B]/35 to-[#B7E51D]/25', badge: 'Focused' },
    LEARNING: { text: 'text-[#B7E51D]', glow: 'from-[#36A852]/35 to-[#FFD900]/25', badge: 'Learning' },
    IMPROVING: { text: 'text-[#FFD900]', glow: 'from-[#63C63D]/35 to-[#FFC400]/25', badge: 'Improving' },
    STRONG_MOMENTUM: { text: 'text-[#D5F51C]', glow: 'from-[#36A852]/40 to-[#B7E51D]/30', badge: 'Strong Momentum' },
    NEEDS_REVISION: { text: 'text-[#FFD84A]', glow: 'from-[#168F3B]/40 to-[#FFD900]/30', badge: 'Needs Revision' },
    NEEDS_ATTENTION: { text: 'text-[#FFC400]', glow: 'from-[#0B7A32]/40 to-[#FFEA3A]/30', badge: 'Needs Attention' }
  };

  const currentStateInfo = stateColorMap[state] || stateColorMap.LEARNING;

  return (
    <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
      {/* 1. Green -> Lime -> Yellow Theme-Adapted Aura Glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 animate-[twinGlowPulse_4s_ease-in-out_infinite] ${
          isDark
            ? `bg-gradient-to-tr ${currentStateInfo.glow}`
            : 'bg-gradient-to-tr from-[#8ED13F]/40 via-[#B7E51D]/35 to-[#FFD900]/35'
        }`}
      />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_12px_28px_rgba(99,198,61,0.4)] relative z-10 ${
          animated ? 'animate-[float_6s_ease-in-out_infinite]' : ''
        }`}
        aria-label="Digital Twin AI Companion"
      >
        <defs>
          {/* Green -> Lime -> Yellow Gradients */}
          <linearGradient id="twinBodyGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#0B7A32" />
                <stop offset="35%" stopColor="#168F3B" />
                <stop offset="70%" stopColor="#63C63D" />
                <stop offset="100%" stopColor="#B7E51D" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#36A852" />
                <stop offset="40%" stopColor="#63C63D" />
                <stop offset="80%" stopColor="#B7E51D" />
                <stop offset="100%" stopColor="#FFD900" />
              </>
            )}
          </linearGradient>

          <linearGradient id="twinFaceGrad" x1="60" y1="40" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#8ED13F" />
                <stop offset="50%" stopColor="#168F3B" />
                <stop offset="100%" stopColor="#0B7A32" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FFFDF5" />
                <stop offset="50%" stopColor="#E8F51A" />
                <stop offset="100%" stopColor="#B7E51D" />
              </>
            )}
          </linearGradient>

          <linearGradient id="twinHairGrad" x1="40" y1="20" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#B7E51D" />
                <stop offset="50%" stopColor="#D5F51C" />
                <stop offset="100%" stopColor="#FFD900" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#63C63D" />
                <stop offset="50%" stopColor="#B7E51D" />
                <stop offset="100%" stopColor="#FFD900" />
              </>
            )}
          </linearGradient>

          <linearGradient id="ringGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#168F3B" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#63C63D" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#B7E51D" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFD900" stopOpacity="0.95" />
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
          opacity="0.9"
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
          opacity="0.8"
        />

        {/* 3. 3D Student Torso & Hoodie */}
        <path
          d="M 50 160 C 50 120, 70 110, 100 110 C 130 110, 150 120, 150 160 C 150 180, 135 190, 100 190 C 65 190, 50 180, 50 160 Z"
          fill="url(#twinBodyGrad)"
          opacity="0.95"
        />

        {/* Zipper & Collar Accent Lines */}
        <path
          d="M 80 115 L 100 145 L 120 115"
          stroke={isDark ? '#B7E51D' : '#168F3B'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="100" y1="145" x2="100" y2="185" stroke="#FFD900" strokeWidth="3" strokeDasharray="4 3" />

        {/* 4. Head Sphere Base */}
        <circle cx="100" cy="78" r="38" fill="url(#twinFaceGrad)" />
        <circle cx="100" cy="78" r="38" stroke="url(#ringGrad)" strokeWidth="2.5" opacity="0.9" />

        {/* 5. Hair Style Personalization */}
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

        {/* 6. Smart Visor */}
        <rect
          x="74"
          y="68"
          width="52"
          height="18"
          rx="9"
          fill={isDark ? '#040A06' : '#0F172A'}
          stroke="#63C63D"
          strokeWidth="2.5"
        />
        <rect x="78" y="71" width="20" height="12" rx="6" fill="#B7E51D" opacity="0.85" />
        <rect x="102" y="71" width="20" height="12" rx="6" fill="#B7E51D" opacity="0.85" />
        <line x1="98" y1="77" x2="102" y2="77" stroke="#FFD900" strokeWidth="2" />

        {/* Eye Sparkles */}
        <circle cx="86" cy="76" r="2.5" fill="#FFF" className={animated ? 'animate-pulse' : ''} />
        <circle cx="110" cy="76" r="2.5" fill="#FFF" className={animated ? 'animate-pulse' : ''} />

        {/* Smile */}
        <path d="M 92 94 Q 100 100 108 94" stroke="#FFD900" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* 7. Neural Node Sparkles */}
        <g filter="url(#twinGlowFilter)">
          <circle cx="45" cy="60" r="4.5" fill="#36A852" className={animated ? 'animate-bounce' : ''} />
          <circle cx="155" cy="65" r="5" fill="#B7E51D" className={animated ? 'animate-pulse' : ''} />
          <circle cx="140" cy="140" r="4" fill="#FFD900" className={animated ? 'animate-ping' : ''} />
          <circle cx="55" cy="135" r="4.5" fill="#63C63D" />
        </g>
      </svg>
    </div>
  );
}
