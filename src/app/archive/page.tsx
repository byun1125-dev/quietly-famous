"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState } from "react";

type ArchiveItem = {
  id: string;
  type: 'image' | 'video' | 'note';
  content: string; // URL or Note text
  title: string;
  createdAt: number;
};

export default function ArchivePage() {
  const [items, setItems] = useSyncData<ArchiveItem[]>("archive_data", []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'image' | 'video' | 'note'>('note');
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const openModal = (type: 'image' | 'video' | 'note') => {
    setModalType(type);
    setModalTitle("");
    setModalContent("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalContent("");
  };

  const handleSave = () => {
    if (!modalContent.trim()) return;
    
    const newItem: ArchiveItem = {
      id: Math.random().toString(36).substring(7),
      type: modalType,
      content: modalContent,
      title: modalTitle || (modalType === 'note' ? 'Idea' : modalType === 'image' ? 'Image' : 'Video'),
      createdAt: Date.now()
    };
    
    setItems(prev => [newItem, ...prev]);
    closeModal();
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <>
      <div className="space-y-12 pb-20">
        <header className="border-b border-[var(--border)] pt-8 pb-12">
          <p className="mono mb-3 text-gray-500">Collection</p>
          <h2 className="text-5xl font-bold mb-6">The Archive.</h2>
          <p className="mt-4 text-gray-600 max-w-lg text-base leading-relaxed">
            영감, 아이디어, 그리고 소중한 순간들을 보관하세요.
          </p>
        </header>

        {/* Add Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => openModal('note')}
            className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg hover:shadow-lg transition-all group"
          >
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-lg mb-2">메모 추가</h3>
            <p className="text-sm text-gray-600">아이디어나 생각을 기록하세요</p>
          </button>

          <button
            onClick={() => openModal('image')}
            className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 rounded-lg hover:shadow-lg transition-all group"
          >
            <div className="text-4xl mb-3">🖼️</div>
            <h3 className="font-semibold text-lg mb-2">이미지 추가</h3>
            <p className="text-sm text-gray-600">링크로 이미지를 불러오세요</p>
          </button>

          <button
            onClick={() => openModal('video')}
            className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-all group"
          >
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="font-semibold text-lg mb-2">영상 추가</h3>
            <p className="text-sm text-gray-600">YouTube 링크를 추가하세요</p>
          </button>
        </div>

        {/* Archive Grid */}
        {items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-lg bg-gray-50">
            <p className="text-gray-400 text-lg mb-2">아카이브가 비어있습니다</p>
            <p className="text-gray-400 text-sm">위 버튼을 눌러 첫 아이템을 추가해보세요</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="break-inside-avoid border border-[var(--border)] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {item.type === 'image' && (
                  <img src={item.content} alt={item.title} className="w-full h-auto" onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                  }} />
                )}
                {item.type === 'video' && (
                  <div className="aspect-video bg-black">
                    {item.content.includes('youtube.com') || item.content.includes('youtu.be') ? (
                      <iframe
                        src={item.content.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm">
                        <a href={item.content} target="_blank" rel="noopener noreferrer" className="underline">영상 링크 열기</a>
                      </div>
                    )}
                  </div>
                )}
                {item.type === 'note' && (
                  <div className="p-6">
                    <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">"{item.content}"</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="mono text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {modalType === 'note' ? '메모 추가' : modalType === 'image' ? '이미지 추가' : '영상 추가'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">제목 (선택사항)</label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder={modalType === 'note' ? '예: 콘텐츠 아이디어' : modalType === 'image' ? '예: 무드보드' : '예: 참고 영상'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  {modalType === 'note' ? '내용' : modalType === 'image' ? '이미지 URL' : '영상 URL (YouTube 등)'}
                </label>
                {modalType === 'note' ? (
                  <textarea
                    value={modalContent}
                    onChange={(e) => setModalContent(e.target.value)}
                    placeholder="떠오르는 아이디어를 자유롭게 적어보세요..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors resize-none h-48"
                  />
                ) : (
                  <input
                    type="url"
                    value={modalContent}
                    onChange={(e) => setModalContent(e.target.value)}
                    placeholder={modalType === 'image' ? 'https://example.com/image.jpg' : 'https://www.youtube.com/watch?v=...'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                  />
                )}
              </div>

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
