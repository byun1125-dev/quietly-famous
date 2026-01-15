"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState, useMemo, useRef } from "react";
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
    examples: [
      "질문으로 시작: '이거 진짜일까요?'",
      "반전 제시: '사실 이건 완전히 잘못됐어요'",
      "강렬한 비주얼: 극적인 Before/After"
    ]
  },
  { 
    key: "body", 
    label: "Body (본문)", 
    placeholder: "정보나 재미를 전달하는 방식은? (자막, 리듬 등)",
    examples: [
      "3단계 설명 구조",
      "빠른 컷 편집으로 리듬감",
      "자막으로 핵심 강조"
    ]
  },
  { 
    key: "cta", 
    label: "CTA (마무리)", 
    placeholder: "팔로우나 저장을 어떻게 유도했나요?",
    examples: [
      "'다음 영상에서 더 보여드릴게요'",
      "'저장해두고 나중에 다시 보세요'",
      "'팔로우하면 매일 팁 드려요'"
    ]
  },
  { 
    key: "apply", 
    label: "Apply (적용)", 
    placeholder: "이 구조를 내 콘텐츠에 어떻게 적용할까요?",
    examples: [
      "나만의 질문 만들기",
      "내 스타일로 변형하기",
      "타겟 독자에 맞게 조정"
    ]
  },
];

export default function BenchmarkingPage() {
  const [analyses, setAnalyses] = useSyncData<Analysis[]>("analyses_v2", []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
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

  const selectedAnalysis = useMemo(() => {
    return analyses.find(a => a.id === selectedId);
  }, [analyses, selectedId]);

  const loadAnalysis = (analysis: Analysis) => {
    setSelectedId(analysis.id);
    setTitle(analysis.title);
    setCategory(analysis.category);
    setTargetLink(analysis.targetLink);
    setScreenshot(analysis.screenshot || "");
    setHook(analysis.hook);
    setBody(analysis.body);
    setCta(analysis.cta);
    setApply(analysis.apply);
    setIsCreating(false);
  };

  const startNew = () => {
    setSelectedId(null);
    setTitle("");
    setCategory('reels');
    setTargetLink("");
    setScreenshot("");
    setHook("");
    setBody("");
    setCta("");
    setApply("");
    setIsCreating(true);
  };

  const saveAnalysis = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // 키워드 자동 추출 (간단한 방식)
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
      createdAt: selectedId ? (selectedAnalysis?.createdAt || Date.now()) : Date.now()
    };

    if (selectedId) {
      setAnalyses(prev => prev.map(a => a.id === selectedId ? newAnalysis : a));
    } else {
      setAnalyses(prev => [newAnalysis, ...prev]);
    }

    setSelectedId(newAnalysis.id);
    setIsCreating(false);
    alert("저장되었습니다!");
  };

  const deleteAnalysis = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setAnalyses(prev => prev.filter(a => a.id !== id));
      if (selectedId === id) {
        startNew();
      }
    }
  };

  const exportToTemplate = () => {
    if (!apply.trim()) {
      alert("Apply 섹션을 작성해주세요.");
      return;
    }
    // Cheat Key로 내보내기 (템플릿 저장)
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
      // 이미지 압축
      const compressedFile = await compressImage(file, 800, 0.8);
      
      // Firebase Storage에 업로드
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

  // 이미지 압축 함수
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
      {/* Header Info Section */}
      <section className="px-6 py-4 bg-white">
        <p className="text-xs opacity-40">Model</p>
        <h2 className="text-xl font-normal mt-2">
          Content Deconstructor
        </h2>
        <p className="text-sm leading-relaxed opacity-60 mt-3">
          성공한 콘텐츠를 분석하고 Hook-Body-CTA 구조로 분해해 나만의 템플릿을 만드세요.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] divide-x divide-black">
        {/* Sidebar - Analysis List */}
        <aside className="divide-y divide-black flex flex-col bg-[#F5F5F2]">
          <div className="px-6 py-4">
            <button
              onClick={startNew}
              className="w-full px-4 py-3 bg-black text-white text-sm hover:bg-opacity-80 transition-colors"
            >
              + New Analysis
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-black/10">
            {analyses.length === 0 ? (
              <p className="text-xs opacity-20 text-center py-12">No analysis found</p>
            ) : (
              analyses.map(analysis => (
                <div
                  key={analysis.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedId === analysis.id 
                      ? 'bg-white shadow-[inset_0_0_0_2px_rgba(0,0,0,1)]' 
                      : 'bg-white hover:bg-black/5 border-b border-black/10 last:border-b-0'
                  }`}
                  onClick={() => loadAnalysis(analysis)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-sm font-medium leading-tight ${selectedId === analysis.id ? 'opacity-100' : 'opacity-80'}`}>
                      {analysis.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnalysis(analysis.id);
                      }}
                      className="text-xs opacity-20 hover:opacity-100 hover:text-red-500 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 border border-black ${
                      selectedId === analysis.id ? 'bg-black text-white' : 'bg-white text-black'
                    }`}>
                      {analysis.category.toUpperCase()}
                    </span>
                    <p className="text-[10px] opacity-30 mono">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main - Analysis Form */}
        <main className="divide-y divide-black">
          {!isCreating && !selectedId ? (
            <div className="py-20 text-center">
              <p className="text-xs opacity-10">Select or create new</p>
            </div>
          ) : (
            <>
              {/* Reference Section */}
              <div className="px-6 py-4 bg-white space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Reference</h3>
                  <span className="text-xs px-2 py-1 border border-black bg-white">{category.toUpperCase()}</span>
                </div>

                <div className="space-y-3">
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

                  <div className="space-y-2">
                    <p className="text-xs opacity-40">Reference Link</p>
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
                      <img src={screenshot} alt="Ref" className="w-full max-h-60 object-contain border border-black mt-2" />
                    )}
                  </div>
                </div>
              </div>

              {/* Deconstruct Section */}
              <div className="px-6 py-4 bg-white">
                <h3 className="text-sm font-medium mb-4">Deconstruct</h3>
                <div className="space-y-4">
                  {FRAMEWORK.slice(0, 3).map((item, index) => {
                    const value = item.key === 'hook' ? hook : item.key === 'body' ? body : cta;
                    const setValue = item.key === 'hook' ? setHook : item.key === 'body' ? setBody : setCta;
                    
                    return (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-black text-white flex items-center justify-center text-xs">{index + 1}</span>
                          <p className="text-xs font-medium">{item.label}</p>
                          <span className="text-xs opacity-20">→</span>
                        </div>
                        <textarea
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full h-24 px-3 py-2 border border-black text-sm leading-relaxed outline-none bg-white resize-none placeholder:opacity-20"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Apply Section */}
              <div className="px-6 py-4 bg-[#F5F5F2]">
                <h3 className="text-sm font-medium mb-4">Apply to My Content</h3>
                <div className="space-y-2">
                  <p className="text-xs opacity-40">이 구조를 내 콘텐츠에 어떻게 적용할까요?</p>
                  <textarea
                    value={apply}
                    onChange={(e) => setApply(e.target.value)}
                    placeholder="나만의 스타일로 변형하기, 타겟 독자에 맞게 조정..."
                    className="w-full h-32 px-3 py-2 border border-black text-sm leading-relaxed outline-none bg-white resize-none placeholder:opacity-20"
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-2 divide-x divide-black bg-white">
                <button
                  onClick={saveAnalysis}
                  className="px-6 py-4 bg-black text-white text-sm hover:bg-opacity-80 transition-all"
                >
                  Save Analysis
                </button>
                <button
                  onClick={exportToTemplate}
                  className="px-6 py-4 bg-white text-black text-sm hover:bg-black hover:text-white transition-all disabled:opacity-10"
                  disabled={!apply.trim()}
                >
                  Export to Cheat Key
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
