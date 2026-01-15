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
      <p className="text-xs opacity-40 mb-2">Streak</p>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-medium leading-none">
          {streak}
        </span>
        <div className="space-y-0">
          <p className="text-lg font-normal">Days</p>
          <p className="text-xs opacity-40">In practice</p>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-xs leading-relaxed opacity-60 max-w-[200px]">
          {streak > 0 
            ? "꾸준함이 만드는 변화" 
            : "새로운 시작"}
        </p>
      </div>
    </div>
  );
}
