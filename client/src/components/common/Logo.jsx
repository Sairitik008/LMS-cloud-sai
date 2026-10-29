import React from 'react';

const Logo = ({
  className = "w-9 h-9",
  withText = true,
  textColor = "text-white",
  textSize = "text-lg",
  showBadge = true,
  _subtitle = null,
  _philosophicalTagline = false
}) => {
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* 
        Sleek Modern Engineering Icon:
        Isometric Hex-Cloud Glyph with Layered Computational Nodes
      */}
      <div className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}>
        {/* Subtle Ambient Specular Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-sky-500/30 via-indigo-500/20 to-amber-500/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]"
        >
          <defs>
            {/* Primary Electric Gradient */}
            <linearGradient id="saiElectric" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>

            {/* Specular Edge Highlight */}
            <linearGradient id="saiEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
            </linearGradient>

            {/* Accent Gold Core Node */}
            <linearGradient id="saiGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Dark Plate Background */}
            <linearGradient id="saiPlate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#070C18" />
            </linearGradient>
          </defs>

          {/* Precision Squircle Plate */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="10"
            fill="url(#saiPlate)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.2"
          />

          {/* Geometric Cloud / Hexagonal Compiler Glyph */}
          {/* Top Left Prism Facet */}
          <path
            d="M 20,8 L 31,14 L 31,21 L 20,15 Z"
            fill="url(#saiElectric)"
            opacity="0.9"
          />
          {/* Top Right Prism Facet */}
          <path
            d="M 20,8 L 9,14 L 9,21 L 20,15 Z"
            fill="url(#saiElectric)"
            opacity="0.7"
          />
          {/* Center Computational Core (Forward Arrow / Angle Vector) */}
          <path
            d="M 20,16 L 29,21 L 29,28 L 20,33 L 11,28 L 11,21 Z"
            fill="none"
            stroke="url(#saiEdge)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner Quantum Code Chevron: ">" */}
          <path
            d="M 18,21 L 23,24.5 L 18,28"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Golden Pulsing Beacon Dot */}
          <circle cx="26" cy="24.5" r="1.5" fill="url(#saiGold)" />
        </svg>
      </div>

      {/* Typography: Professional, Architectural, Crisp */}
      {withText && (
        <div className="flex items-center gap-2">
          <span className={`font-extrabold tracking-tight ${textSize} ${textColor} leading-none flex items-center`}>
            Sai<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300 font-black">Cloud</span>
          </span>
          {showBadge && (
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/25 rounded-full leading-none flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LMS
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
