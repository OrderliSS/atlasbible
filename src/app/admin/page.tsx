'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminDashboard() {
  const [maps, setMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingMaps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('maps')
      .select('*')
      .eq('status', 'pending');
      
    if (!error && data) setMaps(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingMaps();
  }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('maps')
      .update({ status: 'approved' })
      .eq('id', id);
    if (!error) fetchPendingMaps();
  };

  const handleReject = async (id: string, imageUrl: string) => {
    if (imageUrl) {
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('maps-images').remove([fileName]);
      }
    }
    const { error } = await supabase
      .from('maps')
      .delete()
      .eq('id', id);
    if (!error) fetchPendingMaps();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 py-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Archive
          </Link>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Curator Queue</span>
        </div>

        <h1 className="text-3xl font-serif text-white font-bold mb-2 tracking-wide">Curator Admin Dashboard</h1>
        <p className="text-xs text-neutral-400 mb-8">Review and verify pending historical map submissions before publishing to the main archive.</p>

        {loading ? (
          <p className="text-neutral-500 text-xs">Loading submission queue...</p>
        ) : maps.length === 0 ? (
          <div className="p-12 text-center border border-neutral-800 rounded-2xl bg-neutral-900/50">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-neutral-300 text-sm font-medium">Approval queue is empty!</p>
            <p className="text-neutral-500 text-xs mt-1">All submitted maps have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maps.map((map) => (
              <div key={map.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="relative h-48 w-full bg-neutral-800">
                  {map.image_url ? (
                    <Image src={map.image_url} alt={map.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-600 text-xs">No image</div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {map.category || 'Historical Map'}
                    </span>
                    <h3 className="font-serif text-lg text-white font-semibold mt-2 mb-1">{map.title}</h3>
                    <div className="text-xs text-neutral-400 space-y-1 mb-4 font-mono">
                      <p>Year: <span className="text-amber-400">{map.year < 0 ? `${Math.abs(map.year)} BC` : `${map.year} AD`}</span></p>
                      <p>Empire: {map.empire || 'N/A'}</p>
                      <p>Region: {map.region || 'N/A'}</p>
                    </div>
                    <p className="text-xs text-neutral-300 line-clamp-3 mb-6">{map.overview || map.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-neutral-800">
                    <button 
                      onClick={() => handleApprove(map.id)} 
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded-xl transition-colors text-xs"
                    >
                      Approve Map
                    </button>
                    <button 
                      onClick={() => handleReject(map.id, map.image_url)} 
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2 rounded-xl transition-colors text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
