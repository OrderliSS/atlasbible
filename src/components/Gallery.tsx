import React from 'react';
import MapCard from './MapCard';

// Dummy data for MVP layout testing
const MOCK_MAPS = [
  { id: '1', title: 'Roman Empire at its Peak', imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80', year: 117, empire: 'Roman Empire' },
  { id: '2', title: 'Ancient Egypt', imageUrl: 'https://images.unsplash.com/photo-1505298818228-56eb022f4705?auto=format&fit=crop&w=800&q=80', year: -1500, empire: 'Ancient Egypt' },
  { id: '3', title: 'Silk Road Routes', imageUrl: 'https://images.unsplash.com/photo-1500322969630-a26ab6eb64cc?auto=format&fit=crop&w=800&q=80', year: 1300, empire: 'Mongol Empire' },
  { id: '4', title: 'Hellenistic World', imageUrl: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=800&q=80', year: -323, empire: 'Macedonian Empire' },
  { id: '5', title: 'Achaemenid Empire', imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80', year: -500, empire: 'Persian Empire' },
  { id: '6', title: 'Byzantine Empire', imageUrl: 'https://images.unsplash.com/photo-1566373752668-233630f9ec33?auto=format&fit=crop&w=800&q=80', year: 555, empire: 'Byzantine Empire' },
];

const Gallery = () => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {MOCK_MAPS.map((map) => (
        <MapCard key={map.id} map={map} />
      ))}
    </div>
  );
};

export default Gallery;
