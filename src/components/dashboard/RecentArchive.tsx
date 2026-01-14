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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">최근 아카이브</h3>
        <a href="/archive" className="text-sm text-[#8A9A8A] hover:underline font-medium">
          전체 보기 →
        </a>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {recentItems.map((item) => (
          <a
            key={item.id}
            href="/archive"
            className="group block border border-[var(--border)] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {item.imageUrl && (
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            {!item.imageUrl && item.videoUrl && (
              <div className="aspect-square bg-black flex items-center justify-center">
                <span className="text-4xl">🎬</span>
              </div>
            )}
            {!item.imageUrl && !item.videoUrl && item.note && (
              <div className="aspect-square bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 flex items-center justify-center">
                <p className="text-sm text-gray-700 line-clamp-4 text-center">
                  {item.note}
                </p>
              </div>
            )}
            <div className="p-3 bg-gray-50">
              <p className="font-medium text-sm truncate">{item.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(item.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
