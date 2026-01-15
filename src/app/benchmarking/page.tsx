"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState, useMemo } from "react";

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

  return (
    <div className="flex flex-col h-full divide-y divide-black bg-white">
      {/* Header Info Section */}
      <section className="p-8 md:p-12 border-b border-black bg-white">
        <p className="mono font-bold text-[#8A9A8A] mb-4">Content Research</p>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-black">
          Content<br/>Deconstructor.
        </h2>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] divide-x divide-black">
        {/* Sidebar - Analysis List */}
        <aside className="divide-y divide-black flex flex-col bg-[#F5F5F2]">
          <div className="p-8">
            <button
              onClick={startNew}
              className="w-full p-6 bg-black text-white rounded-none font-black uppercase text-lg hover:bg-[#8A9A8A] transition-colors shadow-[4px_4px_0px_0px_rgba(138,154,138,1)]"
            >
              + NEW ANALYSIS
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-black/10">
            {analyses.length === 0 ? (
              <p className="text-sm font-bold uppercase opacity-20 text-center py-20">No Analysis Found.</p>
            ) : (
              analyses.map(analysis => (
                <div
                  key={analysis.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedId === analysis.id ? 'bg-black text-white' : 'bg-white hover:bg-black/5'
                  }`}
                  onClick={() => loadAnalysis(analysis)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black uppercase text-sm leading-tight tracking-tight">{analysis.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnalysis(analysis.id);
                      }}
                      className={`text-[10px] font-black uppercase ${selectedId === analysis.id ? 'text-[#8A9A8A]' : 'text-red-500'}`}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] px-2 py-1 font-black uppercase ${selectedId === analysis.id ? 'bg-[#8A9A8A] text-black' : 'bg-black text-white'}`}>
                      {analysis.category}
                    </span>
                    <p className={`text-[9px] mono font-bold ${selectedId === analysis.id ? 'opacity-50' : 'opacity-20'}`}>
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
            <div className="py-40 text-center">
              <p className="mono font-black text-4xl opacity-10 uppercase tracking-tighter">Selection Required.</p>
            </div>
          ) : (
            <>
              {/* Target Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-black bg-white">
                <div className="p-8 md:p-12 space-y-8">
                  <div className="space-y-4">
                    <p className="mono font-black">Title & Category</p>
                    <div className="flex border-2 border-black">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="ENTER TITLE..."
                        className="flex-1 p-4 font-black uppercase outline-none bg-white text-xl placeholder:opacity-20"
                      />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="p-4 border-l-2 border-black font-black uppercase outline-none bg-[#F5F5F2] cursor-pointer"
                      >
                        <option value="reels">REELS</option>
                        <option value="feed">FEED</option>
                        <option value="story">STORY</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="mono font-black">Target Reference Link</p>
                    <input
                      type="url"
                      value={targetLink}
                      onChange={(e) => setTargetLink(e.target.value)}
                      placeholder="HTTPS://INSTAGRAM.COM/..."
                      className="w-full p-4 border-2 border-black font-bold uppercase outline-none bg-white placeholder:opacity-20"
                    />
                  </div>
                </div>
                <div className="p-8 md:p-12 bg-[#F5F5F2] flex flex-col justify-center items-center relative overflow-hidden group">
                  <p className="mono font-black mb-4">Screenshot Reference</p>
                  <input
                    type="url"
                    value={screenshot}
                    onChange={(e) => setScreenshot(e.target.value)}
                    placeholder="IMAGE URL..."
                    className="w-full p-4 border-2 border-black font-bold uppercase outline-none bg-white mb-4 z-10"
                  />
                  {screenshot ? (
                    <img src={screenshot} alt="Ref" className="max-h-[200px] border-2 border-black grayscale group-hover:grayscale-0 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
                  ) : (
                    <div className="w-full h-40 border-2 border-black border-dashed flex items-center justify-center mono opacity-20">No Image</div>
                  )}
                </div>
              </div>

              {/* Framework Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 bg-black gap-[1px]">
                {FRAMEWORK.map((item, index) => {
                  const value = item.key === 'hook' ? hook : item.key === 'body' ? body : item.key === 'cta' ? cta : apply;
                  const setValue = item.key === 'hook' ? setHook : item.key === 'body' ? setBody : item.key === 'cta' ? setCta : setApply;
                  
                  return (
                    <div key={item.key} className="bg-white p-8 md:p-12 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg">{index + 1}</span>
                          <h4 className="font-black uppercase text-xl tracking-tight">{item.label}</h4>
                        </div>
                        <details className="group">
                          <summary className="list-none cursor-pointer mono font-black hover:underline group-open:text-[#8A9A8A]">Examples &gt;</summary>
                          <ul className="mt-4 p-4 bg-[#F5F5F2] border-2 border-black space-y-2">
                            {item.examples.map((example, i) => (
                              <li key={i} className="text-[10px] font-bold uppercase text-gray-600 border-b border-black/5 pb-1">- {example}</li>
                            ))}
                          </ul>
                        </details>
                      </div>
                      
                      <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={item.placeholder.toUpperCase()}
                        className="w-full h-40 p-0 border-none font-bold text-lg leading-tight outline-none bg-transparent resize-none placeholder:opacity-10"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-black border-t border-black bg-white">
                <button
                  onClick={saveAnalysis}
                  className="p-8 bg-[#8A9A8A] text-black font-black uppercase text-2xl hover:bg-black hover:text-white transition-all"
                >
                  Save Analysis.
                </button>
                <button
                  onClick={exportToTemplate}
                  className="p-8 bg-white text-black font-black uppercase text-2xl hover:bg-black hover:text-white transition-all disabled:opacity-10"
                  disabled={!apply.trim()}
                >
                  Export to Cheat Key.
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
