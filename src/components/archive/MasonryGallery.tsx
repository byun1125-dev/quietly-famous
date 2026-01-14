"use client";

// Mock data for the gallery
const ITEMS = [
  { id: 1, title: "자연스러운 거울 셀카", type: "Photo", height: "h-64", color: "bg-gray-200" },
  { id: 2, title: "무심한듯한 캡션", type: "Style", height: "h-40", color: "bg-indigo-100" },
  { id: 3, title: "파리 브이로그 감성", type: "Video", height: "h-80", color: "bg-blue-100" },
  { id: 4, title: "톤 다운된 데일리룩", type: "Mood", height: "h-52", color: "bg-stone-200" },
  { id: 5, title: "음식 사진 구도", type: "Photo", height: "h-72", color: "bg-yellow-50" },
  { id: 6, title: "릴스 챌린지 연출", type: "Video", height: "h-60", color: "bg-pink-100" },
];

export default function MasonryGallery() {
  return (
    <div className="columns-2 md:columns-3 gap-4 space-y-4">
      {ITEMS.map((item) => (
        <div 
          key={item.id} 
          className={`relative break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${item.color} ${item.height}`}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-4">
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
              <span className="text-[10px] font-bold bg-white text-black px-2 py-1 rounded-full uppercase mb-1 inline-block">
                {item.type}
              </span>
              <p className="text-white font-bold text-sm leading-tight drop-shadow-md">
                {item.title}
              </p>
            </div>
          </div>
          {/* Placeholder for image */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl opacity-20">📸</span>
          </div>
        </div>
      ))}
      
      {/* Add Button */}
      <div className="break-inside-avoid h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all cursor-pointer">
        <span className="text-3xl">+</span>
        <span className="text-xs font-bold">Add Reference</span>
      </div>
    </div>
  );
}
