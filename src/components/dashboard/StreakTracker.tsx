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
    <div className="card-minimal border-none pt-0">
      <p className="mono mb-8">Continuity</p>
      <div className="flex items-baseline gap-6">
        <span className="text-[12rem] font-serif italic leading-none tracking-tighter">
          {streak}
        </span>
        <div className="space-y-1">
          <p className="text-2xl font-serif italic tracking-tighter">Days.</p>
          <p className="mono text-[#8A9A8A]">In Practice</p>
        </div>
      </div>
      
      <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-8 border-t border-[var(--border)] pt-8">
        <p className="max-w-xs text-sm font-serif italic leading-relaxed text-gray-500">
          {streak > 0 
            ? "당신의 꾸준함은 조용한 파동이 되어 멀리 퍼져나갑니다." 
            : "새로운 시작은 언제나 가장 아름다운 법입니다. 첫 발을 내디뎌 보세요."}
        </p>
      </div>
    </div>
  );
}
