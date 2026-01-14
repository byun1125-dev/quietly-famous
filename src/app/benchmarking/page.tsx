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
    <div className="space-y-8 pb-20">
      <header className="border-b border-[var(--border)] pt-8 pb-12">
        <p className="mono mb-3 text-gray-500">Research</p>
        <h2 className="text-5xl font-bold mb-6">Content Deconstructor.</h2>
        <p className="mt-4 text-gray-600 max-w-lg text-base leading-relaxed">
          성공한 콘텐츠를 분석하고 구조를 학습하세요. 여러 모델을 저장하고 비교할 수 있습니다.
        </p>
      </header>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar - Analysis List */}
        <aside className="space-y-4">
          <button
            onClick={startNew}
            className="w-full p-4 bg-[#8A9A8A] text-white rounded-lg font-semibold hover:bg-[#7a8a7a] transition-colors"
          >
            + 새 분석 시작
          </button>

          <div className="space-y-2">
            {analyses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                저장된 분석이 없습니다
              </p>
            ) : (
              analyses.map(analysis => (
                <div
                  key={analysis.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedId === analysis.id
                      ? 'border-[#8A9A8A] bg-[#8A9A8A]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => loadAnalysis(analysis)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{analysis.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnalysis(analysis.id);
                      }}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {analysis.category === 'reels' ? '릴스' : analysis.category === 'feed' ? '피드' : '스토리'}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(analysis.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main - Analysis Form */}
        <main className="space-y-6">
          {!isCreating && !selectedId ? (
            <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-lg bg-gray-50">
              <p className="text-gray-400 mb-4">새 분석을 시작하거나 기존 분석을 선택하세요</p>
            </div>
          ) : (
            <>
              <div className="bg-white border border-[var(--border)] p-6 rounded-lg shadow-sm space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">분석 제목</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="예: 여름 릴스 분석 #1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">카테고리</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                    >
                      <option value="reels">릴스</option>
                      <option value="feed">피드</option>
                      <option value="story">스토리</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">타겟 링크</label>
                  <input
                    type="url"
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    placeholder="벤치마킹할 계정이나 영상 링크를 입력하세요..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    스크린샷 URL <span className="text-xs text-gray-400">(선택)</span>
                  </label>
                  <input
                    type="url"
                    value={screenshot}
                    onChange={(e) => setScreenshot(e.target.value)}
                    placeholder="스크린샷 이미지 URL"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                  />
                  {screenshot && (
                    <img
                      src={screenshot}
                      alt="Screenshot"
                      className="mt-3 max-h-60 rounded border border-gray-200"
                      onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  )}
                </div>
              </div>

              {/* Framework Analysis */}
              <div className="bg-white border border-[var(--border)] p-8 rounded-lg shadow-sm space-y-8">
                {FRAMEWORK.map((item, index) => {
                  const value = item.key === 'hook' ? hook : item.key === 'body' ? body : item.key === 'cta' ? cta : apply;
                  const setValue = item.key === 'hook' ? setHook : item.key === 'body' ? setBody : item.key === 'cta' ? setCta : setApply;
                  
                  return (
                    <div key={item.key} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8A9A8A] text-white flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-800">{item.label}</h4>
                      </div>
                      
                      {/* Examples */}
                      <details className="text-sm text-gray-600">
                        <summary className="cursor-pointer hover:text-[#8A9A8A] font-medium">예시 보기</summary>
                        <ul className="mt-2 ml-4 space-y-1 list-disc">
                          {item.examples.map((example, i) => (
                            <li key={i} className="text-gray-500">{example}</li>
                          ))}
                        </ul>
                      </details>

                      <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={item.placeholder}
                        className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg leading-relaxed outline-none focus:border-[#8A9A8A] transition-colors resize-none"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Keywords & Actions */}
              {selectedAnalysis && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">추출된 키워드</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.keywords.map(keyword => (
                      <span key={keyword} className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={saveAnalysis}
                  className="flex-1 bg-[#8A9A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#7a8a7a] transition-colors"
                >
                  저장
                </button>
                {apply.trim() && (
                  <button
                    onClick={exportToTemplate}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Cheat Key로 내보내기
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <div className="p-8 bg-gradient-to-br from-[#8A9A8A]/10 to-transparent border border-[var(--border)] rounded-lg">
        <div className="flex gap-4">
          <div className="text-3xl">💡</div>
          <p className="text-sm leading-relaxed text-gray-700">
            <strong>Tip:</strong> 구조를 따라 하는 것은 카피가 아니라 학습입니다. 뼈대를 가져오고 살(내용)은 내 것으로 채우세요.
          </p>
        </div>
      </div>
    </div>
  );
}
