'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

function SearchbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setSearchTerm('');
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete('q');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative max-w-2xl w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search maps, scriptures (e.g. Genesis, Acts), empires, backstories, landmarks..."
        className="block w-full pl-11 pr-10 py-3 bg-neutral-900/80 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all sm:text-sm font-sans"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function Searchbar() {
  return (
    <Suspense fallback={
      <div className="relative max-w-2xl w-full h-11 bg-neutral-900/50 rounded-xl animate-pulse" />
    }>
      <SearchbarContent />
    </Suspense>
  );
}
