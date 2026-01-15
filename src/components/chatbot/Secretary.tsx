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

// 오전 6시 기준으로 날짜 계산
const getDisplayDate = () => {
  const now = new Date();
  const hour = now.getHours();
  
  // 오전 6시 이전이면 전날로 간주
  if (hour < 6) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toLocaleDateString('en-CA');
  }
  
  return now.toLocaleDateString('en-CA');
};

export default function Secretary() {
  const [isOpen, setIsOpen] = useState(false);
  const [hiddenUntil, setHiddenUntil] = useSyncData<string>("secretary_hidden_until", "");
  const [contentPlans] = useSyncData<Record<string, ContentPlan>>("content_plans_v2", {});
  
  const displayDate = getDisplayDate();
  
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayPlan = contentPlans[todayStr];
  
  // 숨김 상태 확인
  const isHidden = hiddenUntil === displayDate;

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
  
  const hideToday = () => {
    setHiddenUntil(displayDate);
    setIsOpen(false);
  };
  
  // 숨김 상태면 렌더링 안함
  if (isHidden) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-black bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-40">AI Secretary</p>
                <h4 className="text-lg font-normal mt-1">Live Assistant</h4>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center border border-black text-xs hover:bg-black hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="divide-y divide-black max-h-[70vh] overflow-y-auto">
            {/* Greeting */}
            <div className="px-6 py-4 bg-white">
              <p className="text-sm opacity-60">{intelligence.greeting}</p>
            </div>

            {/* Situation */}
            <div className="px-6 py-4">
              <p className="text-xs opacity-40 mb-2">현재 상황</p>
              <p className="text-sm font-medium leading-relaxed">{intelligence.situation}</p>
            </div>

            {/* Weekly Stats */}
            {intelligence.weeklyInsight && (
              <div className="px-6 py-4 bg-[#F5F5F2]">
                <p className="text-xs opacity-40 mb-2">이번 주</p>
                <p className="text-sm">{intelligence.weeklyInsight}</p>
              </div>
            )}

            {/* Advice */}
            <div className="px-6 py-4">
              <p className="text-xs opacity-40 mb-2">제안</p>
              <p className="text-sm leading-relaxed">{intelligence.advice}</p>
            </div>

            {/* Quick Actions */}
            {intelligence.actions.length > 0 && (
              <div className="p-6 bg-white">
                <p className="text-xs opacity-40 mb-3">빠른 액션</p>
                <div className="space-y-2">
                  {intelligence.actions.map((action, idx) => (
                    <a
                      key={idx}
                      href={action.link}
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-3 px-4 border border-black text-xs text-center hover:bg-black hover:text-white transition-colors"
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hide Today */}
            <div className="p-6 pt-0 bg-white">
              <button
                onClick={hideToday}
                className="w-full py-2 px-4 text-xs opacity-40 hover:opacity-100 transition-opacity"
              >
                오늘은 더 이상 보지 않기
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 flex items-center justify-center text-2xl transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${
          isOpen 
            ? "bg-black text-white" 
            : "bg-white text-black"
        }`}
        title="AI 비서"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
