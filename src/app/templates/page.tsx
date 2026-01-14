"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState } from "react";

type Template = { id: string; title: string; body: string };

const RECOMMENDATIONS = [
  "이번 주 출근룩.zip - 무심한 세로 그리드용",
  "지각 위기 생존 코디 - 스토리 감성",
  "무채색 룩에 포인트 주는 법 - 정보성 릴스",
  "내 가방 속 '조용히 유명한' 아이템들"
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useSyncData<Template[]>("user_templates", []);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [showVariations, setShowVariations] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);

  const addTemplate = () => {
    if (!newTitle || !newBody) return;
    setTemplates(prev => [{ id: Math.random().toString(36).substring(7), title: newTitle, body: newBody }, ...prev]);
    setNewTitle("");
    setNewBody("");
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("복사되었습니다.");
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // 패턴 기반 변형 생성
  const generateVariations = (original: string) => {
    const variations: string[] = [];

    // 변형 1: 이모지 추가/변경
    const emojis = ['✨', '💫', '🌟', '💝', '💕', '🔥', '💯', '👀', '🎯', '✅'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    variations.push(`${randomEmoji} ${original} ${randomEmoji}`);

    // 변형 2: 질문형으로 전환
    if (!original.includes('?')) {
      const questionStarters = ['혹시', '여러분도', '이거', '지금'];
      const randomStarter = questionStarters[Math.floor(Math.random() * questionStarters.length)];
      variations.push(`${randomStarter} ${original}? 💬`);
    } else {
      variations.push(original.replace(/\?/g, '!! 🎉'));
    }

    // 변형 3: 강조 추가
    const emphasisWords = ['진짜', '정말', '완전', '너무'];
    const randomEmphasis = emphasisWords[Math.floor(Math.random() * emphasisWords.length)];
    const words = original.split(' ');
    if (words.length > 2) {
      words.splice(1, 0, randomEmphasis);
      variations.push(words.join(' ') + ' 💪');
    } else {
      variations.push(`${randomEmphasis} ${original} 💪`);
    }

    return variations;
  };

  const showAIVariations = (template: Template) => {
    const newVariations = generateVariations(template.body);
    setVariations(newVariations);
    setShowVariations(template.id);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="border-b border-[var(--border)] pt-8 pb-12">
        <p className="mono mb-3 text-gray-500">Toolbox</p>
        <h2 className="text-5xl font-bold mb-6">Cheat Key.</h2>
        <p className="mt-4 text-gray-600 max-w-lg text-base leading-relaxed">
          자주 사용하는 템플릿과 아이디어를 저장하고 빠르게 활용하세요.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-8">
        {/* Recommendation Section */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">오늘의 토픽 아이디어 💡</h3>
          <div className="space-y-3">
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg text-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  <span className="text-lg">✨</span>
                  <p className="flex-1 leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Templates Section */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">나만의 템플릿 만들기 📝</h3>
          <div className="bg-white border border-[var(--border)] rounded-lg p-6 shadow-sm space-y-4">
            <input 
              placeholder="제목 (예: 월요일 출근룩)" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors text-sm"
            />
            <textarea 
              placeholder="자주 쓰는 본문이나 해시태그를 저장하세요..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8A9A8A] transition-colors resize-none"
            />
            <button 
              onClick={addTemplate} 
              className="w-full py-3 bg-[#8A9A8A] text-white font-semibold rounded-lg hover:bg-[#7a8a7a] transition-colors"
            >
              템플릿 저장
            </button>
          </div>
        </div>
      </section>

      {/* Saved Templates */}
      {templates.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">저장된 템플릿</h3>
          <div className="grid gap-4">
            {templates.map(t => (
              <div key={t.id} className="bg-white border border-[var(--border)] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base mb-2 text-gray-800">{t.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{t.body}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copy(t.body)} 
                      className="flex-1 px-4 py-2 bg-[#8A9A8A] text-white text-xs font-semibold rounded hover:bg-[#7a8a7a] transition-colors"
                    >
                      복사
                    </button>
                    <button 
                      onClick={() => showAIVariations(t)} 
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      ✨ 템플릿 변형
                    </button>
                    <button 
                      onClick={() => deleteTemplate(t.id)} 
                      className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                {/* Template Variations */}
                {showVariations === t.id && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-t border-purple-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-semibold text-sm text-purple-800">✨ 템플릿 변형</h5>
                      <button
                        onClick={() => setShowVariations(null)}
                        className="text-purple-400 hover:text-purple-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-3">
                      {variations.map((variation, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <span className="text-xs font-semibold text-purple-600 mb-2 block">변형 {index + 1}</span>
                              <p className="text-sm text-gray-700">{variation}</p>
                            </div>
                            <button
                              onClick={() => copy(variation)}
                              className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded hover:bg-purple-600 transition-colors shrink-0"
                            >
                              복사
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
