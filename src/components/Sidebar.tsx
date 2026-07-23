'use client';
import React, { Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { MOCK_MAPS, ERAS, CATEGORIES } from '../data/maps';

const uniqueCollections = Array.from(new Set(MOCK_MAPS.map(m => m.collection))).filter(Boolean).sort();
const uniqueEras = ERAS.filter(era => MOCK_MAPS.some(m => m.era === era));
const uniqueCategories = CATEGORIES.filter(cat => MOCK_MAPS.some(m => m.category === cat));
const uniqueRegions = Array.from(new Set(MOCK_MAPS.map(m => m.region))).filter(Boolean).sort();
const uniqueEmpires = Array.from(new Set(MOCK_MAPS.map(m => m.empire))).filter(Boolean).sort();

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarContent = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleToggle = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const existing = current.getAll(key);
    
    current.delete(key);
    const isAdding = !existing.includes(value);
    
    existing.forEach(v => {
      if (v !== value) current.append(key, v);
    });
    
    if (isAdding) {
      current.append(key, value);
    }
    
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const isChecked = (key: string, value: string) => {
    return searchParams.getAll(key).includes(value);
  };

  const getItemCount = (key: string, value: string) => {
    return MOCK_MAPS.filter(m => (m as any)[key] === value).length;
  };

  const categories = [
    {
      title: 'Thematic Category',
      key: 'category',
      items: uniqueCategories
    },
    {
      title: 'Collection',
      key: 'collection',
      items: uniqueCollections
    },
    {
      title: 'Era / Epoch',
      key: 'era',
      items: uniqueEras
    },
    {
      title: 'Region / Continent',
      key: 'region',
      items: uniqueRegions
    },
    {
      title: 'Empire / Civilization',
      key: 'empire',
      items: uniqueEmpires
    }
  ];

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const activeCount = Array.from(searchParams.keys()).filter(k => k !== 'q' && k !== 'minYear' && k !== 'maxYear').length;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-neutral-950 border-r border-neutral-800/80 p-6 overflow-y-auto transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:w-64 md:flex-shrink-0 md:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif font-bold text-lg shadow-inner">
                A
              </div>
              <h1 className="text-xl font-serif font-bold text-neutral-100 tracking-wider">ATLAS BIBLE</h1>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest font-sans font-semibold">Sacred Cartography Archive</p>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white md:hidden"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {activeCount > 0 && (
          <div className="mb-6 flex items-center justify-between p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
            <span className="text-amber-300 font-medium">{activeCount} filter category active</span>
            <button 
              onClick={clearAllFilters}
              className="text-amber-400 hover:underline font-semibold"
            >
              Reset
            </button>
          </div>
        )}

        <div className="space-y-7">
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>{category.title}</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-400 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {category.items.map(item => {
                  const count = getItemCount(category.key, item);
                  const checked = isChecked(category.key, item);
                  return (
                    <li 
                      key={item} 
                      onClick={() => handleToggle(category.key, item)}
                      className={`flex items-center justify-between p-1.5 rounded-md cursor-pointer transition-colors ${checked ? 'bg-neutral-800/80 text-amber-300 font-medium' : 'hover:bg-neutral-900 hover:text-neutral-200'}`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <input 
                          type="checkbox" 
                          checked={checked}
                          onChange={() => {}}
                          className="rounded border-neutral-700 bg-neutral-900 text-amber-600 focus:ring-amber-600 focus:ring-offset-neutral-900 cursor-pointer flex-shrink-0" 
                        />
                        <span className="truncate">{item}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 flex-shrink-0">
                        {count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <Suspense fallback={
      <aside className="w-64 flex-shrink-0 border-r border-neutral-800 p-6 hidden md:block bg-neutral-950">
        <div className="h-6 w-32 bg-neutral-900 rounded mb-8 animate-pulse" />
      </aside>
    }>
      <SidebarContent isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}
