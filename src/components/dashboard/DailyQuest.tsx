"use client";

import { useSyncData } from "@/hooks/useSyncData";

type ContentPlan = {
  id: string;
  type: 'reels' | 'feed' | 'story';
  topic: string;
  details: string;
  hashtags: string;
  status: 'planning' | 'creating' | 'completed';
  checklist: ChecklistItem[];
  createdAt: number;
};

type ChecklistItem = {
  id: string;
  text: string;
  isCompleted: boolean;
};

export default function DailyQuest() {
  const [contentPlans, setContentPlans] = useSyncData<Record<string, ContentPlan>>("content_plans_v2", {});
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayPlan = contentPlans[todayStr];

  const toggleChecklistItem = (itemId: string) => {
    if (!todayPlan) return;
    
    setContentPlans(prev => ({
      ...prev,
      [todayStr]: {
        ...prev[todayStr],
        checklist: prev[todayStr].checklist.map(item =>
          item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
        )
      }
    }));
  };

  const doneCount = todayPlan?.checklist.filter(item => item.isCompleted).length || 0;
  const totalCount = todayPlan?.checklist.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs opacity-40 mb-1">Today's Content</p>
          <h2 className="text-lg font-medium">오늘의 계획</h2>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-40">Progress</p>
          <p className="text-xl">{doneCount} / {totalCount}</p>
        </div>
      </div>

      <div className="divide-y divide-black border-y border-black">
        {!todayPlan ? (
          <div className="py-12 text-center">
            <p className="text-xs opacity-20 mb-4">오늘의 콘텐츠가 없습니다</p>
            <a href="/calendar" className="inline-block px-4 py-2 border border-black text-xs hover:bg-black hover:text-white transition-all">
              캘린더에서 계획하기
            </a>
          </div>
        ) : (
          <>
            <div className="py-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs ${
                  todayPlan.type === 'reels' ? 'bg-purple-100' :
                  todayPlan.type === 'feed' ? 'bg-blue-100' :
                  'bg-pink-100'
                }`}>
                  {todayPlan.type === 'reels' ? '릴스' :
                   todayPlan.type === 'feed' ? '피드' : '스토리'}
                </span>
                <span className={`px-2 py-1 text-xs ${
                  todayPlan.status === 'completed' ? 'bg-green-100' :
                  todayPlan.status === 'creating' ? 'bg-yellow-100' :
                  'bg-gray-100'
                }`}>
                  {todayPlan.status === 'completed' ? '완료' :
                   todayPlan.status === 'creating' ? '제작중' : '계획중'}
                </span>
              </div>
              <h3 className="text-base font-medium">{todayPlan.topic}</h3>
              {todayPlan.details && (
                <p className="text-sm opacity-60 line-clamp-2">{todayPlan.details}</p>
              )}
            </div>

            {todayPlan.checklist.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className="group cursor-pointer py-4 flex items-center justify-between transition-all"
              >
                <span className={`text-sm ${item.isCompleted ? "line-through opacity-30" : ""}`}>
                  {item.text}
                </span>
                <div className={`w-5 h-5 border border-black flex items-center justify-center transition-all ${item.isCompleted ? "bg-black" : ""}`}>
                  {item.isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
