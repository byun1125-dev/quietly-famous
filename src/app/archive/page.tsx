"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState, useMemo } from "react";

type ArchiveItem = {
  id: string;
  note: string;
  imageUrl?: string;
  videoUrl?: string;
  title: string;
  tags: string[];
  createdAt: number;
};

export default function ArchivePage() {
  const [items, setItems] = useSyncData<ArchiveItem[]>("archive_data_v2", []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalNote, setModalNote] = useState("");
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalVideoUrl, setModalVideoUrl] = useState("");
  const [modalTags, setModalTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'note' | 'image' | 'video'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const openModal = () => {
    setModalTitle("");
    setModalNote("");
    setModalImageUrl("");
    setModalVideoUrl("");
    setModalTags([]);
    setTagInput("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalNote("");
    setModalImageUrl("");
    setModalVideoUrl("");
    setModalTags([]);
    setTagInput("");
  };

  const handleSave = () => {
    if (!modalNote.trim() && !modalImageUrl.trim() && !modalVideoUrl.trim()) {
      alert("최소 하나의 내용을 입력해주세요.");
      return;
    }
    
    const newItem: ArchiveItem = {
      id: Math.random().toString(36).substring(7),
      note: modalNote.trim(),
      imageUrl: modalImageUrl.trim() || undefined,
      videoUrl: modalVideoUrl.trim() || undefined,
      title: modalTitle.trim() || '제목 없음',
      tags: modalTags,
      createdAt: Date.now()
    };
    
    setItems(prev => [newItem, ...prev]);
    closeModal();
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim().replace(/^#/, '');
    if (trimmed && !modalTags.includes(trimmed)) {
      setModalTags(prev => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setModalTags(prev => prev.filter(t => t !== tag));
  };

  // 모든 태그 추출
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach(item => {
      item.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [items]);

  // 필터링된 아이템
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 검색 쿼리 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesNote = item.note.toLowerCase().includes(query);
        const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesNote && !matchesTags) return false;
      }

      // 타입 필터
      if (filterType !== 'all') {
        if (filterType === 'note' && !item.note) return false;
        if (filterType === 'image' && !item.imageUrl) return false;
        if (filterType === 'video' && !item.videoUrl) return false;
      }

      // 태그 필터
      if (selectedTag && !item.tags?.includes(selectedTag)) return false;

      return true;
    });
  }, [items, searchQuery, filterType, selectedTag]);

  const deleteItem = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  return (
    <>
      <div className="flex flex-col h-full divide-y divide-black bg-white">
      {/* Header Info Section */}
      <section className="p-8 md:p-12 border-b border-black">
        <p className="mono font-bold text-[#8A9A8A] mb-4">Content Storage</p>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-black">
          The<br/>Archive.
        </h2>
      </section>

      {/* Control Bar */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_300px] divide-x divide-black border-b border-black">
        <div className="p-6 bg-white flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="SEARCH ARCHIVE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-6 py-4 border-2 border-black font-bold uppercase outline-none focus:bg-black focus:text-white transition-all placeholder:opacity-20"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full md:w-48 px-6 py-4 border-2 border-black font-black uppercase outline-none bg-white cursor-pointer"
          >
            <option value="all">ALL TYPES</option>
            <option value="note">NOTES ONLY</option>
            <option value="image">IMAGES ONLY</option>
            <option value="video">VIDEOS ONLY</option>
          </select>
        </div>
        <button
          onClick={openModal}
          className="p-6 bg-black text-white font-black uppercase text-xl hover:bg-[#8A9A8A] transition-colors"
        >
          + ADD NEW ITEM
        </button>
      </section>

      {/* Tags Bar */}
      {allTags.length > 0 && (
        <section className="p-6 bg-[#F5F5F2] border-b border-black overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-6 py-2 border-2 border-black font-black uppercase text-[10px] transition-all ${
                !selectedTag ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              ALL TAGS
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-6 py-2 border-2 border-black font-black uppercase text-[10px] transition-all ${
                  selectedTag === tag ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Grid Content */}
      <section className="p-8 md:p-12 bg-white">
        {filteredItems.length === 0 ? (
          <div className="py-40 text-center border-4 border-dashed border-black/5">
            <p className="mono font-black text-4xl opacity-10 uppercase tracking-tighter">Empty Space.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="break-inside-avoid border-2 border-black bg-white overflow-hidden group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                {/* Image */}
                {item.imageUrl && (
                  <div className="border-b-2 border-black overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

                {/* Video */}
                {item.videoUrl && (
                  <div className="aspect-video bg-black border-b-2 border-black">
                    {item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={item.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-black uppercase">
                        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">View Source &gt;</a>
                      </div>
                    )}
                  </div>
                )}

                {/* Note */}
                {item.note && (
                  <div className="p-8 bg-[#FFFFE0] border-b-2 border-black">
                    <p className="text-xl font-bold leading-tight tracking-tight text-black">{item.note}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-black uppercase text-lg leading-none tracking-tighter">{item.title}</h4>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-[10px] font-black uppercase text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase">#{tag}</span>
                    ))}
                  </div>
                  <p className="mono font-bold opacity-30 text-[9px]">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>

    {/* Unified Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-3xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">새 아이템 추가</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">제목</label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="예: 여름 콘텐츠 아이디어"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  메모 <span className="text-xs text-gray-400">(선택)</span>
                </label>
                <textarea
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="떠오르는 아이디어나 생각을 자유롭게 적어보세요..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors resize-none h-32"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  이미지 URL <span className="text-xs text-gray-400">(선택)</span>
                </label>
                <input
                  type="url"
                  value={modalImageUrl}
                  onChange={(e) => setModalImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                />
                {modalImageUrl && (
                  <div className="mt-2">
                    <img
                      src={modalImageUrl}
                      alt="Preview"
                      className="max-h-40 rounded border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  영상 URL <span className="text-xs text-gray-400">(선택, YouTube 등)</span>
                </label>
                <input
                  type="url"
                  value={modalVideoUrl}
                  onChange={(e) => setModalVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  태그 <span className="text-xs text-gray-400">(선택)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(tagInput);
                      }
                    }}
                    placeholder="태그 입력 후 Enter (예: 패션, 무드보드)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors text-sm"
                  />
                  <button
                    onClick={() => addTag(tagInput)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    추가
                  </button>
                </div>
                {modalTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {modalTags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#8A9A8A] text-white rounded-full text-sm flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#8A9A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#7a8a7a] transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
