'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/data/maps';

export default function SubmitMap() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const overview = formData.get('overview') as string;
      const backstory = formData.get('backstory') as string;
      const biblicalContext = formData.get('biblical_context') as string;
      const category = formData.get('category') as string;
      const region = formData.get('region') as string;
      const eraAge = formData.get('era_age') as string;
      const year = parseInt(formData.get('year') as string);
      const empire = formData.get('empire') as string;
      const imageFile = formData.get('image') as File;

      if (!imageFile || imageFile.size === 0) throw new Error('Map image file is required');

      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('maps-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('maps-images')
        .getPublicUrl(fileName);

      // Save metadata to Supabase DB
      const { error: dbError } = await supabase.from('maps').insert([
        {
          title,
          description,
          overview,
          backstory,
          biblical_context: biblicalContext,
          category,
          region,
          image_url: publicUrlData.publicUrl,
          era_age: eraAge,
          year,
          empire,
          status: 'pending',
        }
      ]);

      if (dbError) throw dbError;

      setMessage('Map successfully submitted to the archive queue! It is now pending curator verification.');
      e.currentTarget.reset();
    } catch (error: any) {
      setMessage(`Error submitting map: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Archive
          </Link>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Curator Portal</span>
        </div>

        <h1 className="text-3xl font-serif text-white font-bold mb-2 tracking-wide">Submit a Historical Map</h1>
        <p className="text-xs text-neutral-400 mb-8 leading-relaxed">
          Contribute high-resolution historical cartography, ancient surveys, or sacred maps to the Atlas Bible public archive.
        </p>
        
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-xs leading-relaxed ${message.startsWith('Error') ? 'bg-red-950/60 text-red-200 border border-red-800' : 'bg-green-950/60 text-green-200 border border-green-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="space-y-2 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <label className="text-xs font-semibold text-neutral-300">Map Image File (High Resolution)</label>
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              required 
              className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400">Map Title *</label>
              <input 
                type="text" 
                name="title" 
                required 
                placeholder="e.g. Map of Jerusalem in 33 AD"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400">Year (e.g., -1446 for 1446 BC) *</label>
              <input 
                type="number" 
                name="year" 
                required 
                placeholder="-500"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400">Thematic Category</label>
              <select 
                name="category"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400">Empire / Civilization</label>
              <input 
                type="text" 
                name="empire" 
                placeholder="e.g. Roman Empire"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400">Region / Continent</label>
              <input 
                type="text" 
                name="region" 
                placeholder="e.g. Levant / Judea"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400">Era / Epoch</label>
              <input 
                type="text" 
                name="era_age" 
                placeholder="e.g. Classical Antiquity"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-neutral-400">Short Executive Overview</label>
              <input 
                type="text" 
                name="overview" 
                placeholder="Concise 1-2 sentence overview of the map"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-neutral-400">Historical Backstory & Context</label>
              <textarea 
                name="backstory" 
                rows={3} 
                placeholder="In-depth narrative explaining how, why, and by whom the map was created..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-neutral-400">Scripture / Biblical Cross-References (Optional)</label>
              <textarea 
                name="biblical_context" 
                rows={2} 
                placeholder="e.g. Genesis 12:1-9; Acts 27:1-30..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-neutral-400">Full Description</label>
              <textarea 
                name="description" 
                rows={3} 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-amber-950/40 transition-all disabled:opacity-50 text-xs"
          >
            {isSubmitting ? 'Submitting Map...' : 'Submit Map to Archive Queue'}
          </button>
        </form>
      </div>
    </div>
  );
}
