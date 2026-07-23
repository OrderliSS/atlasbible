'use client';
import React, { useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import MapCard from './MapCard';
import CartographicCanvas from './CartographicCanvas';
import { MOCK_MAPS, MapData, ERAS, CATEGORIES } from '../data/maps';

const GalleryContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'backstory' | 'biblical' | 'geography'>('overview');
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const query = searchParams.get('q') || '';
  const activeCategories = searchParams.getAll('category');
  const activeCollections = searchParams.getAll('collection');
  const activeEras = searchParams.getAll('era');
  const activeRegions = searchParams.getAll('region');
  const activeEmpires = searchParams.getAll('empire');

  // Timeline Year Range state
  const minYearParam = searchParams.get('minYear');
  const maxYearParam = searchParams.get('maxYear');

  const filteredMaps = useMemo(() => {
    const qLower = query.toLowerCase().trim();

    return MOCK_MAPS.filter((map) => {
      // Text query search
      if (qLower) {
        const matchTitle = map.title.toLowerCase().includes(qLower);
        const matchDesc = map.description.toLowerCase().includes(qLower);
        const matchOverview = map.overview?.toLowerCase().includes(qLower);
        const matchBackstory = map.backstory?.toLowerCase().includes(qLower);
        const matchEmpire = map.empire.toLowerCase().includes(qLower);
        const matchRegion = map.region.toLowerCase().includes(qLower);
        const matchCategory = map.category?.toLowerCase().includes(qLower);
        const matchBiblical = map.biblicalContext?.toLowerCase().includes(qLower);
        const matchLocations = map.keyLocations?.some(l => l.toLowerCase().includes(qLower));
        const matchFigures = map.keyFigures?.some(f => f.toLowerCase().includes(qLower));
        const matchTags = map.tags?.some(t => t.toLowerCase().includes(qLower));

        if (!matchTitle && !matchDesc && !matchOverview && !matchBackstory && !matchEmpire && !matchRegion && !matchCategory && !matchBiblical && !matchLocations && !matchFigures && !matchTags) {
          return false;
        }
      }

      // Facet filters
      if (activeCategories.length > 0 && !activeCategories.includes(map.category)) return false;
      if (activeCollections.length > 0 && !activeCollections.includes(map.collection)) return false;
      if (activeEras.length > 0 && !activeEras.includes(map.era)) return false;
      if (activeRegions.length > 0 && !activeRegions.includes(map.region)) return false;
      if (activeEmpires.length > 0 && !activeEmpires.includes(map.empire)) return false;

      // Timeline year range filter
      if (minYearParam && map.year < parseInt(minYearParam)) return false;
      if (maxYearParam && map.year > parseInt(maxYearParam)) return false;

      return true;
    }).sort((a, b) => a.year - b.year);
  }, [searchParams, query, minYearParam, maxYearParam]);

  const handleRemoveFilter = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const existing = current.getAll(key).filter(v => v !== value);
    current.delete(key);
    existing.forEach(v => current.append(key, v));
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const handleEraSelect = (eraName: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const existing = current.getAll('era');
    if (existing.includes(eraName)) {
      current.delete('era');
      existing.filter(e => e !== eraName).forEach(e => current.append('era', e));
    } else {
      current.append('era', eraName);
    }
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const handleCopyShareLink = () => {
    if (selectedMap) {
      const url = `${window.location.origin}?q=${encodeURIComponent(selectedMap.title)}`;
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const activeFilterList = useMemo(() => {
    const list: { key: string; value: string; label: string }[] = [];
    if (query) list.push({ key: 'q', value: query, label: `Search: "${query}"` });
    activeCategories.forEach(v => list.push({ key: 'category', value: v, label: v }));
    activeCollections.forEach(v => list.push({ key: 'collection', value: v, label: v }));
    activeEras.forEach(v => list.push({ key: 'era', value: v, label: v }));
    activeRegions.forEach(v => list.push({ key: 'region', value: v, label: v }));
    activeEmpires.forEach(v => list.push({ key: 'empire', value: v, label: v }));
    return list;
  }, [query, activeCategories, activeCollections, activeEras, activeRegions, activeEmpires]);

  return (
    <>
      {/* Era Quick Jump Navigation Bar */}
      <div className="mb-6 overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex items-center space-x-2 min-w-max">
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mr-2 flex items-center gap-1 font-sans">
            <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Eras:
          </span>
          {ERAS.map((era) => {
            const isActive = activeEras.includes(era);
            return (
              <button
                key={era}
                onClick={() => handleEraSelect(era)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 border border-amber-400/40'
                    : 'bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {era}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Bar */}
      {activeFilterList.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl">
          <span className="text-xs text-neutral-400 font-medium mr-1">Active Filters:</span>
          {activeFilterList.map((item) => (
            <span
              key={`${item.key}-${item.value}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30"
            >
              {item.label}
              <button
                onClick={() => {
                  if (item.key === 'q') {
                    const current = new URLSearchParams(Array.from(searchParams.entries()));
                    current.delete('q');
                    router.push(`${pathname}?${current.toString()}`, { scroll: false });
                  } else {
                    handleRemoveFilter(item.key, item.value);
                  }
                }}
                className="hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button
            onClick={handleClearAll}
            className="text-xs text-neutral-400 hover:text-white underline ml-auto font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Map Count Header */}
      <div className="mb-6 flex items-center justify-between text-sm text-neutral-400 border-b border-neutral-800/60 pb-3 font-sans">
        <div>
          Showing <span className="text-amber-400 font-bold">{filteredMaps.length}</span> cartographic map{filteredMaps.length !== 1 ? 's' : ''}
        </div>
        <div className="text-xs text-neutral-500">
          Sorted Chronologically (Oldest to Newest)
        </div>
      </div>

      {/* Grid of Map Cards */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {filteredMaps.map((map) => (
          <div key={map.id} onClick={() => { setSelectedMap(map); setModalTab('overview'); }} className="cursor-pointer">
            <MapCard map={map} />
          </div>
        ))}
      </div>

      {filteredMaps.length === 0 && (
        <div className="text-center py-20 border border-neutral-800 rounded-2xl bg-neutral-900/50 p-8">
          <div className="w-12 h-12 rounded-full bg-neutral-800/80 flex items-center justify-center mx-auto mb-4 text-neutral-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-serif text-white font-medium mb-1">No maps found</h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
            No maps match your selected criteria. Try adjusting your search query, timeline range, or clearing active filters.
          </p>
          <button
            onClick={handleClearAll}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-lg shadow-amber-950/40"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Rich Cartographic Inspector Modal */}
      {selectedMap && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md overflow-y-auto" 
          onClick={() => setSelectedMap(null)}
        >
          <div 
            className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] my-auto" 
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-20 p-2 bg-neutral-900/80 border border-neutral-700/60 rounded-full text-neutral-400 hover:text-white transition-colors" 
              onClick={() => setSelectedMap(null)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Left Pane: Map Canvas / Image Display */}
            <div className="w-full md:w-1/2 relative bg-black/70 min-h-[280px] md:min-h-full flex items-center justify-center p-2 border-b md:border-b-0 md:border-r border-neutral-800">
              {!selectedMap.imageUrl || selectedMap.imageUrl.includes('placehold.co') ? (
                <CartographicCanvas 
                  title={selectedMap.title}
                  year={selectedMap.year}
                  empire={selectedMap.empire}
                  region={selectedMap.region}
                  category={selectedMap.category}
                  visualStyle={selectedMap.visualStyle}
                  className="w-full h-full min-h-[320px]"
                />
              ) : (
                <div className="relative w-full h-full min-h-[320px]">
                  <img 
                    src={selectedMap.imageUrl} 
                    alt={selectedMap.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain" 
                  />
                  <button 
                    onClick={() => setFullscreenImage(true)}
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border border-neutral-700 text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Full Screen
                  </button>
                </div>
              )}
            </div>
            
            {/* Right Pane: Multi-Tab Narrative & Details */}
            <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto bg-neutral-900/90 font-sans">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-xs">
                    {selectedMap.year < 0 ? `${Math.abs(selectedMap.year)} BC` : `${selectedMap.year} AD`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium border border-neutral-700 text-xs">
                    {selectedMap.empire}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium border border-neutral-700 text-xs">
                    {selectedMap.region}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold mb-1 leading-tight">{selectedMap.title}</h2>
                <p className="text-xs text-amber-400/90 italic mb-4 font-serif">{selectedMap.category}</p>

                {/* Tab Navigation */}
                <div className="flex border-b border-neutral-800 mb-5 text-xs font-semibold tracking-wider uppercase gap-2">
                  <button
                    onClick={() => setModalTab('overview')}
                    className={`pb-2.5 border-b-2 transition-colors ${
                      modalTab === 'overview'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setModalTab('backstory')}
                    className={`pb-2.5 border-b-2 transition-colors ${
                      modalTab === 'backstory'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Backstory
                  </button>
                  {selectedMap.biblicalContext && (
                    <button
                      onClick={() => setModalTab('biblical')}
                      className={`pb-2.5 border-b-2 transition-colors ${
                        modalTab === 'biblical'
                          ? 'border-amber-500 text-amber-400'
                          : 'border-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Biblical Record
                    </button>
                  )}
                  {(selectedMap.keyLocations?.length || selectedMap.keyFigures?.length) && (
                    <button
                      onClick={() => setModalTab('geography')}
                      className={`pb-2.5 border-b-2 transition-colors ${
                        modalTab === 'geography'
                          ? 'border-amber-500 text-amber-400'
                          : 'border-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Geography & Figures
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content Panels */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-neutral-300 text-sm leading-relaxed space-y-4">
                {modalTab === 'overview' && (
                  <>
                    <p className="font-serif text-base text-amber-100/90 leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
                      {selectedMap.overview || selectedMap.description}
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-neutral-800">
                        <span className="text-neutral-500 font-semibold uppercase">Collection:</span>
                        <span className="text-neutral-300">{selectedMap.collection}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-neutral-800">
                        <span className="text-neutral-500 font-semibold uppercase">Historical Era:</span>
                        <span className="text-neutral-300">{selectedMap.era}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-neutral-800">
                        <span className="text-neutral-500 font-semibold uppercase">Civilization / Empire:</span>
                        <span className="text-neutral-300">{selectedMap.empire}</span>
                      </div>
                    </div>

                    {selectedMap.tags && selectedMap.tags.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">Subject Tags:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedMap.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded text-[11px] bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {modalTab === 'backstory' && (
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-serif">Historical Backstory & Significance</h4>
                    <p className="text-neutral-300 leading-relaxed text-sm">
                      {selectedMap.backstory || selectedMap.description}
                    </p>
                  </div>
                )}

                {modalTab === 'biblical' && (
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-serif flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Scriptural Record & Covenantal Context
                    </h4>
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-sm leading-relaxed font-serif">
                      {selectedMap.biblicalContext}
                    </div>
                  </div>
                )}

                {modalTab === 'geography' && (
                  <div className="space-y-4">
                    {selectedMap.keyLocations && selectedMap.keyLocations.length > 0 && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">Key Locations & Landmarks</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMap.keyLocations.map(loc => (
                            <span key={loc} className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-medium flex items-center gap-1">
                              <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMap.keyFigures && selectedMap.keyFigures.length > 0 && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">Key Historical Figures</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMap.keyFigures.map(fig => (
                            <span key={fig} className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-medium flex items-center gap-1">
                              <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {fig}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-3">
                <button 
                  onClick={handleCopyShareLink}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors text-xs flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {shareCopied ? 'Link Copied!' : 'Share Map Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Overlay */}
      {fullscreenImage && selectedMap && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setFullscreenImage(false)}
        >
          <button 
            className="absolute top-4 right-4 p-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
            onClick={() => setFullscreenImage(false)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedMap.imageUrl} 
            alt={selectedMap.title} 
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full object-contain" 
          />
        </div>
      )}
    </>
  );
};

export default function Gallery() {
  return (
    <Suspense fallback={<div className="text-neutral-500 py-12 text-center">Loading cartographic gallery...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
