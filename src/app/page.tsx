'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Searchbar from '@/components/Searchbar';
import Gallery from '@/components/Gallery';
import { Suspense } from 'react';

export default function Home() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <div className="h-screen flex bg-neutral-950 text-neutral-200 selection:bg-amber-900 selection:text-white overflow-hidden font-sans">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white md:hidden flex-shrink-0"
              aria-label="Open filter sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Searchbar />
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button 
              onClick={() => setShowSignInModal(true)}
              className="hidden sm:inline-flex px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
            >
              Sign In
            </button>
            <Link 
              href="/submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-amber-950/40 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Submit Map</span>
            </Link>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800/80 relative overflow-hidden">
            {/* Background cartographic element */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#F59E0B" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,72.8,41.4C64.2,53.7,52.6,63.7,39.3,71.5C26,79.3,13,84.9,-0.8,86.3C-14.7,87.7,-29.3,84.9,-42.2,77.3C-55.1,69.7,-66.2,57.3,-74.6,43.3C-83,29.3,-88.6,14.7,-88.1,0.3C-87.6,-14.1,-81,-28.2,-72,-40.4C-63,-52.6,-51.7,-62.9,-38.6,-70.7C-25.5,-78.5,-12.8,-83.8,1.4,-86.2C15.6,-88.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Historical & Biblical Cartography Archive
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold mb-3 tracking-wide leading-tight">
                The Sacred & Imperial Archive
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Journey through thousands of years of human history, ancient empires, covenantal migrations, and biblical landscapes through our curated catalog of high-resolution cartography and historical backstories.
              </p>
            </div>
          </div>
          
          <Suspense fallback={<div className="text-neutral-500 py-12 text-center">Loading cartographic collection...</div>}>
            <Gallery />
          </Suspense>
        </div>
      </main>

      {/* Simple Sign In Modal */}
      {showSignInModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSignInModal(false)}
        >
          <div 
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              onClick={() => setShowSignInModal(false)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-serif text-white font-bold mb-2">Member Sign In</h3>
            <p className="text-xs text-neutral-400 mb-6">Access archived high-resolution cartography and bookmark your favorite maps.</p>
            
            <form onSubmit={e => { e.preventDefault(); setShowSignInModal(false); }} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-neutral-400 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  placeholder="curator@atlasbible.org"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1.5">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-amber-950/40 text-xs"
              >
                Sign In to Archive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
