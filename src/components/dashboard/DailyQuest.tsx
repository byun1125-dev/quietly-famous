"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useEffect, useState } from "react";

type Mission = {
  id: string;
  title: string;
  time: string;
  action: string;
  tip?: string;
  days: number[];
};

const MISSIONS: Mission[] = [
  {
    id: "daily-ootd",
    title: "현관 컷 촬영 & 업로드",
    time: "08:30",
    action: "준비물: 전신거울, 스마트폰",
    tip: "멘트 고민 금지. '오늘 춥다', '버스 놓침' 같은 사실만 적기.",
    days: [1, 2, 3, 4, 5],
  },
  {
    id: "wed-gallery",
    title: "갤러리 털기",
    time: "13:00",
    action: "이번 주 찍은 음식/풍경/소품 사진 3장 고르기",
    tip: "스토리나 피드(캐러셀)에 무심하게 올리기.",
    days: [3],
  },
  {
    id: "sun-reels",
    title: "주간 결산 (릴스 제작)",
    time: "20:00",
    action: "월~금 스토리 하이라이트 다운로드 → 컷 편집 → 예약 발행",
    tip: "음악 씌우고 한 주를 마무리하세요.",
    days: [0],
  },
];

export default function DailyQuest() {
  const [history, setHistory] = useSyncData<Record<string, string[]>>("mission_history", {});
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayCompleted = history[todayStr] || [];

  useEffect(() => {
    const today = new Date().getDay();
    setActiveMissions(MISSIONS.filter(m => m.days.includes(today)));
  }, []);

  const toggleMission = (id: string) => {
    setHistory(prev => {
      const current = prev[todayStr] || [];
      const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
      return { ...prev, [todayStr]: updated };
    });
  };

  return (
    <div className="card-minimal">
      <div className="mb-12">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-[#FF5C00]">Today's Quest</h3>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Daily Mission.</h2>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
          {activeMissions.length === 0 ? "Enjoy your free day" : `${todayCompleted.length} / ${activeMissions.length} COMPLETED`}
        </p>
      </div>

      <div className="space-y-6">
        {activeMissions.map((m) => {
          const isDone = todayCompleted.includes(m.id);
          return (
            <div 
              key={m.id}
              onClick={() => toggleMission(m.id)}
              className={`group cursor-pointer border-2 border-black p-6 transition-all ${isDone ? "bg-black text-white" : "bg-white text-black hover:translate-x-1"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black px-2 py-1 border border-black ${isDone ? "bg-white text-black" : "bg-black text-white"}`}>
                  {m.time}
                </span>
                <span className="text-xl font-black">{isDone ? "✓" : "○"}</span>
              </div>
              <h4 className={`text-xl font-black uppercase tracking-tighter mb-2 ${isDone ? "line-through opacity-40" : ""}`}>
                {m.title}
              </h4>
              <p className={`text-xs font-bold mb-4 ${isDone ? "opacity-40" : "text-gray-500"}`}>{m.action}</p>
              
              {!isDone && m.tip && (
                <div className="bg-[#FF5C00] text-white p-3 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  TIP: {m.tip}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
