import React from 'react';

const Logo = ({
  className = "w-8 h-8",
  withText = true,
  textColor = "text-white",
  textSize = "text-lg",
  showBadge = true,
  _subtitle = null,
  _philosophicalTagline = false
}) => {
  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      {/* 
        Clean, Human-Crafted Developer Tool Mark
        Solid geometric monogram with clean architectural lines - zero artificial blur or neon glows
      */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Base Container: Crisp, solid dark slate plate */}
          <rect
            x="1"
            y="1"
            width="30"
            height="30"
            rx="7"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1.2"
          />

          {/* Clean Geometric S / Cloud Layer in Trusted Engineering Blue */}
          {/* Top Bracket / Curve */}
          <path
            d="M 22 10 L 13 10 C 10.79 10 9 11.79 9 14 C 9 16.21 10.79 18 13 18 L 19 18 C 21.21 18 23 19.79 23 22 C 23 24.21 21.21 26 19 26 L 10 26"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Forward Angle Node (Code Vector Indicator) in Solid Crisp White */}
          <circle cx="22" cy="10" r="1.75" fill="#FFFFFF" />
          <circle cx="10" cy="26" r="1.75" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography: Solid, Authentic, High-Contrast */}
      {withText && (
        <div className="flex items-center gap-2">
          <span className={`font-bold tracking-tight ${textSize} ${textColor} leading-none`}>
            Sai<span className="text-blue-500 font-extrabold">Cloud</span>
          </span>
          {showBadge && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-wide bg-slate-800 text-slate-300 border border-slate-700 rounded leading-none">
              LMS
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
