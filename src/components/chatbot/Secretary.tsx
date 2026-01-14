"use client";

import { useState, useEffect } from "react";
import { useSyncData } from "@/hooks/useSyncData";

export default function Secretary() {
  const [isOpen, setIsOpen] = useState(false);
  const [history] = useSyncData<Record<string, string[]>>("mission_history", {});
  const [message, setMessage] = useState("");
  
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayCompleted = history[todayStr] || [];

  useEffect(() => {
    const updateMessage = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      // 1. 미완료 미션 기반 잔소리 (기획안 현실 고증 멘트)
      if (hour < 10 && !todayCompleted.includes("daily-ootd") && day >= 1 && day <= 5) {
        setMessage("지각하더라도 사진은 찍고 가야지? 거울을 닦고 촬영을 시작하자. 🤳");
      } else if (hour >= 12 && hour < 15 && day === 3 && !todayCompleted.includes("wed-gallery")) {
        setMessage("점심 먹었어? 지금 눈앞에 보이는 예쁜 거 하나만 찍어놔. 갤러리 털 시간이야! ☕️");
      } else if (day === 0 && hour >= 19 && !todayCompleted.includes("sun-reels")) {
        setMessage("일요일 밤이야. 이번 주 5일 치 사진 묶어서 올리고 편하게 쉬자. 😴");
      } else {
        // 2. 기본 격려 멘트
        const defaultMessages = [
          "오늘도 조용히, 하지만 확실하게 유명해져 볼까? 🔥",
          "멘트 고민하지 마. 사실만 적는 게 가장 힙해. 🌑",
          "거울 셀카 각도, 무심한 듯 시크하게 알지? ✨",
          "지금 이 순간도 콘텐츠가 될 수 있어. 한 장만 찍어보자."
        ];
        setMessage(defaultMessages[now.getSeconds() % defaultMessages.length]);
      }
    };

    updateMessage();
    const interval = setInterval(updateMessage, 60000); // 1분마다 업데이트
    return () => clearInterval(interval);
  }, [todayCompleted]);

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:bottom-10">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-2xl border border-[var(--border)] p-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--border)]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8A9A8A] to-[#7a8a7a] flex items-center justify-center text-xl">
              👩‍💼
            </div>
            <div>
              <h4 className="font-semibold text-sm">The Alarm</h4>
              <p className="text-xs text-gray-500">Live Secretary</p>
            </div>
          </div>
          <div className="mb-5">
            <p className="text-sm leading-relaxed text-gray-700">
              {message}
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-[#8A9A8A] text-white text-sm font-semibold rounded-lg hover:bg-[#7a8a7a] transition-colors"
          >
            확인했습니다
          </button>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg hover:shadow-xl ${
          isOpen 
            ? "bg-[#8A9A8A] text-white scale-95" 
            : "bg-white text-gray-700 hover:scale-105"
        }`}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
