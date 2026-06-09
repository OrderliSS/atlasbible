import React from 'react';
import MapCard from './MapCard';

// Expanded dataset based on user requests: Ancient, Tribal, Continental, and Timeline.
const MOCK_MAPS = [
  // --- ANCIENT MAPS ---
  { 
    id: '1', 
    title: 'Babylonian Map of the World (Imago Mundi)', 
    imageUrl: 'https://images.unsplash.com/photo-1544627043-34e8035ed881?auto=format&fit=crop&w=800&q=80', 
    year: -600, 
    empire: 'Babylonian',
    collection: 'Ancient'
  },
  { 
    id: '2', 
    title: 'World Map according to Herodotus', 
    imageUrl: 'https://images.unsplash.com/photo-1589408665042-5e4544d6da3e?auto=format&fit=crop&w=800&q=80', 
    year: -450, 
    empire: 'Ancient Greece',
    collection: 'Ancient'
  },
  { 
    id: '3', 
    title: 'Nomes of Ancient Egypt', 
    imageUrl: 'https://images.unsplash.com/photo-1505298818228-56eb022f4705?auto=format&fit=crop&w=800&q=80', 
    year: -1500, 
    empire: 'Ancient Egypt',
    collection: 'Ancient'
  },
  { 
    id: '4', 
    title: 'Canaanite City-States & Levant', 
    imageUrl: 'https://images.unsplash.com/photo-1628157745778-2c2de1c098eb?auto=format&fit=crop&w=800&q=80', 
    year: -1200, 
    empire: 'Canaanites',
    collection: 'Ancient'
  },
  { 
    id: '5', 
    title: 'Kingdom of Samaria & Judah', 
    imageUrl: 'https://images.unsplash.com/photo-1577907572771-46ecf1f3e589?auto=format&fit=crop&w=800&q=80', 
    year: -850, 
    empire: 'Israelites',
    collection: 'Ancient'
  },

  // --- TRIBAL MAPS ---
  { 
    id: '6', 
    title: 'Celtic Tribes of Europe', 
    imageUrl: 'https://images.unsplash.com/photo-1605335198086-4bb695f269a8?auto=format&fit=crop&w=800&q=80', 
    year: -50, 
    empire: 'Celtic Tribes',
    collection: 'Tribal'
  },
  { 
    id: '7', 
    title: 'Anglo-Saxon Heptarchy', 
    imageUrl: 'https://images.unsplash.com/photo-1584384976766-3d2b27072a2e?auto=format&fit=crop&w=800&q=80', 
    year: 800, 
    empire: 'Anglo-Saxons',
    collection: 'Tribal'
  },

  // --- CONTINENTAL / REGIONAL MAPS ---
  { 
    id: '8', 
    title: 'Iberian Peninsula before Roman Conquest', 
    imageUrl: 'https://images.unsplash.com/photo-1596541571216-92f70b3cf17c?auto=format&fit=crop&w=800&q=80', 
    year: -218, 
    empire: 'Iberians/Carthaginians',
    collection: 'Continental'
  },
  { 
    id: '9', 
    title: 'Pre-Islamic Arabian Peninsula', 
    imageUrl: 'https://images.unsplash.com/photo-1584025112108-62d294d13e31?auto=format&fit=crop&w=800&q=80', 
    year: 500, 
    empire: 'Various Arab Tribes',
    collection: 'Continental'
  },
  { 
    id: '10', 
    title: 'Anatolia (Asia Minor) Region', 
    imageUrl: 'https://images.unsplash.com/photo-1603515091722-e1c50e413ba0?auto=format&fit=crop&w=800&q=80', 
    year: 1200, 
    empire: 'Seljuks / Byzantines',
    collection: 'Continental'
  },

  // --- MAINSTREAM TIMELINE MAPS ---
  { 
    id: '11', 
    title: 'Achaemenid Persian Empire', 
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80', 
    year: -500, 
    empire: 'Persian Empire',
    collection: 'Mainstream'
  },
  { 
    id: '12', 
    title: 'Roman Empire at its Peak', 
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80', 
    year: 117, 
    empire: 'Roman Empire',
    collection: 'Mainstream'
  },
  { 
    id: '13', 
    title: 'Byzantine Empire under Justinian', 
    imageUrl: 'https://images.unsplash.com/photo-1566373752668-233630f9ec33?auto=format&fit=crop&w=800&q=80', 
    year: 555, 
    empire: 'Byzantine Empire',
    collection: 'Mainstream'
  },
  { 
    id: '14', 
    title: 'Mongol Empire Extent', 
    imageUrl: 'https://images.unsplash.com/photo-1500322969630-a26ab6eb64cc?auto=format&fit=crop&w=800&q=80', 
    year: 1279, 
    empire: 'Mongol Empire',
    collection: 'Mainstream'
  },
  { 
    id: '15', 
    title: 'Ottoman Empire Extent', 
    imageUrl: 'https://images.unsplash.com/photo-1521127027582-41481b49080e?auto=format&fit=crop&w=800&q=80', 
    year: 1683, 
    empire: 'Ottoman Empire',
    collection: 'Mainstream'
  },
];

// Sort chronologically by year
const sortedMaps = [...MOCK_MAPS].sort((a, b) => a.year - b.year);

const Gallery = () => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {sortedMaps.map((map) => (
        <MapCard key={map.id} map={map} />
      ))}
    </div>
  );
};

export default Gallery;
