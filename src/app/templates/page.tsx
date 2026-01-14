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
              <div key={t.id} className="p-6 bg-white border border-[var(--border)] rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-2 text-gray-800">{t.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{t.body}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copy(t.body)} 
                      className="px-4 py-2 bg-[#8A9A8A] text-white text-xs font-semibold rounded hover:bg-[#7a8a7a] transition-colors"
                    >
                      복사
                    </button>
                    <button 
                      onClick={() => deleteTemplate(t.id)} 
                      className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
