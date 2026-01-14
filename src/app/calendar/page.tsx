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
    <div className="space-y-8 pb-20">
      <header className="border-b border-[var(--border)] pt-8 pb-12">
        <p className="mono mb-3 text-gray-500">Scheduling</p>
        <h2 className="text-5xl font-bold mb-6">Mission Calendar.</h2>
        <p className="mt-4 text-gray-600 max-w-lg text-base leading-relaxed">
          요일별 콘텐츠 주제를 설정하고, 매일의 미션을 관리하세요.
        </p>
      </header>

      {/* Weekly Themes */}
      <section className="bg-white border border-[var(--border)] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">요일별 콘텐츠 주제</h3>
          <button
            onClick={() => setShowThemeModal(true)}
            className="text-sm text-[#8A9A8A] hover:underline font-medium"
          >
            설정하기
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((dayName, dayIndex) => {
            const theme = weeklyThemes.find(t => t.day === dayIndex);
            return (
              <div
                key={dayIndex}
                className={`p-3 rounded-lg text-center ${
                  theme
                    ? 'bg-gradient-to-br from-[#8A9A8A]/10 to-[#8A9A8A]/5 border-2 border-[#8A9A8A]/20'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">{dayName}</div>
                {theme ? (
                  <>
                    <div className="text-2xl mb-1">{theme.icon}</div>
                    <div className="text-xs font-medium text-gray-700 line-clamp-2">
                      {theme.theme}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 py-3">-</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

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
              {calendarDays.map((day, index) => {
                const theme = getThemeForDay(day);
                return (
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
                    {theme && (
                      <div className="absolute top-0.5 right-0.5 text-[10px]">
                        {theme.icon}
                      </div>
                    )}
                    {hasTasksOnDate(day) && (
                      <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelectedDay(day) ? 'bg-white' : 'bg-[#8A9A8A]'}`}></div>
                    )}
                  </button>
                );
              })}
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
