import React from 'react';

const Logo = ({
  className = "w-10 h-10",
  withText = true,
  textColor = "text-textPrimary",
  textSize = "text-xl",
  showBadge = true,
  subtitle = null,
  philosophicalTagline = false
}) => {
  return (
    <div className="flex items-center gap-3.5 select-none group">
      {/* 
        Symbolic Emblem:
        - Open Book: Learning & Knowledge (विद्या)
        - Ascending Flame: Hope & Aspiration (आशा / प्रकाश)
        - Dynamic Wings: Adaptation, Growth & Flight (अनुकूलन / प्रगति)
        - Circular Halo: Ideology, Purpose & Universal Harmony (विचारधारा)
      */}
      <div className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}>
        {/* Ambient Halo Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/25 via-sky-500/20 to-indigo-500/25 blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
        >
          <defs>
            {/* Radiant Solar Gold Gradient (Hope & Enlightenment) */}
            <linearGradient id="solarGold" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Electric Celestial Blue Gradient (Technology & Cloud Adaptation) */}
            <linearGradient id="celestialAzure" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            {/* Cyan Accent Gradient */}
            <linearGradient id="cyanFlame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="40%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>

            {/* Subtle Rim Glow */}
            <linearGradient id="haloRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.7" />
            </linearGradient>

            {/* Deep Obsidian Squircle Background */}
            <radialGradient id="bgDepth" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#111B33" />
              <stop offset="100%" stopColor="#070B14" />
            </radialGradient>
          </defs>

          {/* Squircle Foundation Plate */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#bgDepth)"
            stroke="url(#haloRim)"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />

          {/* 1. Halo of Ideology (Universal Harmony & Core Principles) */}
          <circle
            cx="50"
            cy="50"
            r="36"
            stroke="url(#celestialAzure)"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            opacity="0.4"
          />
          <circle
            cx="50"
            cy="50"
            r="31"
            stroke="url(#solarGold)"
            strokeWidth="1.2"
            opacity="0.25"
          />

          {/* 2. Wings of Adaptation (Agility, Growth, Rising from Challenges) */}
          {/* Left Wing Layers */}
          <path
            d="M 44,50 C 33,40 20,31 16,22 C 21,32 27,44 40,54 Z"
            fill="url(#solarGold)"
            opacity="0.95"
          />
          <path
            d="M 45,54 C 36,46 25,39 21,32 C 25,41 31,50 42,60 Z"
            fill="url(#celestialAzure)"
            opacity="0.85"
          />
          <path
            d="M 47,59 C 40,53 32,48 28,42 C 32,50 37,56 45,64 Z"
            fill="url(#solarGold)"
            opacity="0.7"
          />

          {/* Right Wing Layers */}
          <path
            d="M 56,50 C 67,40 80,31 84,22 C 79,32 73,44 60,54 Z"
            fill="url(#solarGold)"
            opacity="0.95"
          />
          <path
            d="M 55,54 C 64,46 75,39 79,32 C 75,41 69,50 58,60 Z"
            fill="url(#celestialAzure)"
            opacity="0.85"
          />
          <path
            d="M 53,59 C 60,53 68,48 72,42 C 68,50 63,56 55,64 Z"
            fill="url(#solarGold)"
            opacity="0.7"
          />

          {/* 3. The Open Book of Learning & Knowledge (विद्या Foundation) */}
          {/* Left Page Book Foundation */}
          <path
            d="M 50,65 C 40,64 26,58 19,48 L 22,46 C 31,54 42,60 50,61 Z"
            fill="url(#solarGold)"
          />
          <path
            d="M 50,65 C 40,64 27,61 19,53 C 24,63 36,73 50,78 Z"
            fill="url(#solarGold)"
            opacity="0.85"
          />

          {/* Right Page Book Foundation */}
          <path
            d="M 50,65 C 60,64 74,58 81,48 L 78,46 C 69,54 58,60 50,61 Z"
            fill="url(#solarGold)"
          />
          <path
            d="M 50,65 C 60,64 73,61 81,53 C 76,63 64,73 50,78 Z"
            fill="url(#solarGold)"
            opacity="0.85"
          />

          {/* Center Spine Accent */}
          <line x1="50" y1="59" x2="50" y2="78" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />

          {/* 4. The Ascending Flame of Hope & Enlightenment (Rising to the Sky) */}
          <path
            d="M 50,15 C 43,26 37,38 42,52 C 46,45 50,37 50,30 C 50,37 54,45 58,52 C 63,38 57,26 50,15 Z"
            fill="url(#cyanFlame)"
          />
          {/* Inner Radiant Light Tongue */}
          <path
            d="M 50,22 C 47,30 44,38 47,45 C 49,41 50,36 50,32 C 50,36 51,41 53,45 C 56,38 53,30 50,22 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />

          {/* 5. The Apex Beacon of Hope (Northern Star / Enlightenment Gem) */}
          <polygon
            points="50,8 51.8,12.5 56,13.5 51.8,14.5 50,19 48.2,14.5 44,13.5 48.2,12.5"
            fill="url(#solarGold)"
          />
          <circle cx="50" cy="13.5" r="1.5" fill="#FFFFFF" className="animate-ping" />
        </svg>
      </div>

      {/* Brand Typography - Clean, Modern, Elegant */}
      {withText && (
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight ${textSize} ${textColor} leading-none`}>
            Sai<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-300 to-indigo-300">Cloud</span>
          </span>
          {showBadge && (
            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-md leading-none flex items-center gap-1 shadow-sm">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              LMS
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
