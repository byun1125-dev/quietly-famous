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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800">최근 아카이브</h3>
          <a href="/archive" className="text-sm text-[#8A9A8A] hover:underline">
            전체 보기 →
          </a>
        </div>
        <div className="p-12 border border-dashed border-[var(--border)] rounded-lg text-center bg-gray-50">
          <p className="text-gray-400 text-sm mb-3">아직 저장된 아카이브가 없습니다</p>
          <a
            href="/archive"
            className="inline-block px-4 py-2 bg-[#8A9A8A] text-white text-sm font-medium rounded-lg hover:bg-[#7a8a7a] transition-colors"
          >
            첫 아이템 추가하기
          </a>
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
