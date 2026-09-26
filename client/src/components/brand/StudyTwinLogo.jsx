import React from 'react';

/**
 * StudyTwin AI - Original Upgraded Brand Logo (Requirement 22)
 * Concept: Human Silhouette + Digital Twin + Neural Graph + Learning Network
 * Color Palette: Teal (#18C5C0), Purple (#6A35B8), Magenta (#9D1985), Yellow (#FFD447), Orange (#FF8500)
 */
export default function StudyTwinLogo({
  variant = 'full', // 'full' | 'compact' | 'favicon' | 'hero'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  animated = true,
  showTagline = false,
  className = ''
}) {
  const sizeMap = {
    sm: { symbol: 'w-7 h-7', text: 'text-sm', subText: 'text-[9px]', gap: 'gap-2' },
    md: { symbol: 'w-10 h-10', text: 'text-lg', subText: 'text-[10px]', gap: 'gap-2.5' },
    lg: { symbol: 'w-14 h-14', text: 'text-2xl', subText: 'text-xs', gap: 'gap-3.5' },
    xl: { symbol: 'w-20 h-20', text: 'text-3xl', subText: 'text-sm', gap: 'gap-4' },
    hero: { symbol: 'w-28 h-28 sm:w-36 sm:h-36', text: 'text-4xl sm:text-5xl', subText: 'text-base', gap: 'gap-5' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const SymbolSVG = (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${currentSize.symbol} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_20px_rgba(24,197,192,0.4)]"
        aria-label="StudyTwin AI Logo Symbol"
      >
        <defs>
          {/* Brand Palette Gradients */}
          <linearGradient id="humanGrad" x1="10" y1="20" x2="50" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD447" />
            <stop offset="100%" stopColor="#FF8500" />
          </linearGradient>

          <linearGradient id="twinGrad" x1="60" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#18C5C0" />
            <stop offset="50%" stopColor="#6A35B8" />
            <stop offset="100%" stopColor="#9D1985" />
          </linearGradient>

          <linearGradient id="streamGrad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD447" />
            <stop offset="35%" stopColor="#FF8500" />
            <stop offset="70%" stopColor="#18C5C0" />
            <stop offset="100%" stopColor="#9D1985" />
          </linearGradient>

          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbiting Learning Network Ring */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="url(#streamGrad)"
          strokeWidth="2.5"
          strokeDasharray="10 6 18 6"
          className={animated ? 'animate-[spin_25s_linear_infinite] origin-center' : ''}
          opacity="0.8"
        />

        {/* 1. Human Profile Silhouette (Left) */}
        <path
          d="M 46 32 C 34 32, 26 40, 26 52 C 26 62, 34 68, 42 70 C 34 74, 24 82, 22 96 H 48 L 48 84 C 48 76, 52 70, 52 60 C 52 48, 52 32, 46 32 Z"
          fill="url(#humanGrad)"
          opacity="0.95"
        />
        <circle cx="41" cy="46" r="3.5" fill="#FFF" opacity="0.9" />

        {/* 2. Neural Data Stream & Flow Particles (Middle) */}
        <path
          d="M 44 46 Q 56 36 68 46 M 46 60 H 72 M 44 74 Q 58 84 72 74"
          stroke="url(#streamGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          className={animated ? 'animate-[dash_3s_linear_infinite]' : ''}
        />

        {animated && (
          <>
            <circle cx="52" cy="46" r="2.5" fill="#FFD447" className="animate-ping" opacity="0.9" />
            <circle cx="60" cy="60" r="3" fill="#18C5C0" className="animate-pulse" />
            <circle cx="66" cy="74" r="2.5" fill="#9D1985" className="animate-ping" opacity="0.9" />
          </>
        )}

        {/* 3. Digital Twin Neural Mesh (Right) */}
        <path
          d="M 72 32 C 84 32, 94 40, 94 52 C 94 62, 86 68, 78 70 C 86 74, 96 82, 98 96 H 72 L 72 84 C 72 76, 68 70, 68 60 C 68 48, 68 32, 72 32 Z"
          fill="url(#twinGrad)"
          opacity="0.35"
        />

        {/* Neural Circuit Lines */}
        <g stroke="url(#twinGrad)" strokeWidth="2" strokeLinecap="round">
          <line x1="72" y1="36" x2="88" y2="42" />
          <line x1="88" y1="42" x2="94" y2="54" />
          <line x1="88" y1="42" x2="76" y2="52" />
          <line x1="76" y1="52" x2="86" y2="68" />
          <line x1="86" y1="68" x2="96" y2="82" />
        </g>

        {/* Glowing Neural Network Nodes */}
        <g filter="url(#logoGlow)">
          <circle cx="72" cy="36" r="3.5" fill="#6A35B8" className={animated ? 'animate-pulse' : ''} />
          <circle cx="88" cy="42" r="4" fill="#9D1985" />
          <circle cx="94" cy="54" r="3.5" fill="#F51F62" />
          <circle cx="76" cy="52" r="4.5" fill="#18C5C0" className={animated ? 'animate-pulse' : ''} />
          <circle cx="86" cy="68" r="4" fill="#FF8500" />
          <circle cx="96" cy="82" r="3.5" fill="#FFD447" />
        </g>

        {/* Rising Learning Mastery Curve */}
        <path
          d="M 30 84 Q 50 82, 65 65 T 100 38"
          stroke="url(#streamGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#logoGlow)"
        />
        <circle cx="100" cy="38" r="4" fill="#FFF" className={animated ? 'animate-ping' : ''} />
      </svg>
    </div>
  );

  if (variant === 'compact' || variant === 'favicon') {
    return SymbolSVG;
  }

  return (
    <div className={`inline-flex items-center ${currentSize.gap} group cursor-pointer select-none`}>
      {SymbolSVG}

      <div className="flex flex-col justify-center">
        <div className="flex items-center space-x-1.5">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white font-sans ${currentSize.text}`}>
            Study<span className="bg-gradient-to-r from-teal-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Twin</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-teal-500 via-purple-600 to-pink-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md shadow-teal-500/25">
            AI
          </span>
        </div>

        {(showTagline || variant === 'hero') && (
          <span className={`font-semibold text-slate-500 dark:text-slate-400 tracking-wide ${currentSize.subText}`}>
            Personal Digital Twin Engine
          </span>
        )}
      </div>
    </div>
  );
}
