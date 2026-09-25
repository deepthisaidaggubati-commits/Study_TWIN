import React from 'react';

/**
 * StudyTwin AI - Original Brand Logo & Visual Identity Component
 * 
 * Concept: Human Silhouette (Left) + Digital Twin Neural Network / Graph (Right)
 * Palette: Charcoal (#08080D) + Violet (#8B5CF6) + Purple (#A855F7) + Magenta (#D946EF) + Gold/Orange (#F59E0B/#F97316) + Teal (#14B8A6)
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
      {/* Ambient background aura for hero/lg variants */}
      {(variant === 'hero' || size === 'xl' || size === 'lg') && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/30 via-fuchsia-500/20 to-amber-500/20 blur-xl animate-pulse -z-10" />
      )}

      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(139,92,246,0.4)]"
        aria-label="StudyTwin AI Logo Symbol"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="stHumanGrad" x1="10" y1="20" x2="50" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>

          <linearGradient id="stTwinGrad" x1="60" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>

          <linearGradient id="stGraphGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="stRingGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="stGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Transformation Ring */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="url(#stRingGrad)"
          strokeWidth="2.5"
          strokeDasharray="8 6 16 6"
          className={animated ? 'animate-[spin_40s_linear_infinite] origin-center' : ''}
          opacity="0.75"
        />

        {/* --- LEFT SIDE: HUMAN PROFILE SILHOUETTE --- */}
        <path
          d="M 46 32 C 34 32, 26 40, 26 52 C 26 62, 34 68, 42 70 C 34 74, 24 82, 22 96 H 48 L 48 84 C 48 76, 52 70, 52 60 C 52 48, 52 32, 46 32 Z"
          fill="url(#stHumanGrad)"
          opacity="0.95"
        />
        {/* Human Eye/Mind Identity Spark */}
        <circle cx="41" cy="46" r="3.5" fill="#FFF" opacity="0.9" />

        {/* --- CENTER: TRANSFORMATION DATA STREAM & PARTICLES --- */}
        <path
          d="M 44 46 Q 56 36 68 46 M 46 60 H 72 M 44 74 Q 58 84 72 74"
          stroke="url(#stGraphGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          className={animated ? 'animate-[dash_3s_linear_infinite]' : ''}
        />

        {/* Flow Particles */}
        {animated && (
          <>
            <circle cx="52" cy="46" r="2" fill="#F59E0B" className="animate-ping" opacity="0.8" />
            <circle cx="60" cy="60" r="2.5" fill="#D946EF" className="animate-pulse" />
            <circle cx="66" cy="74" r="2" fill="#14B8A6" className="animate-ping" opacity="0.8" />
          </>
        )}

        {/* --- RIGHT SIDE: DIGITAL TWIN NEURAL PROFILE --- */}
        {/* Abstract Digital Profile Mesh */}
        <path
          d="M 72 32 C 84 32, 94 40, 94 52 C 94 62, 86 68, 78 70 C 86 74, 96 82, 98 96 H 72 L 72 84 C 72 76, 68 70, 68 60 C 68 48, 68 32, 72 32 Z"
          fill="url(#stTwinGrad)"
          opacity="0.35"
        />

        {/* Neural Circuit Lines */}
        <g stroke="url(#stTwinGrad)" strokeWidth="2" strokeLinecap="round">
          <line x1="72" y1="36" x2="88" y2="42" />
          <line x1="88" y1="42" x2="94" y2="54" />
          <line x1="88" y1="42" x2="76" y2="52" />
          <line x1="76" y1="52" x2="86" y2="68" />
          <line x1="86" y1="68" x2="96" y2="82" />
          <line x1="76" y1="52" x2="68" y2="66" />
          <line x1="68" y1="66" x2="78" y2="88" />
        </g>

        {/* Illuminated Neural Network Nodes */}
        <g filter="url(#stGlow)">
          <circle cx="72" cy="36" r="3.5" fill="#A855F7" className={animated ? 'animate-pulse' : ''} />
          <circle cx="88" cy="42" r="4" fill="#D946EF" className={animated ? 'animate-bounce' : ''} />
          <circle cx="94" cy="54" r="3.5" fill="#EC4899" />
          <circle cx="76" cy="52" r="4.5" fill="#38BDF8" className={animated ? 'animate-pulse' : ''} />
          <circle cx="86" cy="68" r="4" fill="#14B8A6" />
          <circle cx="96" cy="82" r="3" fill="#F59E0B" />
          <circle cx="68" cy="66" r="3.5" fill="#D946EF" />
          <circle cx="78" cy="88" r="4" fill="#A855F7" className={animated ? 'animate-pulse' : ''} />
        </g>

        {/* RISING LEARNING TREND GRAPH INSIDE TWIN */}
        <path
          d="M 30 84 Q 50 82, 65 65 T 100 38"
          stroke="url(#stGraphGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#stGlow)"
        />
        <circle cx="100" cy="38" r="4.5" fill="#FFF" className={animated ? 'animate-ping' : ''} />
        <circle cx="100" cy="38" r="3" fill="#F59E0B" />
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
          <span className={`font-black tracking-tight text-white font-sans ${currentSize.text}`}>
            Study<span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">Twin</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md shadow-violet-600/30">
            AI
          </span>
        </div>

        {(showTagline || variant === 'hero') && (
          <span className={`font-medium text-slate-400 tracking-wide ${currentSize.subText}`}>
            Your AI Learning Twin
          </span>
        )}
      </div>
    </div>
  );
}
