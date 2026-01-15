"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useMemo } from "react";

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

export default function QuickStats() {
  const [contentPlans] = useSyncData<Record<string, ContentPlan>>("content_plans_v2", {});
  
  // 이번 주 통계 계산
  const weekStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // 일요일
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    let totalContent = 0;
    let completedContent = 0;
    
    Object.entries(contentPlans).forEach(([dateStr, plan]) => {
      const planDate = new Date(dateStr);
      if (planDate >= startOfWeek && planDate < endOfWeek) {
        totalContent++;
        if (plan.status === 'completed') {
          completedContent++;
        }
      }
    });
    
    const completionRate = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;
    
    return {
      totalContent,
      completedContent,
      completionRate
    };
  }, [contentPlans]);

  const stats = [
    {
      label: "이번 주 콘텐츠",
      value: weekStats.completedContent,
      total: weekStats.totalContent,
      icon: "✓"
    },
    {
      label: "완료율",
      value: `${weekStats.completionRate}%`,
      icon: "📊"
    },
    {
      label: "계획 대비",
      value: weekStats.completedContent,
      subtitle: `/ ${weekStats.totalContent}`,
      icon: "📸"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-black">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="px-6 py-4 flex flex-col justify-between group hover:bg-black hover:text-white transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs opacity-40">{stat.label}</span>
            <span className="text-sm">{stat.icon}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-medium">{stat.value}</div>
            {stat.total !== undefined && (
              <span className="text-xs opacity-40">/ {stat.total}</span>
            )}
            {stat.subtitle && <span className="text-xs opacity-40">{stat.subtitle}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
