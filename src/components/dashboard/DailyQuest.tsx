"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useEffect, useState } from "react";

const MISSIONS = [
  { id: "daily-ootd", title: "현관 컷 촬영", days: [1, 2, 3, 4, 5] },
  { id: "wed-gallery", title: "갤러리 털기", days: [3] },
  { id: "sun-reels", title: "주간 결산", days: [0] },
];

export default function DailyQuest() {
  // completed_history: { [dateString]: string[] } -> 날짜별 완료 미션 ID 배열
  const [history, setHistory] = useSyncData<Record<string, string[]>>("mission_history", {});
  const [activeMissions, setActiveMissions] = useState<typeof MISSIONS>([]);
  
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  useEffect(() => {
    const today = new Date().getDay();
    setActiveMissions(MISSIONS.filter(m => m.days.includes(today)));
  }, []);

  const todayCompleted = history[todayStr] || [];
  const total = activeMissions.length;
  const done = todayCompleted.filter(id => activeMissions.some(m => m.id === id)).length;

  const toggleMission = (id: string) => {
    setHistory(prev => {
      const current = prev[todayStr] || [];
      const updated = current.includes(id) 
        ? current.filter(i => i !== id) 
        : [...current, id];
      return { ...prev, [todayStr]: updated };
    });
  };

  return (
    <div className="card-minimal">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Daily Quest</h3>
          <p className="text-6xl font-black">{done} <span className="text-gray-200">/ {total || 1}</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-gray-400">Status</p>
          <p className="font-bold">{total > 0 && done === total ? "ALL CLEAR" : "IN PROGRESS"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeMissions.map((mission) => {
          const isDone = todayCompleted.includes(mission.id);
          return (
            <button
              key={mission.id}
              onClick={() => toggleMission(mission.id)}
              className={`aspect-square flex flex-col justify-between p-4 border-2 border-black transition-all ${isDone ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"}`}
            >
              <div className="text-right font-black text-xl">{isDone ? "●" : "○"}</div>
              <div className="text-left font-bold text-sm leading-tight uppercase">{mission.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
