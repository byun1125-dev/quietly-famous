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
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs opacity-40 mb-1">Today's Tasks</p>
          <h2 className="text-lg font-medium">Practice List</h2>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-40">Status</p>
          <p className="text-xl">{doneCount} / {todayTasks.length}</p>
        </div>
      </div>

      <div className="divide-y divide-black border-y border-black">
        {todayTasks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-xs opacity-20 mb-4">No tasks for today</p>
            <a href="/calendar" className="inline-block px-4 py-2 border border-black text-xs hover:bg-black hover:text-white transition-all">
              Go to Calendar
            </a>
          </div>
        ) : (
          todayTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="group cursor-pointer py-4 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs opacity-40">{task.time}</span>
                <span className={`text-sm ${task.isCompleted ? "line-through opacity-30" : ""}`}>
                  {task.title}
                </span>
              </div>
              <div className={`w-5 h-5 border border-black flex items-center justify-center transition-all ${task.isCompleted ? "bg-black" : ""}`}>
                {task.isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
