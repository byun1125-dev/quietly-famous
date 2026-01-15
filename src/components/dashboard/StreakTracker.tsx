"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useEffect, useState } from "react";

export default function StreakTracker() {
  const [history] = useSyncData<Record<string, string[]>>("mission_history", {});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = () => {
      let count = 0;
      const today = new Date();
      
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toLocaleDateString('en-CA');
        
        if (history[dateStr] && history[dateStr].length > 0) {
          count++;
        } else {
          if (i > 0) break;
        }
      }
      setStreak(count);
    };

    calculateStreak();
  }, [history]);

  return (
    <div className="flex flex-col h-full justify-between">
      <p className="mono mb-4 font-bold">Continuity Tracker</p>
      <div className="flex items-baseline gap-4">
        <span className="text-6xl md:text-7xl font-black leading-none tracking-tighter">
          {streak}
        </span>
        <div className="space-y-0">
          <p className="text-2xl font-black uppercase italic">Days.</p>
          <p className="mono font-bold text-[#8A9A8A]">In Practice</p>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="text-sm font-medium leading-relaxed text-gray-500 italic max-w-[200px]">
          {streak > 0 
            ? "당신의 꾸준함은 조용한 파동이 되어 멀리 퍼져나갑니다." 
            : "새로운 시작은 항상 가장 아름다운 법입니다."}
        </p>
      </div>
    </div>
  );
}
