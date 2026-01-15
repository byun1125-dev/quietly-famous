"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useMemo } from "react";

type UserTask = {
  id: string;
  title: string;
  time: string;
  isCompleted: boolean;
};

export default function QuickStats() {
  const [tasks] = useSyncData<Record<string, UserTask[]>>("user_calendar_tasks", {});
  
  // 이번 주 통계 계산
  const weekStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // 일요일
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    Object.entries(tasks).forEach(([dateStr, dayTasks]) => {
      const taskDate = new Date(dateStr);
      if (taskDate >= startOfWeek && taskDate < endOfWeek) {
        totalTasks += dayTasks.length;
        completedTasks += dayTasks.filter(t => t.isCompleted).length;
      }
    });
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      completionRate
    };
  }, [tasks]);

  const stats = [
    {
      label: "이번 주 완료",
      value: weekStats.completedTasks,
      total: weekStats.totalTasks,
      icon: "✓",
      color: "from-green-50 to-green-100 border-green-200"
    },
    {
      label: "완료율",
      value: `${weekStats.completionRate}%`,
      icon: "📊",
      color: "from-blue-50 to-blue-100 border-blue-200"
    },
    {
      label: "이번 주 게시물",
      value: weekStats.completedTasks,
      subtitle: "개 완료",
      icon: "📸",
      color: "from-purple-50 to-purple-100 border-purple-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-black border-b border-black">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-8 flex flex-col justify-between group hover:bg-black hover:text-white transition-colors`}
        >
          <div className="flex items-start justify-between mb-8">
            <span className="text-sm font-bold mono">{stat.label}</span>
            <span className="text-2xl group-hover:invert transition-all">{stat.icon}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-5xl font-black">{stat.value}</div>
            {stat.total !== undefined && (
              <span className="text-sm font-bold opacity-40">/ {stat.total}</span>
            )}
            {stat.subtitle && <span className="text-sm font-bold opacity-40 uppercase">{stat.subtitle}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
