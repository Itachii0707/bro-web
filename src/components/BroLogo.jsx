import React from 'react';

/**
 * BRO AI Bespoke Brand Logo
 * Geometric Monogram 'B' uniting Shopping Radar (Golden tag) & Commute Transit (Emerald road sweep)
 */
export default function BroLogo({ size = 32, className = '', showWordmark = false }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bro-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="bro-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="bro-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="bro-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Squircle Backdrop with subtle border */}
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="12"
          fill="url(#bro-bg)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Monogram 'B' Spine - Solid Architectural Anchor */}
        <rect x="11" y="10" width="5.5" height="28" rx="2.75" fill="#F8FAFC" />

        {/* Top Loop: Shopping Intelligence & Price Tag Aperture */}
        <path
          d="M14 10H25.5C29.642 10 33 13.134 33 17C33 20.866 29.642 24 25.5 24H14"
          stroke="url(#bro-gold)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Loop: Mobility Sweep & Transit Route Curve */}
        <path
          d="M14 24H27C31.418 24 35 27.582 35 32C35 36.418 31.418 40 27 40H14"
          stroke="url(#bro-emerald)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Radar Beacon Node */}
        <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" filter="url(#bro-glow)" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-black tracking-tight text-base text-[#1E293B]">BRO</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-white tracking-widest uppercase">
              AI
            </span>
          </div>
          <span className="text-[9px] font-medium text-[#64748B] tracking-wider uppercase">
            Radar & Arbitrage
          </span>
        </div>
      )}
    </div>
  );
}
