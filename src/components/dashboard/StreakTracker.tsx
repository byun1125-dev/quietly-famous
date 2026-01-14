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
    <div className="bg-gradient-to-br from-[#8A9A8A]/5 to-transparent border border-[var(--border)] p-8 rounded-lg">
      <p className="mono mb-6 text-gray-500">Continuity</p>
      <div className="flex items-baseline gap-8">
        <span className="text-[10rem] font-bold leading-none text-[#8A9A8A]">
          {streak}
        </span>
        <div className="space-y-2">
          <p className="text-3xl font-bold">Days</p>
          <p className="text-sm text-gray-500">연속 실천 중</p>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        <p className="max-w-md text-sm leading-relaxed text-gray-600">
          {streak > 0 
            ? "당신의 꾸준함은 조용한 파동이 되어 멀리 퍼져나갑니다. 계속해서 작은 실천을 이어가세요." 
            : "새로운 시작은 언제나 가장 아름다운 법입니다. 첫 발을 내디뎌 보세요."}
        </p>
      </div>
    </div>
  );
}
