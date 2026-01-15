"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState, useMemo } from "react";

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
  const [contentPlans, setContentPlans] = useSyncData<Record<string, ContentPlan>>("content_plans_v2", {});
  const [weeklyThemes, setWeeklyThemes] = useSyncData<WeeklyTheme[]>("weekly_themes", DEFAULT_THEMES);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  
  // 모달 폼 상태
  const [contentType, setContentType] = useState<'reels' | 'feed' | 'story'>('reels');
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [status, setStatus] = useState<'planning' | 'creating' | 'completed'>('planning');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

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

  const saveContentPlan = () => {
    if (!topic.trim()) {
      alert("주제를 입력해주세요.");
      return;
    }

    const plan: ContentPlan = {
      id: contentPlans[selectedDate]?.id || Math.random().toString(36).substring(7),
      type: contentType,
      topic: topic.trim(),
      details: details.trim(),
      hashtags: hashtags.trim(),
      status,
      checklist,
      createdAt: contentPlans[selectedDate]?.createdAt || Date.now()
    };

    setContentPlans(prev => ({
      ...prev,
      [selectedDate]: plan
    }));

    closeContentModal();
  };

  const closeContentModal = () => {
    setShowContentModal(false);
    // 폼 초기화는 하지 않음 (수정 후 다시 열 수 있으므로)
  };

  const loadContentPlan = (date: string) => {
    const plan = contentPlans[date];
    if (plan) {
      setContentType(plan.type);
      setTopic(plan.topic);
      setDetails(plan.details);
      setHashtags(plan.hashtags);
      setStatus(plan.status);
      setChecklist(plan.checklist);
    } else {
      // 새로운 계획 - 기본값 설정
      setContentType('reels');
      setTopic("");
      setDetails("");
      setHashtags("");
      setStatus('planning');
      setChecklist([
        { id: '1', text: '편집 완료', isCompleted: false },
        { id: '2', text: '캡션 작성', isCompleted: false },
        { id: '3', text: '업로드 완료', isCompleted: false }
      ]);
    }
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setChecklist(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      text: newChecklistItem.trim(),
      isCompleted: false
    }]);
    setNewChecklistItem("");
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const deleteChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const deleteContentPlan = (date: string) => {
    if (confirm("이 날짜의 콘텐츠 계획을 삭제하시겠습니까?")) {
      setContentPlans(prev => {
        const newPlans = { ...prev };
        delete newPlans[date];
        return newPlans;
      });
    }
  };

  const hasContentOnDate = (day: number | null) => {
    if (!day) return false;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString('en-CA');
    return !!contentPlans[dateStr];
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
    loadContentPlan(dateStr);
    setShowContentModal(true);
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
      <section className="p-6 border-b border-black">
        <p className="text-xs mb-2 opacity-40">Calendar</p>
        <h2 className="text-xl font-normal mb-2">
          Mission Tracker
        </h2>
        <p className="text-xs leading-relaxed opacity-60">
          날짜를 클릭해서 콘텐츠를 계획하고, 요일별 주제를 관리하세요.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] divide-x divide-black">
        {/* Left: Weekly Themes & Date Info */}
        <aside className="divide-y divide-black flex flex-col bg-[#F5F5F2]">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-normal">Weekly Themes</h3>
              <button onClick={() => setShowThemeModal(true)} className="text-xs hover:underline">Edit</button>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {['일', '월', '화', '수', '목', '금', '토'].map((dayName, dayIndex) => {
                const theme = weeklyThemes.find(t => t.day === dayIndex);
                return (
                  <div key={dayIndex} className="flex items-center gap-3 p-2 border border-black/5 bg-white">
                    <span className="text-xs w-4 opacity-30">{dayName}</span>
                    {theme ? (
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm">{theme.icon}</span>
                        <span className="text-xs truncate">{theme.theme}</span>
                      </div>
                    ) : <span className="text-xs opacity-20">-</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-black text-white">
            <p className="text-xs mb-1 opacity-50">Selected</p>
            <h3 className="text-sm">
              {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h3>
          </div>

          <div className="flex-1 p-6">
            <div className="p-4 border border-black bg-white">
              <p className="text-xs mb-2 opacity-40">Tip</p>
              <p className="text-xs leading-relaxed">
                하루 3가지만 집중하세요.
              </p>
            </div>
          </div>
        </aside>

        {/* Right: Calendar Grid & Task Manager */}
        <div className="divide-y divide-black">
          {/* Month Navigation */}
          <div className="px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-normal">
              {currentMonth.getFullYear()}.{String(currentMonth.getMonth() + 1).padStart(2, '0')}
            </h3>
            <div className="flex border border-black text-xs">
              <button onClick={goToPrevMonth} className="px-4 py-2 hover:bg-black hover:text-white transition-colors border-r border-black">Prev</button>
              <button onClick={goToNextMonth} className="px-4 py-2 hover:bg-black hover:text-white transition-colors">Next</button>
            </div>
          </div>

          {/* Main Calendar Grid */}
          <div className="grid grid-cols-7 border-t border-black bg-black gap-[1px]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={day} className={`bg-[#F5F5F2] p-2 text-center text-xs ${i === 0 ? 'opacity-40' : i === 6 ? 'opacity-40' : ''}`}>
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const theme = getThemeForDay(day);
              const dateStr = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString('en-CA') : '';
              const isSelected = dateStr === selectedDate;
              const isTodayDate = dateStr === new Date().toLocaleDateString('en-CA');
              const content = day ? contentPlans[dateStr] : null;
              
              return (
                <div 
                  key={index}
                  onClick={() => selectDay(day)}
                  className={`bg-white aspect-square p-2 border-black group cursor-pointer transition-all hover:bg-black hover:text-white flex flex-col justify-between ${!day ? 'bg-[#EBEBE6] pointer-events-none' : ''} ${isSelected ? 'bg-black text-white' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm ${isTodayDate && !isSelected ? 'font-bold' : ''}`}>{day}</span>
                    {theme && <span className="text-xs">{theme.icon}</span>}
                  </div>
                  {content && (
                    <div className="flex items-center gap-1">
                      <div className={`text-[10px] px-1 ${isSelected ? 'bg-white text-black' : 'bg-black text-white group-hover:bg-white group-hover:text-black'}`}>
                        {content.type === 'reels' ? 'R' : content.type === 'feed' ? 'F' : 'S'}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        content.status === 'completed' ? 'bg-green-500' : 
                        content.status === 'creating' ? 'bg-yellow-500' : 
                        'bg-gray-300'
                      }`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Content Summary Section */}
          <div className="px-6 py-4">
            {contentPlans[selectedDate] ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs ${
                        contentPlans[selectedDate].type === 'reels' ? 'bg-purple-100' :
                        contentPlans[selectedDate].type === 'feed' ? 'bg-blue-100' :
                        'bg-pink-100'
                      }`}>
                        {contentPlans[selectedDate].type === 'reels' ? '릴스' :
                         contentPlans[selectedDate].type === 'feed' ? '피드' : '스토리'}
                      </span>
                      <span className={`px-2 py-1 text-xs ${
                        contentPlans[selectedDate].status === 'completed' ? 'bg-green-100' :
                        contentPlans[selectedDate].status === 'creating' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        {contentPlans[selectedDate].status === 'completed' ? '완료' :
                         contentPlans[selectedDate].status === 'creating' ? '제작중' : '계획중'}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">{contentPlans[selectedDate].topic}</h3>
                    {contentPlans[selectedDate].details && (
                      <p className="text-sm opacity-60 mb-2 line-clamp-2">{contentPlans[selectedDate].details}</p>
                    )}
                    {contentPlans[selectedDate].hashtags && (
                      <p className="text-xs opacity-40">{contentPlans[selectedDate].hashtags}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteContentPlan(selectedDate)}
                    className="text-xs opacity-40 hover:opacity-100 ml-4"
                  >
                    ✕
                  </button>
                </div>

                {contentPlans[selectedDate].checklist.length > 0 && (
                  <div className="pt-4 border-t border-black/10">
                    <p className="text-xs opacity-40 mb-2">체크리스트</p>
                    <div className="space-y-2">
                      {contentPlans[selectedDate].checklist.map(item => (
                        <div key={item.id} className="flex items-center gap-2 text-sm">
                          <span className={item.isCompleted ? 'line-through opacity-30' : ''}>
                            {item.isCompleted ? '✓' : '○'} {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    loadContentPlan(selectedDate);
                    setShowContentModal(true);
                  }}
                  className="w-full py-2 border border-black text-sm hover:bg-black hover:text-white transition-colors"
                >
                  수정하기
                </button>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs opacity-20 mb-3">날짜를 클릭해서 콘텐츠를 계획하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Planning Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeContentModal}>
          <div className="bg-white border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-black px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-1">콘텐츠 계획</h3>
                <p className="text-xs opacity-40">{new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</p>
              </div>
              <button onClick={closeContentModal} className="text-2xl hover:opacity-60">&times;</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 메인 콘텐츠 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-black"></div>
                  <h4 className="text-sm font-medium">메인 콘텐츠</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs opacity-40">콘텐츠 타입</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-black text-sm outline-none bg-white cursor-pointer"
                    >
                      <option value="reels">릴스</option>
                      <option value="feed">피드</option>
                      <option value="story">스토리</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs opacity-40">진행 상태</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-black text-sm outline-none bg-white cursor-pointer"
                    >
                      <option value="planning">계획중</option>
                      <option value="creating">제작중</option>
                      <option value="completed">완료</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs opacity-40">주제</label>
                  <input
                    type="text"
                    placeholder="예: 겨울 OOTD 룩북"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-black text-sm outline-none bg-white placeholder:opacity-20"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs opacity-40">상세 계획</label>
                  <textarea
                    placeholder="Hook: 요즘 이 코디로만 입어요&#10;Body: 3가지 스타일링 소개&#10;CTA: 저장하고 따라해보세요"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full px-3 py-2 border border-black text-sm outline-none bg-white placeholder:opacity-20 resize-none h-32"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs opacity-40">해시태그</label>
                  <input
                    type="text"
                    placeholder="#OOTD #겨울코디 #데일리룩"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="w-full px-3 py-2 border border-black text-sm outline-none bg-white placeholder:opacity-20"
                  />
                </div>
              </div>

              {/* 체크리스트 */}
              <div className="space-y-4 pt-4 border-t border-black/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-black"></div>
                  <h4 className="text-sm font-medium">체크리스트</h4>
                </div>

                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 group">
                      <button
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`w-5 h-5 border border-black flex items-center justify-center transition-all ${
                          item.isCompleted ? 'bg-black text-white' : 'bg-white'
                        }`}
                      >
                        {item.isCompleted && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </button>
                      <span className={`text-sm flex-1 ${item.isCompleted ? 'line-through opacity-30' : ''}`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => deleteChecklistItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-xs hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="새 체크리스트 항목"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addChecklistItem();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-black text-sm outline-none bg-white placeholder:opacity-20"
                  />
                  <button
                    onClick={addChecklistItem}
                    className="px-4 py-2 border border-black text-sm hover:bg-black hover:text-white transition-colors"
                  >
                    추가
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveContentPlan}
                  className="flex-1 bg-black text-white py-3 text-sm hover:bg-opacity-80 transition-colors"
                  disabled={!topic.trim()}
                >
                  저장
                </button>
                <button
                  onClick={closeContentModal}
                  className="flex-1 bg-white border border-black text-black py-3 text-sm hover:bg-black hover:text-white transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Setting Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowThemeModal(false)}>
          <div className="bg-white border-2 border-black max-w-lg w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-black flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">요일별 주제 설정</h3>
                <p className="text-xs opacity-40 mt-1">매주 올릴 콘텐츠 주제를 설정하세요</p>
              </div>
              <button onClick={() => setShowThemeModal(false)} className="text-2xl hover:opacity-60">&times;</button>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map((dayName, dayIndex) => {
                const existingTheme = weeklyThemes.find(t => t.day === dayIndex);
                return (
                  <div key={dayIndex} className="flex items-center gap-3 pb-3 border-b border-black/10 last:border-0">
                    <div className="w-12 text-xs opacity-40">{dayName}</div>
                    <input
                      type="text"
                      placeholder="예: OOTD"
                      value={existingTheme?.theme || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          setWeeklyThemes(prev => {
                            const filtered = prev.filter(t => t.day !== dayIndex);
                            return [...filtered, { day: dayIndex, theme: value, icon: '📝' }];
                          });
                        } else {
                          setWeeklyThemes(prev => prev.filter(t => t.day !== dayIndex));
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-black text-sm outline-none bg-white placeholder:opacity-20"
                    />
                    {existingTheme && (
                      <button
                        onClick={() => setWeeklyThemes(prev => prev.filter(t => t.day !== dayIndex))}
                        className="text-xs opacity-40 hover:opacity-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-black">
              <button
                onClick={() => setShowThemeModal(false)}
                className="w-full bg-black text-white py-3 text-sm hover:bg-opacity-80 transition-colors"
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
