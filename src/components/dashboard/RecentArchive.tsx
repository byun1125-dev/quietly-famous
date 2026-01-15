"use client";

import { useSyncData } from "@/hooks/useSyncData";

type ArchiveItem = {
  id: string;
  note: string;
  imageUrl?: string;
  videoUrl?: string;
  title: string;
  tags: string[];
  createdAt: number;
};

export default function RecentArchive() {
  const [items] = useSyncData<ArchiveItem[]>("archive_data_v2", []);
  
  // 최근 4개만 가져오기
  const recentItems = items.slice(0, 4);

  if (recentItems.length === 0) {
    return (
      <div className="flex flex-col h-full divide-y divide-black">
        <div className="px-6 py-4 flex justify-between items-center border-b border-black">
          <h3 className="text-sm font-medium">Recent Archive</h3>
          <a href="/archive" className="text-xs hover:underline">View All</a>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs opacity-20 mb-3">Empty</p>
            <a
              href="/archive"
              className="inline-block px-4 py-2 bg-black text-white text-xs hover:bg-opacity-80 transition-colors"
            >
              Add First Item
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full divide-y divide-black">
      <div className="px-6 py-4 flex justify-between items-center">
        <h3 className="text-sm font-medium">Recent Archive</h3>
        <a href="/archive" className="text-xs hover:underline">View All</a>
      </div>
      
      <div className="flex-1 overflow-y-auto divide-y divide-black">
        {recentItems.map((item) => (
          <a
            key={item.id}
            href="/archive"
            className="flex items-center group bg-white hover:bg-black hover:text-white transition-colors overflow-hidden"
          >
            <div className="w-16 h-16 shrink-0 border-r border-black overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg bg-[#F5F5F2] group-hover:bg-gray-900">
                  {item.videoUrl ? "🎬" : "📝"}
                </div>
              )}
            </div>
            <div className="px-4 py-3 flex-1">
              <p className="text-xs mb-0.5 opacity-40 group-hover:opacity-100">{new Date(item.createdAt).toLocaleDateString()}</p>
              <p className="text-sm truncate">{item.title}</p>
            </div>
          </a>
        ))}
        {recentItems.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-xs opacity-20">Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
