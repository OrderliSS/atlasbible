import Sidebar from '@/components/Sidebar';
import Searchbar from '@/components/Searchbar';
import Gallery from '@/components/Gallery';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex selection:bg-amber-900 selection:text-white">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800 p-6 flex items-center justify-between">
          <Searchbar />
          
          <div className="ml-4 flex items-center space-x-4">
            <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-amber-900/20">
              Submit Map
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-white mb-2 tracking-wide">The Archive</h2>
            <p className="text-neutral-400 max-w-2xl leading-relaxed">
              Explore the shifting borders of civilizations, ancient timelines, and historical empires through our curated collection of high-resolution cartography.
            </p>
          </div>
          
          <Gallery />
        </div>
      </main>
    </div>
  );
}
