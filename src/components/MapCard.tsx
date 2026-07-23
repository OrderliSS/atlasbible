'use client';
import React, { useState } from 'react';
import CartographicCanvas from './CartographicCanvas';
import { MapData } from '../data/maps';

interface MapCardProps {
  map: MapData;
}

const MapCard = ({ map }: MapCardProps) => {
  const [imageError, setImageError] = useState(false);
  const isPlaceholder = !map.imageUrl || map.imageUrl.includes('placehold.co') || imageError;

  return (
    <div className="group relative break-inside-avoid mb-6 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-950/40 cursor-pointer flex flex-col">
      <div className="relative w-full overflow-hidden min-h-[220px]">
        {isPlaceholder ? (
          <CartographicCanvas 
            title={map.title}
            year={map.year}
            empire={map.empire}
            region={map.region}
            category={map.category}
            visualStyle={map.visualStyle}
          />
        ) : (
          <div className="relative w-full h-[240px] bg-neutral-950">
            <img
              src={map.imageUrl}
              alt={map.title}
              referrerPolicy="no-referrer"
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between bg-neutral-900/90 border-t border-neutral-800/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {map.year < 0 ? `${Math.abs(map.year)} BC` : `${map.year} AD`}
            </span>
            {map.biblicalContext && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                Biblical Record
              </span>
            )}
          </div>

          <h3 className="text-lg font-serif text-white font-medium group-hover:text-amber-200 transition-colors leading-snug mb-2">
            {map.title}
          </h3>

          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
            {map.overview || map.description}
          </p>
        </div>

        <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 font-sans">
          <span className="truncate max-w-[65%] font-medium text-neutral-300">{map.empire}</span>
          <span className="text-[10px] text-amber-500/90 font-medium tracking-wide uppercase group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Explore
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
