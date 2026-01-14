"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState, useMemo } from "react";

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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth]);

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

  const toggleTask = (id: string) => {
    setTasks(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(t => 
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    }));
  };

  const hasTasksOnDate = (day: number | null) => {
    if (!day) return false;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString('en-CA');
    return tasks[dateStr] && tasks[dateStr].length > 0;
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString('en-CA');
    return dateStr === new Date().toLocaleDateString('en-CA');
  };

  const isSelectedDay = (day: number | null) => {
    if (!day) return false;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString('en-CA');
    return dateStr === selectedDate;
  };

  const selectDay = (day: number | null) => {
    if (!day) return;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString('en-CA');
    setSelectedDate(dateStr);
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="card-minimal">
        <p className="mono mb-2">Scheduling</p>
        <h2 className="text-4xl font-bold">Mission Calendar.</h2>
      </header>

      <div className="grid md:grid-cols-[2fr_3fr] gap-8">
        {/* Calendar View */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={goToPrevMonth} className="p-2 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h3 className="text-lg font-semibold">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </h3>
            <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="bg-white border border-[var(--border)] p-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                <div key={day} className={`text-center text-xs font-medium ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}`}>
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => selectDay(day)}
                  disabled={!day}
                  className={`aspect-square flex flex-col items-center justify-center text-sm rounded transition-all relative ${
                    !day ? 'invisible' : 
                    isSelectedDay(day) ? 'bg-[#8A9A8A] text-white font-semibold' :
                    isToday(day) ? 'border-2 border-[#8A9A8A] font-semibold' :
                    'hover:bg-gray-100'
                  }`}
                >
                  {day}
                  {hasTasksOnDate(day) && (
                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelectedDay(day) ? 'bg-white' : 'bg-[#8A9A8A]'}`}></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#EBEBE6] border border-[var(--border)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Quick Tip</p>
            <p className="text-xs leading-relaxed text-gray-700">
              "하루에 너무 많은 미션은 독이 돼. 3가지만 제대로 해도 인플루언서가 될 수 있어."
            </p>
          </div>
        </section>

        {/* Task Manager */}
        <section className="space-y-6">
          <div className="bg-white border border-[var(--border)] p-6">
            <h3 className="text-sm font-semibold mb-4 text-gray-700">
              {new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
            </h3>
            <div className="flex gap-3">
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="bg-gray-50 border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#8A9A8A] transition-colors rounded"
              />
              <input 
                placeholder="새 미션 추가..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#8A9A8A] transition-colors rounded"
              />
              <button 
                onClick={addTask} 
                className="px-5 py-2 bg-[#8A9A8A] text-white text-sm font-medium rounded hover:bg-[#7a8a7a] transition-colors"
              >
                추가
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(tasks[selectedDate] || []).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[var(--border)] bg-gray-50">
                <p className="text-gray-400 text-sm">이날은 아직 계획이 없습니다.</p>
              </div>
            ) : (
              tasks[selectedDate]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-white border border-[var(--border)] p-4 flex items-center justify-between group hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.isCompleted 
                            ? 'bg-[#8A9A8A] border-[#8A9A8A]' 
                            : 'border-gray-300 hover:border-[#8A9A8A]'
                        }`}
                      >
                        {task.isCompleted && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className="mono text-xs text-gray-400 w-12">{task.time}</span>
                      <span className={`text-base ${task.isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)} 
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 transition-all"
                    >
                      삭제
                    </button>
                  </div>
                ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
