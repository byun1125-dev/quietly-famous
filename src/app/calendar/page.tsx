"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState, useMemo } from "react";

type UserTask = {
  id: string;
  title: string;
  time: string;
  isCompleted: boolean;
};

type WeeklyTheme = {
  day: number; // 0=일요일, 1=월요일 ... 6=토요일
  theme: string;
  icon: string;
};

const DEFAULT_THEMES: WeeklyTheme[] = [
  { day: 1, theme: "월요일 출근룩", icon: "👔" },
  { day: 3, theme: "수요일 브이로그", icon: "🎬" },
  { day: 5, theme: "금요일 일상", icon: "✨" },
];

export default function CalendarPage() {
  const [tasks, setTasks] = useSyncData<Record<string, UserTask[]>>("user_calendar_tasks", {});
  const [weeklyThemes, setWeeklyThemes] = useSyncData<WeeklyTheme[]>("weekly_themes", DEFAULT_THEMES);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showThemeModal, setShowThemeModal] = useState(false);

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

  const getDayOfWeek = (day: number | null) => {
    if (!day) return -1;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.getDay();
  };

  const getThemeForDay = (day: number | null) => {
    const dayOfWeek = getDayOfWeek(day);
    return weeklyThemes.find(t => t.day === dayOfWeek);
  };

  return (
    <div className="flex flex-col h-full divide-y divide-black bg-white">
      {/* Header Info Section */}
      <section className="p-8 md:p-12 border-b border-black">
        <p className="mono font-bold text-[#8A9A8A] mb-4">Mission Tracking</p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] uppercase">
          Mission<br/>Calendar.
        </h2>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] divide-x divide-black">
        {/* Left: Weekly Themes & Date Info */}
        <aside className="divide-y divide-black flex flex-col bg-[#F5F5F2]">
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black uppercase text-xl">Weekly Themes</h3>
              <button onClick={() => setShowThemeModal(true)} className="mono font-bold hover:underline">Edit &gt;</button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((dayName, dayIndex) => {
                const theme = weeklyThemes.find(t => t.day === dayIndex);
                return (
                  <div key={dayIndex} className="flex items-center gap-4 p-3 border border-black/10 bg-white">
                    <span className="mono font-bold w-6 opacity-30">{dayName}</span>
                    {theme ? (
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xl">{theme.icon}</span>
                        <span className="text-xs font-bold truncate uppercase">{theme.theme}</span>
                      </div>
                    ) : <span className="text-xs mono opacity-20">-</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-8 bg-black text-white">
            <p className="mono mb-2 opacity-50">Selected Date</p>
            <h3 className="text-xl font-black tracking-tighter">
              {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', weekday: 'short' }).toUpperCase()}
            </h3>
          </div>

          <div className="flex-1 p-8">
            <div className="p-6 border border-black bg-white">
              <p className="mono font-bold mb-4">Quick Tip</p>
              <p className="text-sm font-medium leading-relaxed italic">
                "하루에 너무 많은 미션은 독이 돼. 3가지만 제대로 해도 인플루언서가 될 수 있어."
              </p>
            </div>
          </div>
        </aside>

        {/* Right: Calendar Grid & Task Manager */}
        <div className="divide-y divide-black">
          {/* Month Navigation */}
          <div className="p-8 flex items-center justify-between">
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              {currentMonth.getFullYear()} / {String(currentMonth.getMonth() + 1).padStart(2, '0')}
            </h3>
            <div className="flex border border-black">
              <button onClick={goToPrevMonth} className="p-4 hover:bg-black hover:text-white transition-colors border-r border-black font-bold mono">&lt; Prev</button>
              <button onClick={goToNextMonth} className="p-4 hover:bg-black hover:text-white transition-colors font-bold mono">Next &gt;</button>
            </div>
          </div>

          {/* Main Calendar Grid */}
          <div className="grid grid-cols-7 border-t border-black bg-black gap-[1px]">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
              <div key={day} className={`bg-[#F5F5F2] p-4 text-center text-[10px] font-black tracking-widest ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}`}>
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const theme = getThemeForDay(day);
              const dateStr = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString('en-CA') : '';
              const isSelected = dateStr === selectedDate;
              const isTodayDate = dateStr === new Date().toLocaleDateString('en-CA');
              
              return (
                <div 
                  key={index}
                  onClick={() => selectDay(day)}
                  className={`bg-white aspect-square p-2 md:p-4 border-black group cursor-pointer transition-all hover:bg-black hover:text-white flex flex-col justify-between ${!day ? 'bg-[#EBEBE6] pointer-events-none' : ''} ${isSelected ? 'bg-[#8A9A8A] text-white ring-2 ring-inset ring-black' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-lg font-black tracking-tighter ${isTodayDate && !isSelected ? 'text-[#8A9A8A]' : ''}`}>{day}</span>
                    {theme && <span className="text-lg">{theme.icon}</span>}
                  </div>
                  {day && hasTasksOnDate(day) && (
                    <div className="flex flex-wrap gap-1">
                      {tasks[dateStr].slice(0, 3).map(t => (
                        <div key={t.id} className={`w-full h-1 bg-black/10 group-hover:bg-white/20 ${isSelected ? 'bg-white/30' : ''}`}>
                          <div className={`h-full bg-black group-hover:bg-[#8A9A8A] ${isSelected ? 'bg-white' : ''} ${t.isCompleted ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Task Manager Section */}
          <div className="p-8 md:p-12 space-y-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <p className="mono font-bold">New Mission</p>
                <div className="flex border-2 border-black">
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="p-4 border-r-2 border-black font-black uppercase text-sm outline-none bg-white"
                  />
                  <input 
                    placeholder="ENTER NEW MISSION..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    className="flex-1 p-4 font-bold uppercase text-lg outline-none bg-white placeholder:opacity-20"
                  />
                  <button onClick={addTask} className="px-8 py-4 bg-black text-white font-black uppercase hover:bg-[#8A9A8A] transition-colors">Add</button>
                </div>
              </div>
            </div>

            <div className="divide-y-2 divide-black border-y-2 border-black">
              {(tasks[selectedDate] || []).length === 0 ? (
                <div className="py-20 text-center">
                  <p className="mono font-bold opacity-20 text-2xl">No Missions Planned.</p>
                </div>
              ) : (
                tasks[selectedDate]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((task) => (
                    <div 
                      key={task.id} 
                      className="group py-8 flex items-center justify-between hover:bg-black/5 transition-all"
                    >
                      <div className="flex items-center gap-8 flex-1">
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-all ${
                            task.isCompleted ? 'bg-black text-white' : 'bg-white hover:bg-[#8A9A8A]/20'
                          }`}
                        >
                          {task.isCompleted && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                        </button>
                        <span className="mono font-black text-xl opacity-20">{task.time}</span>
                        <span className={`text-lg font-black tracking-tighter uppercase ${task.isCompleted ? 'line-through opacity-30' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 px-6 py-2 border border-red-500 text-red-500 font-black uppercase text-xs hover:bg-red-500 hover:text-white transition-all">Delete</button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Setting Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowThemeModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">요일별 콘텐츠 주제 설정</h3>
              <button onClick={() => setShowThemeModal(false)} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              매주 정기적으로 올릴 콘텐츠 주제를 요일별로 설정하세요. 캘린더에 아이콘이 표시됩니다.
            </p>

            <div className="space-y-4">
              {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map((dayName, dayIndex) => {
                const existingTheme = weeklyThemes.find(t => t.day === dayIndex);
                return (
                  <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 font-semibold text-gray-700">{dayName}</div>
                      <input
                        type="text"
                        placeholder="예: 월요일 OOTD"
                        value={existingTheme?.theme || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            setWeeklyThemes(prev => {
                              const filtered = prev.filter(t => t.day !== dayIndex);
                              return [...filtered, { day: dayIndex, theme: value, icon: existingTheme?.icon || '📝' }];
                            });
                          } else {
                            setWeeklyThemes(prev => prev.filter(t => t.day !== dayIndex));
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
                      />
                      <select
                        value={existingTheme?.icon || '📝'}
                        onChange={(e) => {
                          const icon = e.target.value;
                          setWeeklyThemes(prev => {
                            const filtered = prev.filter(t => t.day !== dayIndex);
                            const theme = existingTheme?.theme || '';
                            if (theme) {
                              return [...filtered, { day: dayIndex, theme, icon }];
                            }
                            return prev;
                          });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#8A9A8A] text-2xl"
                      >
                        <option value="📝">📝</option>
                        <option value="👔">👔</option>
                        <option value="📸">📸</option>
                        <option value="🎬">🎬</option>
                        <option value="✨">✨</option>
                        <option value="💄">💄</option>
                        <option value="🍽️">🍽️</option>
                        <option value="☕">☕</option>
                        <option value="🏃">🏃</option>
                        <option value="📚">📚</option>
                        <option value="🎨">🎨</option>
                        <option value="🎵">🎵</option>
                      </select>
                      {existingTheme && (
                        <button
                          onClick={() => setWeeklyThemes(prev => prev.filter(t => t.day !== dayIndex))}
                          className="text-red-400 hover:text-red-600 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowThemeModal(false)}
                className="flex-1 bg-[#8A9A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#7a8a7a] transition-colors"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
