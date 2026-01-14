"use client";

import { useSyncData } from "@/hooks/useSyncData";

type UserTask = {
  id: string;
  title: string;
  time: string;
  isCompleted: boolean;
};

export default function DailyQuest() {
  const [tasks, setTasks] = useSyncData<Record<string, UserTask[]>>("user_calendar_tasks", {});
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayTasks = tasks[todayStr] || [];

  const toggleTask = (id: string) => {
    setTasks(prev => ({
      ...prev,
      [todayStr]: prev[todayStr].map(t => 
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    }));
  };

  const doneCount = todayTasks.filter(t => t.isCompleted).length;

  return (
    <div className="border-b border-[var(--border)] pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="mono mb-2 text-gray-500">Today's Practice</p>
          <h2 className="text-3xl font-bold">오늘의 미션</h2>
        </div>
        <div className="text-right bg-[#8A9A8A] text-white px-6 py-3 rounded-lg">
          <p className="text-xs mb-1 opacity-80">완료</p>
          <p className="text-2xl font-bold">{doneCount} / {todayTasks.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {todayTasks.length === 0 ? (
          <div className="p-12 border border-dashed border-[var(--border)] rounded-lg text-center bg-gray-50">
            <p className="text-gray-400 mb-4 text-sm">오늘 설정된 미션이 없습니다.</p>
            <a href="/calendar" className="inline-block px-6 py-2 bg-[#8A9A8A] text-white text-sm font-medium rounded-lg hover:bg-[#7a8a7a] transition-colors">
              캘린더에서 할 일 추가하기
            </a>
          </div>
        ) : (
          todayTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="group cursor-pointer bg-white border border-[var(--border)] p-5 rounded-lg hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-5 flex-1">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.isCompleted 
                    ? 'bg-[#8A9A8A] border-[#8A9A8A]' 
                    : 'border-gray-300 group-hover:border-[#8A9A8A]'
                }`}>
                  {task.isCompleted && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="mono text-xs text-gray-400 w-12">{task.time}</span>
                <span className={`text-base font-medium ${task.isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
                  {task.title}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
