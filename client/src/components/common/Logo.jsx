import React from 'react';

const Logo = ({
  className = "w-9 h-9",
  withText = true,
  textColor = "text-textPrimary",
  textSize = "text-xl",
  showBadge = true,
  subtitle = null
}) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Precision Geometric Mark */}
      <div className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/30 via-indigo-500/20 to-violet-500/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="relative w-full h-full drop-shadow-[0_2px_8px_rgba(14,165,233,0.35)]"
        >
          <defs>
            <linearGradient id="scGradientA" x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="scGradientB" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="scStrokeGlow" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Squircle Background Base */}
          <rect 
            x="3" 
            y="3" 
            width="42" 
            height="42" 
            rx="12" 
            fill="#0B1220" 
            stroke="url(#scStrokeGlow)" 
            strokeWidth="1.5" 
            strokeOpacity="0.4"
          />

          {/* Interlocking Ribbon "S" Monogram & Cloud Apex */}
          {/* Top Arc & Spire */}
          <path
            d="M24 10L35 17.5V24.5L24 18L13 24.5V17.5L24 10Z"
            fill="url(#scGradientA)"
          />
          {/* Mid Connecting Ribbon */}
          <path
            d="M13 24.5L24 31L35 24.5V29L24 35.5L13 29V24.5Z"
            fill="url(#scGradientB)"
            opacity="0.95"
          />
          {/* Bottom Foundation Vertex */}
          <path
            d="M16 32L24 37L32 32V35L24 40L16 35V32Z"
            fill="url(#scGradientA)"
            opacity="0.75"
          />

          {/* Luminous Core Vertex */}
          <circle cx="24" cy="18" r="2.2" fill="#FFFFFF" className="animate-pulse" />
          <circle cx="24" cy="31" r="1.8" fill="#38BDF8" />
        </svg>
      </div>

      {/* Brand Typography */}
      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight ${textSize} ${textColor} leading-none`}>
              Sai<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">Cloud</span>
            </span>
            {showBadge && (
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/25 rounded-md leading-none flex items-center gap-1 shadow-sm">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                LMS
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-[10px] font-semibold text-textMuted tracking-wider uppercase mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
