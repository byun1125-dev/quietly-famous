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
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <p className="mono mb-2 font-bold uppercase text-[#8A9A8A]">Active Tasks</p>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Practice List.</h2>
        </div>
        <div className="text-right">
          <p className="mono font-bold uppercase">Status</p>
          <p className="font-black text-3xl italic">{doneCount} / {todayTasks.length}</p>
        </div>
      </div>

      <div className="divide-y divide-black border-y border-black">
        {todayTasks.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium mb-6 uppercase tracking-widest text-sm">No tasks assigned for today.</p>
            <a href="/calendar" className="inline-block px-8 py-4 border border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-all">
              Go to Calendar
            </a>
          </div>
        ) : (
          todayTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="group cursor-pointer py-8 flex items-center justify-between hover:px-4 transition-all"
            >
              <div className="flex items-center gap-8">
                <span className="mono font-bold text-lg opacity-20 group-hover:opacity-100 transition-opacity">{task.time}</span>
                <span className={`text-lg font-bold tracking-tight ${task.isCompleted ? "line-through opacity-30" : ""}`}>
                  {task.title}
                </span>
              </div>
              <div className={`w-8 h-8 border-2 border-black flex items-center justify-center transition-all ${task.isCompleted ? "bg-black" : "group-hover:bg-[#8A9A8A]/20"}`}>
                {task.isCompleted && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
