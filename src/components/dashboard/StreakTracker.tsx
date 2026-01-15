"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useEffect, useState } from "react";

type ContentPlan = {
  id: string;
  type: 'reels' | 'feed' | 'story';
  topic: string;
  details: string;
  hashtags: string;
  status: 'planning' | 'creating' | 'completed';
  checklist: { id: string; text: string; isCompleted: boolean }[];
  createdAt: number;
};

export default function StreakTracker() {
  const [contentPlans] = useSyncData<Record<string, ContentPlan>>("content_plans_v2", {});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = () => {
      let count = 0;
      const today = new Date();
      
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toLocaleDateString('en-CA');
        
        if (contentPlans[dateStr]) {
          count++;
        } else {
          if (i > 0) break;
        }
      }
      setStreak(count);
    };

    calculateStreak();
  }, [contentPlans]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs opacity-40">The Desk</p>
        <h2 className="text-xl font-normal mt-2">
          Today's Workspace
        </h2>
        <p className="text-sm leading-relaxed opacity-60 mt-3">
          오늘의 작업과 통계를 한눈에 확인하고, 꾸준한 성장을 추적하세요.
        </p>
      </div>

      <div className="pt-4 border-t border-black">
        <p className="text-xs opacity-40 mb-3">Streak</p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-medium leading-none">
            {streak}
          </span>
          <div className="space-y-0">
            <p className="text-lg font-normal">Days</p>
            <p className="text-xs opacity-40">연속 계획</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed opacity-60 mt-3">
          {streak > 0 
            ? "꾸준함이 만드는 변화" 
            : "새로운 시작"}
        </p>
      </div>
    </div>
  );
}
