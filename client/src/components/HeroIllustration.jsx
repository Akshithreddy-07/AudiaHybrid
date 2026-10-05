import React from 'react';

/**
 * HeroIllustration Component
 * Custom vector artwork depicting RF waves and Optical transmission across a landscape.
 *
 * NOTE: To replace this vector artwork with a photograph of your prototype hardware,
 * uncomment the image tag below and place your photo at `src/assets/hero.jpg`.
 */
export default function HeroIllustration({ className = '' }) {
  return (
    <div className={`relative w-full h-full min-h-[380px] lg:min-h-[520px] rounded-panel overflow-hidden bg-gradient-to-b from-sky-blue via-sky-mid to-sky-light select-none ${className}`}>
      {/* =========================================================================
          PROTOTYPE HARDWARE PHOTO SLOT:
          Uncomment the line below when you have a real photo of your breadboard prototype:
          <img src="/src/assets/hero.jpg" alt="AudiaHybrid Prototype Hardware" className="absolute inset-0 w-full h-full object-cover z-0" />
         ========================================================================= */}

      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Soft Sun Glow */}
        <circle cx="680" cy="120" r="90" fill="#FFFFFF" opacity="0.4" />
        <circle cx="680" cy="120" r="50" fill="#FFFFFF" opacity="0.6" />

        {/* Soft White Cloud Formations */}
        <g opacity="0.85">
          <ellipse cx="160" cy="110" rx="90" ry="32" fill="#FFFFFF" />
          <ellipse cx="210" cy="95" rx="55" ry="38" fill="#FFFFFF" />
          <ellipse cx="130" cy="105" rx="50" ry="30" fill="#FFFFFF" />

          <ellipse cx="540" cy="160" rx="100" ry="34" fill="#FFFFFF" />
          <ellipse cx="590" cy="145" rx="60" ry="38" fill="#FFFFFF" />
          <ellipse cx="500" cy="155" rx="55" ry="30" fill="#FFFFFF" />
        </g>

        {/* Rolling Hills Background */}
        <path
          d="M-50 490 Q 180 430, 420 470 T 850 440 L 850 650 L -50 650 Z"
          fill="#D6E8D5"
        />
        <path
          d="M-50 520 Q 220 480, 500 520 T 850 490 L 850 650 L -50 650 Z"
          fill="#BEDBBF"
        />

        {/* =================================================================== */}
        {/* TRANSMITTER UNIT (Lecturer Side - Left)                             */}
        {/* =================================================================== */}
        <g transform="translate(110, 360)">
          {/* Base Platform */}
          <rect x="0" y="70" width="100" height="14" rx="7" fill="#0B0B0C" />
          {/* Main Tx Enclosure */}
          <rect x="15" y="10" width="70" height="60" rx="8" fill="#FFFFFF" stroke="#0B0B0C" strokeWidth="3" />
          {/* Antenna Rod */}
          <line x1="30" y1="10" x2="30" y2="-30" stroke="#0B0B0C" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="30" cy="-32" r="5" fill="#2F6FED" />
          {/* Optical LED Emitter Cone */}
          <polygon points="65,22 82,15 82,45 65,38" fill="#F2A33A" />
          <circle cx="65" cy="30" r="7" fill="#0B0B0C" />
          <circle cx="65" cy="30" r="4" fill="#F2A33A" />
          {/* Label */}
          <rect x="25" y="48" width="50" height="14" rx="4" fill="#F5F5F3" />
          <text x="50" y="58" fontSize="8" fontWeight="700" fill="#0B0B0C" textAnchor="middle">TX UNIT</text>
        </g>

        {/* =================================================================== */}
        {/* RECEIVER UNIT (Listener Side - Right)                               */}
        {/* =================================================================== */}
        <g transform="translate(590, 350)">
          {/* Base Platform */}
          <rect x="0" y="80" width="100" height="14" rx="7" fill="#0B0B0C" />
          {/* Main Rx Enclosure */}
          <rect x="15" y="20" width="70" height="60" rx="8" fill="#FFFFFF" stroke="#0B0B0C" strokeWidth="3" />
          {/* Tuned Ferrite Antenna Coil Icon */}
          <line x1="35" y1="20" x2="35" y2="-20" stroke="#0B0B0C" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="35" cy="-22" r="5" fill="#2F6FED" />
          {/* BPW34 Photodiode Window */}
          <rect x="15" y="32" width="14" height="18" rx="3" fill="#F2A33A" stroke="#0B0B0C" strokeWidth="2" />
          {/* Headphone Output Jack */}
          <circle cx="65" cy="40" r="6" fill="#0B0B0C" />
          <circle cx="65" cy="40" r="3" fill="#C6F36B" />
          {/* Label */}
          <rect x="25" y="58" width="50" height="14" rx="4" fill="#F5F5F3" />
          <text x="50" y="68" fontSize="8" fontWeight="700" fill="#0B0B0C" textAnchor="middle">RX UNIT</text>
        </g>

        {/* =================================================================== */}
        {/* DUAL TRANSMISSION BEAMS / CHANNELS                                  */}
        {/* =================================================================== */}
        {/* 1. RF Electromagnetic Waves (Blue Curved Arcs) */}
        <g stroke="#2F6FED" strokeWidth="3.5" fill="none" strokeLinecap="round">
          <path d="M 140 328 Q 360 210 625 328" strokeDasharray="8 8" opacity="0.9" />
          <path d="M 140 310 Q 360 180 625 310" opacity="0.65" />
          <path d="M 140 290 Q 360 150 625 290" opacity="0.4" />
        </g>

        {/* 2. Optical Light Beam (Amber Straight Dashed Ray) */}
        <g>
          <polygon points="192 390, 605 382, 605 402, 192 390" fill="url(#opticalBeamGrad)" opacity="0.4" />
          <line x1="192" y1="390" x2="605" y2="392" stroke="#F2A33A" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
        </g>

        {/* Defs */}
        <defs>
          <linearGradient id="opticalBeamGrad" x1="192" y1="390" x2="605" y2="392" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F2A33A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F2A33A" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
