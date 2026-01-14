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
    <div className="card-minimal">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="mono mb-2">The Desk</p>
          <h2 className="text-3xl font-serif italic tracking-tighter">Today's Practice.</h2>
        </div>
        <div className="text-right">
          <p className="mono">Progress</p>
          <p className="font-serif italic text-2xl">{doneCount} / {todayTasks.length}</p>
        </div>
      </div>

      <div className="space-y-6">
        {todayTasks.length === 0 ? (
          <div className="p-12 border border-dashed border-[var(--border)] text-center">
            <p className="text-gray-400 font-serif italic mb-4 text-sm">오늘 설정된 미션이 없습니다.</p>
            <a href="/calendar" className="text-xs font-black uppercase tracking-widest text-[#8A9A8A] underline">
              캘린더에서 할 일 추가하기
            </a>
          </div>
        ) : (
          todayTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="group cursor-pointer flex items-center justify-between border-b border-[var(--border)] py-4 hover:pl-2 transition-all"
            >
              <div className="flex items-center gap-6">
                <span className="mono text-gray-300">{task.time}</span>
                <span className={`text-xl font-serif ${task.isCompleted ? "line-through text-gray-300" : ""}`}>
                  {task.title}
                </span>
              </div>
              <div className={`w-3 h-3 rounded-full border border-black ${task.isCompleted ? "bg-[#8A9A8A] border-[#8A9A8A]" : "bg-transparent"}`}></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
