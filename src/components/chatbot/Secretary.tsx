"use client";

import { useState, useEffect, useMemo } from "react";
import { useSyncData } from "@/hooks/useSyncData";

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

export default function Secretary() {
  const [isOpen, setIsOpen] = useState(false);
  const [contentPlans] = useSyncData<Record<string, ContentPlan>>("content_plans_v2", {});
  
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayPlan = contentPlans[todayStr];

  // 이번 주 통계
  const weekStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    let total = 0;
    let completed = 0;
    
    Object.entries(contentPlans).forEach(([dateStr, plan]) => {
      const planDate = new Date(dateStr);
      if (planDate >= startOfWeek && planDate < endOfWeek) {
        total++;
        if (plan.status === 'completed') completed++;
      }
    });
    
    return { total, completed, rate: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [contentPlans]);

  // 내일 계획 확인
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('en-CA');
  }, []);
  const tomorrowPlan = contentPlans[tomorrow];

  // 지능형 메시지 생성
  const intelligence = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    let greeting = "";
    let situation = "";
    let advice = "";
    let actions: { label: string; link: string }[] = [];

    // 인사말 (시간대별)
    if (hour < 12) greeting = "좋은 아침이에요";
    else if (hour < 18) greeting = "오후 작업 중이시군요";
    else greeting = "오늘 하루 수고하셨어요";

    // 상황 분석 및 조언
    if (todayPlan) {
      const doneCount = todayPlan.checklist.filter(item => item.isCompleted).length;
      const totalCount = todayPlan.checklist.length;
      
      if (todayPlan.status === 'completed') {
        situation = `오늘 콘텐츠 '${todayPlan.topic}' 완료하셨네요! 👏`;
        advice = tomorrowPlan 
          ? `내일은 '${tomorrowPlan.topic}' 준비해야 해요`
          : "내일 계획을 미리 세워두는 건 어떨까요?";
        actions = [
          { label: "내일 계획하기", link: "/calendar" }
        ];
      } else if (doneCount === 0) {
        situation = `오늘 '${todayPlan.topic}' (${todayPlan.type === 'reels' ? '릴스' : todayPlan.type === 'feed' ? '피드' : '스토리'}) 계획이 있어요`;
        advice = hour < 12 
          ? "아직 시간이 충분해요. 하나씩 시작해볼까요?"
          : "지금 시작하면 늦지 않았어요. 첫 번째 작업부터 체크해보세요";
        actions = [
          { label: "오늘 작업 보기", link: "/" }
        ];
      } else if (doneCount < totalCount) {
        situation = `'${todayPlan.topic}' ${doneCount}/${totalCount} 진행 중`;
        advice = `${totalCount - doneCount}개만 더 하면 완료예요! 거의 다 왔어요`;
        actions = [
          { label: "작업 계속하기", link: "/" }
        ];
      } else {
        situation = `'${todayPlan.topic}' 체크리스트 완료!`;
        advice = "상태를 '완료'로 변경하는 것 잊지 마세요";
        actions = [
          { label: "완료 처리하기", link: "/calendar" }
        ];
      }
    } else {
      situation = "오늘 계획이 아직 없어요";
      advice = hour < 14
        ? "지금 10분만 투자해서 오늘 콘텐츠 계획을 세워보는 건 어떨까요?"
        : "내일을 위해 미리 계획을 세워두면 아침이 편해질 거예요";
      actions = [
        { label: "계획 세우기", link: "/calendar" }
      ];
    }

    // 주간 통계 추가
    let weeklyInsight = "";
    if (weekStats.total > 0) {
      if (weekStats.rate >= 80) {
        weeklyInsight = `이번 주 ${weekStats.rate}% 달성 중! 정말 잘하고 계세요 🔥`;
      } else if (weekStats.rate >= 50) {
        weeklyInsight = `이번 주 ${weekStats.completed}/${weekStats.total} 완료. 페이스 좋아요!`;
      } else {
        weeklyInsight = `이번 주 ${weekStats.completed}/${weekStats.total}... 지금부터라도 따라잡아봐요`;
      }
    }

    // 추가 액션 제안
    if (hour >= 19 && day !== 0) {
      actions.push({ label: "영감 아카이브", link: "/archive" });
    }

    return { greeting, situation, advice, weeklyInsight, actions };
  }, [todayPlan, tomorrowPlan, weekStats]);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 bg-white border border-black shadow-lg animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-black bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">AI Secretary</h4>
                <p className="text-xs opacity-40">실시간 어시스턴트</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-sm opacity-40 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-4 space-y-4 max-h-[500px] overflow-y-auto">
            {/* Greeting */}
            <div className="pb-3 border-b border-black">
              <p className="text-xs opacity-60">{intelligence.greeting}</p>
            </div>

            {/* Situation */}
            <div>
              <p className="text-xs opacity-40 mb-1">현재 상황</p>
              <p className="text-sm font-medium">{intelligence.situation}</p>
            </div>

            {/* Weekly Stats */}
            {intelligence.weeklyInsight && (
              <div className="p-3 bg-[#F5F5F2] border border-black">
                <p className="text-xs">{intelligence.weeklyInsight}</p>
              </div>
            )}

            {/* Advice */}
            <div>
              <p className="text-xs opacity-40 mb-1">제안</p>
              <p className="text-sm leading-relaxed">{intelligence.advice}</p>
            </div>

            {/* Quick Actions */}
            {intelligence.actions.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs opacity-40">빠른 액션</p>
                {intelligence.actions.map((action, idx) => (
                  <a
                    key={idx}
                    href={action.link}
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-2 px-3 border border-black text-xs text-center hover:bg-black hover:text-white transition-colors"
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 flex items-center justify-center text-xl transition-all border border-black ${
          isOpen 
            ? "bg-black text-white" 
            : "bg-white text-black hover:bg-black hover:text-white"
        }`}
        title="AI 비서"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
