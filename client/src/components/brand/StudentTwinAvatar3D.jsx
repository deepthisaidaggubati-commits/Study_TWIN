import React from 'react';

/**
 * StudentTwinAvatar3D - Small 3D-Style Digital Student Twin Character Visual
 * 
 * Features:
 * - Stylized 3D digital student avatar representation
 * - Gender Personalization (Female / Male / Neutral)
 * - Animated neural circuit edges (Teal -> Purple -> Pink)
 * - Orbiting holographic rings & floating learning nodes
 * - Idle floating, subtle breathing, glowing eye/neural identity
 */
export default function StudentTwinAvatar3D({
  gender = 'neutral', // 'female' | 'male' | 'neutral'
  size = 'md', // 'sm' | 'md' | 'lg' | 'hero'
  animated = true,
  status = 'active', // 'active' | 'synced' | 'attentive' | 'celebrating'
  className = ''
}) {
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

  return (
    <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
      {/* 1. Ambient Background Aura & Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/25 via-fuchsia-500/25 to-amber-400/20 blur-2xl animate-[pulse_4s_ease-in-out_infinite]" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_12px_24px_rgba(24,197,192,0.35)] relative z-10 ${
          animated ? 'animate-[float_6s_ease-in-out_infinite]' : ''
        }`}
        aria-label="3D AI Student Digital Twin"
      >
        <defs>
          {/* Gradient Palette */}
          <linearGradient id="twinBodyGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#18C5C0" />
            <stop offset="35%" stopColor="#6A35B8" />
            <stop offset="70%" stopColor="#9D1985" />
            <stop offset="100%" stopColor="#FF8500" />
          </linearGradient>

          <linearGradient id="twinFaceGrad" x1="60" y1="40" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4FD7D0" />
            <stop offset="50%" stopColor="#22266F" />
            <stop offset="100%" stopColor="#6A35B8" />
          </linearGradient>

          <linearGradient id="twinHairGrad" x1="40" y1="20" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD447" />
            <stop offset="50%" stopColor="#FF8500" />
            <stop offset="100%" stopColor="#F51F62" />
          </linearGradient>

          <linearGradient id="ringGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#18C5C0" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F51F62" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFD447" stopOpacity="0.9" />
          </linearGradient>

          <filter id="twinGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 2. Outer Holographic Orbiting Ring */}
        <ellipse
          cx="100"
          cy="155"
          rx="75"
          ry="22"
          stroke="url(#ringGrad)"
          strokeWidth="3"
          strokeDasharray="12 8 20 8"
          className={animated ? 'animate-[spin_20s_linear_infinite] origin-center' : ''}
          opacity="0.8"
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
          opacity="0.6"
        />

        {/* 3. 3D Student Torso & Hoodie / Jacket */}
        <path
          d="M 50 160 C 50 120, 70 110, 100 110 C 130 110, 150 120, 150 160 C 150 180, 135 190, 100 190 C 65 190, 50 180, 50 160 Z"
          fill="url(#twinBodyGrad)"
          opacity="0.95"
        />

        {/* Collar & Tech Jacket Lines */}
        <path
          d="M 80 115 L 100 145 L 120 115"
          stroke="#4FD7D0"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="100" y1="145" x2="100" y2="185" stroke="#F51F62" strokeWidth="3" strokeDasharray="4 3" />

        {/* 4. Head & Face Base (Cute 3D Stylized Sphere) */}
        <circle cx="100" cy="78" r="38" fill="url(#twinFaceGrad)" />
        <circle cx="100" cy="78" r="38" stroke="url(#ringGrad)" strokeWidth="2.5" opacity="0.85" />

        {/* 5. Hair Style Personalization (Female vs Male vs Neutral) */}
        {isFemale ? (
          // Feminine Twin Hair (Flowing Twin Pigtails / Wavy Cut with Tech Highlights)
          <g fill="url(#twinHairGrad)">
            <path d="M 62 70 C 55 45, 80 32, 100 32 C 120 32, 145 45, 138 70 C 130 50, 115 42, 100 42 C 85 42, 70 50, 62 70 Z" />
            <path d="M 60 70 C 45 80, 42 105, 52 125 C 56 105, 62 85, 66 74 Z" />
            <path d="M 140 70 C 155 80, 158 105, 148 125 C 144 105, 138 85, 134 74 Z" />
          </g>
        ) : isMale ? (
          // Masculine Twin Hair (Modern Layered Crop with Tech Spikes)
          <path
            d="M 64 68 C 60 42, 78 30, 100 30 C 122 30, 140 42, 136 68 C 130 48, 116 40, 100 40 C 84 40, 70 48, 64 68 Z M 85 30 L 92 22 L 100 28 L 108 20 L 115 30 Z"
            fill="url(#twinHairGrad)"
          />
        ) : (
          // Neutral Twin Digital Headgear / Sleek Bob
          <path
            d="M 63 68 C 58 40, 80 30, 100 30 C 120 30, 142 40, 137 68 C 128 48, 114 42, 100 42 C 86 42, 72 48, 63 68 Z"
            fill="url(#twinHairGrad)"
          />
        )}

        {/* 6. Smart Glasses / AR Student Visor */}
        <rect x="74" y="68" width="52" height="18" rx="9" fill="#070812" stroke="#18C5C0" strokeWidth="2.5" />
        <rect x="78" y="71" width="20" height="12" rx="6" fill="#4FD7D0" opacity="0.6" />
        <rect x="102" y="71" width="20" height="12" rx="6" fill="#4FD7D0" opacity="0.6" />
        <line x1="98" y1="77" x2="102" y2="77" stroke="#FFD447" strokeWidth="2" />

        {/* Eyes Light Sparkles (Inside Glasses) */}
        <circle cx="86" cy="76" r="2.5" fill="#FFF" className={animated ? 'animate-pulse' : ''} />
        <circle cx="110" cy="76" r="2.5" fill="#FFF" className={animated ? 'animate-pulse' : ''} />

        {/* Friendly Student Smile */}
        <path d="M 92 94 Q 100 100 108 94" stroke="#FFD447" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* 7. Neural Node Connections Floating Around Avatar */}
        <g filter="url(#twinGlow)">
          <circle cx="45" cy="60" r="4.5" fill="#18C5C0" className={animated ? 'animate-bounce' : ''} />
          <circle cx="155" cy="65" r="5" fill="#F51F62" className={animated ? 'animate-pulse' : ''} />
          <circle cx="140" cy="140" r="4" fill="#FFD447" className={animated ? 'animate-ping' : ''} />
          <circle cx="55" cy="135" r="4.5" fill="#9D1985" />
        </g>

        {/* Connecting Data Network Beams */}
        <path d="M 45 60 L 65 72 M 155 65 L 135 74 M 140 140 L 125 130" stroke="#4FD7D0" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}
