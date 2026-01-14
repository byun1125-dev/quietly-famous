"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState } from "react";

type UserTask = {
  id: string;
  title: string;
  time: string;
  isCompleted: boolean;
};

export default function CalendarPage() {
  const [tasks, setTasks] = useSyncData<Record<string, UserTask[]>>("user_calendar_tasks", {});
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const addTask = () => {
    if (!newTask) return;
    const task: UserTask = {
      id: Math.random().toString(36).substring(7),
      title: newTask,
      time: newTime,
      isCompleted: false
    };
    
    setTasks(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), task]
    }));
    setNewTask("");
  };

  const deleteTask = (id: string) => {
    setTasks(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter(t => t.id !== id)
    }));
  };

  return (
    <div className="space-y-12">
      <header className="card-minimal">
        <p className="mono mb-2">Scheduling</p>
        <h2 className="text-4xl font-serif italic">Mission Calendar.</h2>
      </header>

      <div className="grid md:grid-cols-[1fr_2fr] gap-12">
        {/* Date Selector */}
        <section className="space-y-4">
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-4 bg-white border border-[var(--border)] font-mono text-sm"
          />
          <div className="p-4 bg-[#EBEBE6] border border-[var(--border)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Quick Tip</p>
            <p className="text-xs font-serif leading-relaxed text-gray-700 italic">
              "동생아, 하루에 너무 많은 미션은 독이 돼. 3가지만 제대로 해도 인플루언서가 될 수 있어."
            </p>
          </div>
        </section>

        {/* Task Manager */}
        <section className="space-y-8">
          <div className="space-y-4 border-b border-[var(--border)] pb-8">
            <div className="flex gap-4">
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="bg-transparent border-b border-black font-mono text-sm outline-none"
              />
              <input 
                placeholder="어떤 미션을 추가할까요?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 bg-transparent border-b border-black font-serif italic text-lg outline-none"
              />
              <button onClick={addTask} className="text-sm font-black uppercase tracking-[0.2em] text-[#8A9A8A]">Add</button>
            </div>
          </div>

          <div className="space-y-4">
            {(tasks[selectedDate] || []).length === 0 ? (
              <p className="text-gray-300 font-serif italic">이날은 아직 계획이 없습니다.</p>
            ) : (
              tasks[selectedDate].map((task) => (
                <div key={task.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <span className="mono text-gray-400">{task.time}</span>
                    <span className="font-serif text-lg">{task.title}</span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase text-red-300">Delete</button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
