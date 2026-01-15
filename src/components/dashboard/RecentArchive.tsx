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
  
  // 최근 6개만 가져오기
  const recentItems = items.slice(0, 6);

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Recent Archive</h3>
        <a href="/archive" className="text-xs hover:underline">View All</a>
      </div>
      
      {recentItems.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-black">
          <p className="text-xs opacity-20">저장된 아카이브가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {recentItems.map((item) => (
            <a
              key={item.id}
              href="/archive"
              className="group border border-black bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden"
            >
              <div className="aspect-square border-b border-black overflow-hidden bg-white">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : item.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-white opacity-20">
                    <div className="w-8 h-8 border border-black"></div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white opacity-20">
                    <div className="w-6 h-8 border border-black"></div>
                  </div>
                )}
              </div>
              <div className="px-2 py-2">
                <p className="text-xs truncate">{item.title}</p>
                <p className="text-[10px] opacity-40 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
