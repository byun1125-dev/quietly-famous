"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useEffect, useState } from "react";

export default function StreakTracker() {
  const [history] = useSyncData<Record<string, string[]>>("mission_history", {});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // 실시간 스트릭 계산 로직
    const calculateStreak = () => {
      let count = 0;
      const today = new Date();
      
      // 오늘부터 과거로 거슬러 올라가며 연속 완료 확인
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toLocaleDateString('en-CA');
        
        // 해당 날짜가 평일(월-금) 또는 특정 미션일인데 완료 기록이 있는지 확인
        // (간단하게 '어떤 미션이라도 완료한 날'을 스트릭으로 계산)
        if (history[dateStr] && history[dateStr].length > 0) {
          count++;
        } else {
          // 어제까지 완료 안 했으면 스트릭 종료 (오늘은 아직 안 했을 수 있으므로 i=0은 예외처리 가능)
          if (i > 0) break;
        }
      }
      setStreak(count);
    };

    calculateStreak();
  }, [history]);

  return (
    <div className="card-minimal bg-[#FF5C00] text-white -mx-6 md:-mx-20 px-6 md:px-20 py-20 border-none">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Current Streak</h3>
        <div className="flex items-baseline gap-4">
          <span className="text-[12rem] md:text-[18rem] font-black leading-[0.8] tracking-tighter">
            {streak}
          </span>
          <span className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Days</span>
        </div>
        
        <div className="mt-20 border-t-4 border-white pt-8 flex flex-col md:flex-row justify-between items-start gap-8">
          <p className="max-w-xs text-xl font-bold leading-tight uppercase">
            {streak > 0 ? "Keep that flame burning. You are doing great." : "Start your journey today. One shot is all it takes."}
          </p>
          <div className="bg-white text-black p-6 font-black text-xs uppercase tracking-widest">
            {streak > 0 ? "STREAK ACTIVE" : "READY TO START"}
          </div>
        </div>
      </div>
    </div>
  );
}
