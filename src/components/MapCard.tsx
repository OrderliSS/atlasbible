import React from 'react';
import Image from 'next/image';

interface MapCardProps {
  map: {
    id: string;
    title: string;
    imageUrl: string;
    year: number;
    empire: string;
  };
}

const MapCard = ({ map }: MapCardProps) => {
  return (
    <div className="group relative break-inside-avoid mb-6 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/20 cursor-pointer">
      <div className="relative w-full overflow-hidden" style={{ minHeight: '200px' }}>
        <Image
          src={map.imageUrl}
          alt={map.title}
          width={600}
          height={800}
          className="object-cover w-full h-auto transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-serif text-white font-medium mb-1 drop-shadow-md">
          {map.title}
        </h3>
        <div className="flex items-center space-x-3 text-sm">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 backdrop-blur-sm">
            {map.year < 0 ? `${Math.abs(map.year)} BC` : `${map.year} AD`}
          </span>
          <span className="text-neutral-300 font-medium drop-shadow-md">{map.empire}</span>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
