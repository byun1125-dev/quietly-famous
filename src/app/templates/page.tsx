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

  return (
    <div className="space-y-12 pb-20">
      <header className="card-minimal">
        <p className="mono mb-2">Toolbox</p>
        <h2 className="text-4xl font-serif italic">Cheat Key.</h2>
      </header>

      <section className="grid md:grid-cols-2 gap-12">
        {/* Recommendation Section */}
        <div className="space-y-8">
          <p className="mono text-[#8A9A8A]">Today's Topic Ideas</p>
          <div className="space-y-4">
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="p-4 border border-[var(--border)] font-serif italic text-sm hover:bg-white transition-colors cursor-pointer">
                "{rec}"
              </div>
            ))}
          </div>
        </div>

        {/* My Templates Section */}
        <div className="space-y-8">
          <p className="mono text-[#8A9A8A]">My Reusable Templates</p>
          <div className="space-y-4">
            <input 
              placeholder="제목 (예: 월요일 출근룩)" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--border)] font-serif p-2 outline-none text-sm"
            />
            <textarea 
              placeholder="자주 쓰는 본문이나 해시태그를 저장하세요..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full h-24 bg-transparent border border-[var(--border)] p-4 font-serif text-sm outline-none resize-none"
            />
            <button onClick={addTemplate} className="w-full py-3 bg-[#8A9A8A] text-white mono">Save Template</button>
          </div>
        </div>
      </section>

      <div className="grid gap-6">
        {templates.map(t => (
          <div key={t.id} className="p-6 bg-white border border-[var(--border)] flex justify-between items-center group">
            <div>
              <p className="mono text-[10px] mb-1">{t.title}</p>
              <p className="font-serif italic text-sm text-gray-500 truncate max-w-md">{t.body}</p>
            </div>
            <button onClick={() => copy(t.body)} className="mono text-[#8A9A8A] underline">Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
