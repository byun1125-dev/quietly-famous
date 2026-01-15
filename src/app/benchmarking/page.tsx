"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState, useRef } from "react";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type Analysis = {
  id: string;
  title: string;
  category: 'reels' | 'feed' | 'story';
  targetLink: string;
  screenshot?: string;
  hook: string;
  body: string;
  cta: string;
  apply: string;
  keywords: string[];
  createdAt: number;
};

const FRAMEWORK = [
  { 
    key: "hook", 
    label: "Hook (도입부)", 
    placeholder: "시청자를 1초 만에 멈추게 한 포인트는?",
  },
  { 
    key: "body", 
    label: "Body (본문)", 
    placeholder: "정보나 재미를 전달하는 방식은? (자막, 리듬 등)",
  },
  { 
    key: "cta", 
    label: "CTA (마무리)", 
    placeholder: "팔로우나 저장을 어떻게 유도했나요?",
  },
  { 
    key: "apply", 
    label: "Apply (적용)", 
    placeholder: "이 구조를 내 콘텐츠에 어떻게 적용할까요?",
  },
];

export default function BenchmarkingPage() {
  const [analyses, setAnalyses] = useSyncData<Analysis[]>("analyses_v2", []);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<'reels' | 'feed' | 'story'>('reels');
  const [targetLink, setTargetLink] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [hook, setHook] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("");
  const [apply, setApply] = useState("");

  const openModal = (analysis?: Analysis) => {
    if (analysis) {
      // 편집 모드
      setSelectedId(analysis.id);
      setTitle(analysis.title);
      setCategory(analysis.category);
      setTargetLink(analysis.targetLink);
      setScreenshot(analysis.screenshot || "");
      setHook(analysis.hook);
      setBody(analysis.body);
      setCta(analysis.cta);
      setApply(analysis.apply);
    } else {
      // 새로 만들기
      setSelectedId(null);
      setTitle("");
      setCategory('reels');
      setTargetLink("");
      setScreenshot("");
      setHook("");
      setBody("");
      setCta("");
      setApply("");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const saveAnalysis = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // 키워드 자동 추출
    const allText = `${hook} ${body} ${cta} ${apply}`.toLowerCase();
    const commonWords = new Set(['이', '그', '저', '것', '수', '등', '및', '을', '를', '이', '가', '은', '는', '에', '의', '로', '으로', 'and', 'the', 'is', 'a', 'to']);
    const words = allText.match(/[가-힣a-z]{2,}/g) || [];
    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      if (!commonWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    const keywords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    const existingAnalysis = analyses.find(a => a.id === selectedId);
    const newAnalysis: Analysis = {
      id: selectedId || Math.random().toString(36).substring(7),
      title: title.trim(),
      category,
      targetLink: targetLink.trim(),
      screenshot: screenshot.trim() || undefined,
      hook: hook.trim(),
      body: body.trim(),
      cta: cta.trim(),
      apply: apply.trim(),
      keywords,
      createdAt: selectedId ? (existingAnalysis?.createdAt || Date.now()) : Date.now()
    };

    if (selectedId) {
      setAnalyses(prev => prev.map(a => a.id === selectedId ? newAnalysis : a));
    } else {
      setAnalyses(prev => [newAnalysis, ...prev]);
    }

    closeModal();
    alert("저장되었습니다!");
  };

  const deleteAnalysis = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setAnalyses(prev => prev.filter(a => a.id !== id));
      if (selectedId === id) {
        closeModal();
      }
    }
  };

  const exportToTemplate = () => {
    if (!apply.trim()) {
      alert("Apply 섹션을 작성해주세요.");
      return;
    }
    const templates = JSON.parse(localStorage.getItem("user_templates") || "[]");
    const newTemplate = {
      id: Math.random().toString(36).substring(7),
      title: `[${title}] 적용 템플릿`,
      body: apply.trim()
    };
    templates.unshift(newTemplate);
    localStorage.setItem("user_templates", JSON.stringify(templates));
    alert("Cheat Key에 템플릿으로 저장되었습니다!");
  };

  // 이미지 압축 및 업로드
  const handleImageUpload = async (file: File) => {
    if (!auth.currentUser) {
      alert("이미지를 업로드하려면 로그인이 필요합니다.");
      return;
    }

    setUploading(true);

    try {
      const compressedFile = await compressImage(file, 800, 0.8);
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/benchmarking/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);
      setScreenshot(url);
    } catch (e) {
      console.error("업로드 에러:", e);
      alert(`업로드 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
    } finally {
      setUploading(false);
    }
  };

  const compressImage = (file: File, maxWidth: number, quality: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              } else {
                reject(new Error('압축 실패'));
              }
            },
            'image/jpeg',
            quality
          );
        };
      };
      reader.onerror = reject;
    });
  };

  return (
    <div className="flex flex-col h-full divide-y divide-black bg-white">
      {/* Header */}
      <section className="px-6 py-4 bg-white">
        <p className="text-xs opacity-40">Reference</p>
        <h2 className="text-xl font-normal mt-2">
          Content Library
        </h2>
        <p className="text-sm leading-relaxed opacity-60 mt-3">
          성공한 콘텐츠를 수집하고 분석해 나만의 레퍼런스 라이브러리를 만드세요.
        </p>
      </section>

      {/* Gallery Grid */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Add New Card */}
          <button
            onClick={() => openModal()}
            className="aspect-[3/4] border-2 border-dashed border-black/20 hover:border-black hover:bg-black/5 transition-all flex flex-col items-center justify-center gap-2"
          >
            <span className="text-3xl opacity-20">+</span>
            <span className="text-xs opacity-40">새 레퍼런스</span>
          </button>

          {/* Analysis Cards */}
          {analyses.map(analysis => (
            <div
              key={analysis.id}
              onClick={() => openModal(analysis)}
              className="aspect-[3/4] border border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Thumbnail */}
              {analysis.screenshot ? (
                <img
                  src={analysis.screenshot}
                  alt={analysis.title}
                  className="w-full h-2/3 object-cover border-b border-black"
                />
              ) : (
                <div className="w-full h-2/3 bg-[#F5F5F2] border-b border-black flex items-center justify-center">
                  <span className="text-xs opacity-20">No Image</span>
                </div>
              )}

              {/* Info */}
              <div className="p-3 space-y-2">
                <h3 className="text-sm font-medium leading-tight line-clamp-2">{analysis.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 border border-black bg-white">
                    {analysis.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] opacity-30">
                    {new Date(analysis.createdAt).toLocaleDateString('ko', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {analyses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xs opacity-20">레퍼런스를 추가해보세요</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div
            className="bg-white border-2 border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-black bg-[#F5F5F2]">
              <h3 className="text-sm font-medium">{selectedId ? 'Edit Reference' : 'New Reference'}</h3>
              <button onClick={closeModal} className="text-lg opacity-40 hover:opacity-100">✕</button>
            </div>

            {/* Modal Content */}
            <div className="divide-y divide-black">
              {/* Reference Section */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs opacity-40">Title</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title..."
                    className="w-full px-3 py-2 border border-black text-sm outline-none bg-white placeholder:opacity-20"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs opacity-40">Category</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setCategory('reels')}
                      className={`px-3 py-2 text-xs border border-black transition-colors ${category === 'reels' ? 'bg-black text-white' : 'bg-white hover:bg-black/5'}`}
                    >
                      Reels
                    </button>
                    <button
                      onClick={() => setCategory('feed')}
                      className={`px-3 py-2 text-xs border border-black transition-colors ${category === 'feed' ? 'bg-black text-white' : 'bg-white hover:bg-black/5'}`}
                    >
                      Feed
                    </button>
                    <button
                      onClick={() => setCategory('story')}
                      className={`px-3 py-2 text-xs border border-black transition-colors ${category === 'story' ? 'bg-black text-white' : 'bg-white hover:bg-black/5'}`}
                    >
                      Story
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs opacity-40">Link</p>
                  <input
                    type="text"
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 border border-black text-xs outline-none bg-white placeholder:opacity-20"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs opacity-40">Screenshot</p>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-2 border border-black text-xs hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                      {uploading ? '업로드 중...' : '이미지 업로드'}
                    </button>
                    {screenshot && (
                      <button
                        onClick={() => setScreenshot("")}
                        className="px-3 py-2 text-xs opacity-40 hover:opacity-100"
                      >
                        제거
                      </button>
                    )}
                  </div>
                  {screenshot && (
                    <img src={screenshot} alt="Ref" className="w-full max-h-40 object-contain border border-black mt-2" />
                  )}
                </div>
              </div>

              {/* Deconstruct Section */}
              <div className="p-6">
                <h4 className="text-sm font-medium mb-4">Deconstruct</h4>
                <div className="space-y-4">
                  {FRAMEWORK.slice(0, 3).map((item, index) => {
                    const value = item.key === 'hook' ? hook : item.key === 'body' ? body : cta;
                    const setValue = item.key === 'hook' ? setHook : item.key === 'body' ? setBody : setCta;
                    
                    return (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-black text-white flex items-center justify-center text-xs">{index + 1}</span>
                          <p className="text-xs font-medium">{item.label}</p>
                        </div>
                        <textarea
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full h-20 px-3 py-2 border border-black text-sm leading-relaxed outline-none bg-white resize-none placeholder:opacity-20"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Apply Section */}
              <div className="p-6 bg-[#F5F5F2]">
                <h4 className="text-sm font-medium mb-4">Apply to My Content</h4>
                <textarea
                  value={apply}
                  onChange={(e) => setApply(e.target.value)}
                  placeholder="이 구조를 내 콘텐츠에 어떻게 적용할까요?"
                  className="w-full h-24 px-3 py-2 border border-black text-sm leading-relaxed outline-none bg-white resize-none placeholder:opacity-20"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-3 divide-x divide-black border-t border-black">
              {selectedId && (
                <button
                  onClick={() => deleteAnalysis(selectedId)}
                  className="px-4 py-3 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
              )}
              <button
                onClick={exportToTemplate}
                className="px-4 py-3 text-xs hover:bg-black/5 transition-colors disabled:opacity-20"
                disabled={!apply.trim()}
              >
                템플릿으로 저장
              </button>
              <button
                onClick={saveAnalysis}
                className={`px-4 py-3 text-xs bg-black text-white hover:bg-opacity-80 transition-colors ${!selectedId ? 'col-span-2' : ''}`}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
