"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "오늘 출근룩을 아직 찍지 않았어. 거울을 닦고 촬영을 시작하자. 🤳",
  "지각하더라도 사진은 찍고 가야지? 현관 앞에 서봐! 🏃‍♀️",
  "점심 먹었어? 지금 눈앞에 보이는 예쁜 거 하나만 찍어놔. ☕️",
  "일요일까지 수고 많았어. 이번 주 5일 치 사진 묶어서 올리고 편하게 쉬자. 😴",
  "벌써 12일째 연속 업로드 중이야! 오늘만 더 힘내보자. 🔥"
];

export default function Secretary() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    // Randomly pick a message or based on time (simplified for now)
    setCurrentMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  }, [isOpen]);

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:bottom-10">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-white rounded-3xl shadow-2xl border-2 border-black p-5 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl shrink-0">
              👩‍💼
            </div>
            <div>
              <h4 className="font-bold text-sm">Secretary</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Now</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-800 leading-relaxed font-medium">
              "{currentMessage}"
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 py-2 bg-black text-white rounded-xl text-xs font-bold"
          >
            알겠어, 고마워!
          </button>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all hover:scale-110 active:scale-95 ${isOpen ? "bg-black text-white rotate-90" : "bg-white text-black border-2 border-black"}`}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
