import React from 'react';

/**
 * Editorial LogoBadge component
 * Monochrome high-contrast badge representing analog sound waves transitioning to optical light.
 */
export default function LogoBadge({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-ink text-white dark:bg-white dark:text-ink shadow-subtle select-none ${sizeMap[size] || sizeMap.md} ${className}`}
      aria-label="AudiaHybrid Logo"
      role="img"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-3/5 h-3/5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Analog Sound Waves (Left) */}
        <path
          d="M 18 50 Q 24 30, 30 50 T 42 50"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Transition Node */}
        <circle cx="50" cy="50" r="5" fill="#C6F36B" />
        {/* Optical Light Beam (Right) */}
        <polygon
          points="54,48 84,34 84,66 54,52"
          fill="currentColor"
          opacity="0.9"
        />
        <line
          x1="54"
          y1="50"
          x2="84"
          y2="50"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
