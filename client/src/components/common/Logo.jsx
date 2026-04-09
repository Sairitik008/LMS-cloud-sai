import React from 'react';

const Logo = ({ className = "w-8 h-8", withText = true, textColor = "text-textPrimary", textSize = "text-xl" }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" /> {/* Tailwind sky-400 */}
              <stop offset="100%" stopColor="#8b5cf6" /> {/* Tailwind violet-500 */}
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" fill="url(#logoGradient)" opacity="0.15" />
          <path fill="none" stroke="url(#logoGradient)" strokeWidth="6" strokeLinejoin="round" d="M50 18 L82 34 L50 50 L18 34 Z" filter="url(#glow)" />
          <path fill="none" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M18 50 L50 66 L82 50" />
          <path fill="none" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M18 66 L50 82 L82 66" />
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
        </svg>
      </div>
      {withText && (
        <span className={`font-black tracking-tighter ${textSize} ${textColor}`}>
          IT<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">-</span>LMS
        </span>
      )}
    </div>
  );
};

export default Logo;
