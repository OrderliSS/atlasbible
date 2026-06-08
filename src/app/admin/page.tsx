'use client';
import React, { useEffect, useState } from 'react';
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
    <div className="min-h-screen bg-neutral-950 text-neutral-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">Admin Dashboard</h1>
        <p className="text-neutral-400 mb-8">Review and manage pending map submissions.</p>

        {loading ? (
          <p className="text-neutral-500">Loading queue...</p>
        ) : maps.length === 0 ? (
          <div className="p-12 text-center border border-neutral-800 rounded-2xl bg-neutral-900/50">
            <p className="text-neutral-400">Approval queue is empty. All caught up!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maps.map((map) => (
              <div key={map.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="relative h-48 w-full bg-neutral-800">
                  <Image src={map.image_url} alt={map.title} fill className="object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg text-white mb-1">{map.title}</h3>
                  <div className="text-xs text-neutral-400 space-y-1 mb-4">
                    <p>Year: <span className="text-amber-500">{map.year}</span></p>
                    <p>Empire: {map.empire || 'N/A'}</p>
                    <p>Submitted by: {map.submitted_by || 'Anonymous'}</p>
                  </div>
                  <p className="text-sm text-neutral-300 line-clamp-3 mb-6">{map.description}</p>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    <button onClick={() => handleApprove(map.id)} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded-lg transition-colors">
                      Approve
                    </button>
                    <button onClick={() => handleReject(map.id, map.image_url)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2 rounded-lg transition-colors">
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
