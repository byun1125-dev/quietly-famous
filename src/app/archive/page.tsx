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
      <div className="space-y-8 pb-20">
        <header className="border-b border-[var(--border)] pt-8 pb-12">
          <p className="mono mb-3 text-gray-500">Collection</p>
          <h2 className="text-5xl font-bold mb-6">The Archive.</h2>
          <p className="mt-4 text-gray-600 max-w-lg text-base leading-relaxed">
            영감, 아이디어, 그리고 소중한 순간들을 한 곳에 보관하세요.
          </p>
        </header>

        {/* Add Button */}
        <button
          onClick={openModal}
          className="w-full p-8 bg-gradient-to-br from-[#8A9A8A]/10 to-[#8A9A8A]/5 border-2 border-[#8A9A8A]/30 border-dashed rounded-lg hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl">+</div>
            <div className="text-left">
              <h3 className="font-semibold text-xl mb-1">새 아이템 추가</h3>
              <p className="text-sm text-gray-600">메모, 이미지, 영상을 함께 저장할 수 있습니다</p>
            </div>
          </div>
        </button>

        {/* Search & Filter */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
            >
              <option value="all">전체</option>
              <option value="note">메모만</option>
              <option value="image">이미지만</option>
              <option value="video">영상만</option>
            </select>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  !selectedTag
                    ? 'bg-[#8A9A8A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#8A9A8A] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Archive Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-lg bg-gray-50">
            <p className="text-gray-400 text-lg mb-2">
              {items.length === 0 ? '아카이브가 비어있습니다' : '검색 결과가 없습니다'}
            </p>
            <p className="text-gray-400 text-sm">
              {items.length === 0 ? '위 버튼을 눌러 첫 아이템을 추가해보세요' : '다른 검색어나 필터를 시도해보세요'}
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="break-inside-avoid border border-[var(--border)] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Image */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}

                {/* Video */}
                {item.videoUrl && (
                  <div className="aspect-video bg-black">
                    {item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={item.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm">
                        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
                          영상 링크 열기 →
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Note (Polaroid style) */}
                {item.note && (
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
                    <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">{item.note}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm flex-1">{item.title}</p>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors ml-2"
                    >
                      삭제
                    </button>
                  </div>
                  <p className="mono text-xs text-gray-400 mb-2">
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-[#8A9A8A]/10 text-[#8A9A8A] rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
