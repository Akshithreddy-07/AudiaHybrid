import React from 'react';

/**
 * LogoBadge component
 * Stylized analog sound wave transitioning into an optical beam on a deep indigo circular badge.
 */
export default function LogoBadge({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16 md:w-20 md:h-20 lg:w-[88px] lg:h-[88px]',
    lg: 'w-24 h-24',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-primary-dark text-white shadow-xl ring-4 ring-white/60 dark:ring-white/20 transition-transform duration-300 hover:scale-105 select-none ${sizeMap[size] || sizeMap.md} ${className}`}
      aria-label="AudiaHybrid Logo Badge"
      role="img"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-4/5 h-4/5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Analog Sound Waves (Left) */}
        <path
          d="M 18 50 Q 24 32, 30 50 T 42 50"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 12 50 Q 20 22, 28 50 T 44 50"
          stroke="#F59E6C"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.9"
          fill="none"
        />

        {/* Hybrid Bridge / Core Analog Node */}
        <circle cx="50" cy="50" r="5.5" fill="#F59E6C" />
        <circle cx="50" cy="50" r="9" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.65" />

        {/* Optical Light Beam / Ray (Right) */}
        <polygon
          points="53,47 86,34 86,66 53,53"
          fill="url(#badgeBeamGrad)"
          opacity="0.9"
        />
        <line
          x1="53"
          y1="50"
          x2="88"
          y2="50"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <line
          x1="55"
          y1="43"
          x2="84"
          y2="37"
          stroke="#F59E6C"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.85"
        />
        <line
          x1="55"
          y1="57"
          x2="84"
          y2="63"
          stroke="#F59E6C"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.85"
        />

        <defs>
          <linearGradient id="badgeBeamGrad" x1="53" y1="50" x2="88" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F59E6C" />
            <stop offset="100%" stopColor="#F59E6C" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
