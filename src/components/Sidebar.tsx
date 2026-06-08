import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-neutral-800 p-6 hidden md:block bg-neutral-950">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-neutral-100 tracking-wider">ATLAS BIBLE</h1>
        <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">Historical Archive</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Country</h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            {['Egypt', 'Greece', 'Italy', 'Persia', 'Babylon'].map(item => (
              <li key={item} className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="rounded border-neutral-700 bg-neutral-900 text-amber-600 focus:ring-amber-600 focus:ring-offset-neutral-900" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Era / Age</h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            {['Bronze Age', 'Iron Age', 'Classical Antiquity', 'Middle Ages', 'Renaissance'].map(item => (
              <li key={item} className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="rounded border-neutral-700 bg-neutral-900 text-amber-600 focus:ring-amber-600 focus:ring-offset-neutral-900" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Empire</h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            {['Roman Empire', 'Ottoman Empire', 'Mongol Empire', 'British Empire', 'Achaemenid Empire'].map(item => (
              <li key={item} className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="rounded border-neutral-700 bg-neutral-900 text-amber-600 focus:ring-amber-600 focus:ring-offset-neutral-900" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
