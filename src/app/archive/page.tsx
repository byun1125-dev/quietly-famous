"use client";

import MasonryGallery from "@/components/archive/MasonryGallery";

export default function ArchivePage() {
  return (
    <div className="space-y-12">
      <header className="card-minimal">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Storage</h3>
        <h2 className="text-6xl font-black italic tracking-tighter uppercase">The Closet.</h2>
        <p className="mt-6 text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
          Collect the mood, the tone, and the "quietly famous" aesthetic from your daily life.
        </p>
      </header>

      <div className="flex border-b-2 border-black pb-4 gap-8 overflow-x-auto no-scrollbar">
        {["All", "Mirror", "Tone", "Reels"].map(cat => (
          <button key={cat} className="text-xs font-black uppercase tracking-widest hover:text-[#FF5C00] transition-colors shrink-0">
            {cat}
          </button>
        ))}
      </div>

      <MasonryGallery />
    </div>
  );
}
