'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
      const country = formData.get('country') as string;
      const eraAge = formData.get('era_age') as string;
      const year = parseInt(formData.get('year') as string);
      const empire = formData.get('empire') as string;
      const imageFile = formData.get('image') as File;

      if (!imageFile || imageFile.size === 0) throw new Error('Image is required');

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
          image_url: publicUrlData.publicUrl,
          country,
          era_age: eraAge,
          year,
          empire,
          status: 'pending',
          // submitted_by would naturally come from auth state. Assuming logged in:
          // submitted_by: (await supabase.auth.getUser()).data.user?.id
        }
      ]);

      if (dbError) throw dbError;

      setMessage('Map successfully submitted and is pending admin approval.');
      e.currentTarget.reset();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-serif text-white mb-6 tracking-wide">Submit a Map</h1>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.startsWith('Error') ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-900/50 text-green-200 border border-green-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400">Map Image</label>
            <input type="file" name="image" accept="image/*" required className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Title</label>
              <input type="text" name="title" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Year (e.g., -500 for BC)</label>
              <input type="number" name="year" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Country</label>
              <input type="text" name="country" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Empire</label>
              <input type="text" name="empire" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-400">Era / Age</label>
              <input type="text" name="era_age" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-400">Description</label>
              <textarea name="description" rows={4} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
            </div>
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-amber-900/20 transition-all disabled:opacity-50">
            {isSubmitting ? 'Uploading...' : 'Submit to Archive'}
          </button>
        </form>
      </div>
    </div>
  );
}
