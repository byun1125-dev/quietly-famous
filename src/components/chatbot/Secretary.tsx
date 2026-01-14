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
        <div className="absolute bottom-16 right-0 w-72 bg-white rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black p-5 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
            <span className="text-2xl">👩‍💼</span>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest">The Alarm</h4>
              <p className="text-[8px] font-bold text-[#FF5C00] uppercase tracking-[0.2em]">Live Secretary</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm font-black italic leading-tight uppercase tracking-tighter">
              "{message}"
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF5C00] transition-colors"
          >
            Confirmed.
          </button>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 flex items-center justify-center text-2xl transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${isOpen ? "bg-[#FF5C00] text-white" : "bg-white text-black"}`}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
