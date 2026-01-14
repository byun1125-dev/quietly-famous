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
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">이번 주 요약</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 bg-gradient-to-br ${stat.color} border-2 rounded-lg`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{stat.icon}</span>
              {stat.total !== undefined && (
                <span className="text-xs text-gray-500 font-medium">/ {stat.total}</span>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">
              {stat.label}
              {stat.subtitle && <span className="ml-1 text-xs">{stat.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
