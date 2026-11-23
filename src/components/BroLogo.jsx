import React from 'react';

/**
 * BRO AI Bespoke Brand Logo
 * Precision Vector Symbol: Geometric Radar Crosshair & Price/Transit Vector
 * Built with pure architectural lines, zero sloppy gradients or Gaussian blurs.
 */
export default function BroLogo({ size = 32, className = '', showWordmark = false }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        {/* Dark Obsidian Geometric Rounded Tile */}
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="10"
          fill="#111111"
          stroke="#262626"
          strokeWidth="1.5"
        />

        {/* Radar Range Ring (Subtle Hairline) */}
        <circle
          cx="20"
          cy="20"
          r="12"
          stroke="#333333"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />

        {/* Monogram 'B' Spine - Architectural Pillar */}
        <rect
          x="12"
          y="11"
          width="3.5"
          height="18"
          rx="1.75"
          fill="#FFFFFF"
        />

        {/* Top Loop: Shopping Radar Arc */}
        <path
          d="M14 11H21.5C24.5376 11 27 13.0147 27 15.5C27 17.9853 24.5376 20 21.5 20H14"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Loop: Forward Transit Sweep */}
        <path
          d="M14 20H23C26.3137 20 29 22.2386 29 25C29 27.7614 26.3137 30 23 30H14"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Verified Radar Beacon (Vivid Emerald Target) */}
        <circle
          cx="20"
          cy="20"
          r="2.2"
          fill="#008738"
        />
        <circle
          cx="20"
          cy="20"
          r="4.2"
          stroke="#008738"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-black tracking-tight text-[17px] text-[#111111]">
              BRO
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#008738] text-white tracking-wider uppercase">
              AI
            </span>
          </div>
          <span className="text-[8.5px] font-medium text-[#777777] tracking-wider uppercase mt-1">
            Price & Transit Radar
          </span>
        </div>
      )}
    </div>
  );
}
