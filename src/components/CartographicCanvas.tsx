'use client';
import React from 'react';

interface CartographicCanvasProps {
  title: string;
  year: number;
  empire: string;
  region: string;
  category?: string;
  visualStyle?: string;
  className?: string;
}

export default function CartographicCanvas({
  title,
  year,
  empire,
  region,
  category = 'Sacred & Biblical Topography',
  visualStyle = 'parchment',
  className = ''
}: CartographicCanvasProps) {
  const formattedYear = year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;

  const themes: Record<string, { bgFrom: string; bgTo: string; border: string; accent: string }> = {
    egyptian: { bgFrom: '#2c1e11', bgTo: '#17100a', border: '#d97706', accent: '#fbbf24' },
    babylonian: { bgFrom: '#1c1917', bgTo: '#0c0a09', border: '#3b82f6', accent: '#60a5fa' },
    roman: { bgFrom: '#271010', bgTo: '#120707', border: '#ef4444', accent: '#fca5a5' },
    greek: { bgFrom: '#0f172a', bgTo: '#020617', border: '#06b6d4', accent: '#67e8f9' },
    byzantine: { bgFrom: '#2a122e', bgTo: '#120714', border: '#a855f7', accent: '#e9d5ff' },
    persian: { bgFrom: '#1e293b', bgTo: '#0f172a', border: '#eab308', accent: '#fef08a' },
    medieval: { bgFrom: '#281d18', bgTo: '#140d0a', border: '#d97706', accent: '#fde68a' },
    parchment: { bgFrom: '#26201b', bgTo: '#14110e', border: '#f59e0b', accent: '#fef3c7' }
  };

  const currentTheme = themes[visualStyle] || themes.parchment;

  return (
    <div className={`relative w-full h-full min-h-[220px] bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex flex-col justify-between p-4 overflow-hidden select-none font-serif ${className}`}>
      {/* Background Cartographic SVG Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${title.replace(/[^a-zA-Z0-9]/g, '-')}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={currentTheme.accent} strokeWidth="0.5" strokeDasharray="2,2" />
          </pattern>
        </defs>
        
        {/* Grid lines */}
        <rect width="100%" height="100%" fill={`url(#grid-${title.replace(/[^a-zA-Z0-9]/g, '-')})`} />
        
        {/* Topographic Lines & Coastline Simulation */}
        <path d="M -20,80 Q 80,120 180,60 T 380,140 T 580,90 T 800,160" fill="none" stroke={currentTheme.accent} strokeWidth="1" opacity="0.4" />
        <path d="M -20,110 Q 90,150 190,90 T 390,170 T 590,120 T 800,190" fill="none" stroke={currentTheme.accent} strokeWidth="0.75" opacity="0.3" />

        {/* Mountain Range Sketches */}
        <g stroke={currentTheme.accent} strokeWidth="1" fill="none" opacity="0.35">
          <path d="M 60,70 L 75,45 L 90,70 M 80,70 L 95,50 L 110,70 M 100,70 L 115,40 L 130,70" />
          <path d="M 220,180 L 235,155 L 250,180 M 240,180 L 255,160 L 270,180" />
          <path d="M 420,80 L 435,55 L 450,80 M 440,80 L 455,60 L 470,80" />
        </g>

        {/* Nautical Compass Rose */}
        <g transform="translate(320, 65)" opacity="0.35">
          <circle cx="0" cy="0" r="26" stroke={currentTheme.accent} strokeWidth="1" fill="none" />
          <path d="M 0,-26 L 5,-5 L 26,0 L 5,5 L 0,26 L -5,5 L -26,0 L -5,-5 Z" fill={currentTheme.accent} opacity="0.6" />
          <text x="0" y="-31" fill={currentTheme.accent} fontSize="9" textAnchor="middle" fontWeight="bold">N</text>
        </g>
      </svg>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between text-xs tracking-widest uppercase">
        <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur border border-neutral-700/60 text-neutral-300 font-sans font-medium">
          {region}
        </span>
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 backdrop-blur border border-amber-500/30 font-sans font-bold">
          {formattedYear}
        </span>
      </div>

      {/* Center Decorative Title Banner */}
      <div className="relative z-10 my-auto text-center py-2 px-3 border-y border-neutral-800/80 bg-neutral-950/70 backdrop-blur-sm">
        <h4 className="text-base md:text-lg font-serif text-amber-100/90 font-bold tracking-wide drop-shadow-md leading-tight">
          {title}
        </h4>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <span className="text-[11px] font-sans text-neutral-400 tracking-wider uppercase">{empire}</span>
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 font-sans">
        <span className="truncate max-w-[70%] text-neutral-300/80 italic">{category}</span>
        <div className="flex items-center gap-1 text-amber-400/80">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="uppercase text-[10px] tracking-wider font-semibold">Cartography</span>
        </div>
      </div>
    </div>
  );
}
