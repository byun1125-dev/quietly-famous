"use client";

import { useState } from "react";

const TEMPLATES = {
  story: [
    { title: "월요일", content: "주말 순삭... 다시 출근(등교). #월요병 #OOTD" },
    { title: "날씨 (춥다)", content: "오늘 진짜 춥네요. 다들 패딩 챙기세요. 🥶" },
    { title: "날씨 (덥다)", content: "벌써 여름인가요? 오늘 너무 덥다.. ☀️" },
    { title: "지각/바쁨", content: "뛰어야 해서 운동화 신음. 오늘 룩은 생존룩." },
  ],
  reels: [
    { 
      title: "출근룩.zip", 
      content: `[이번 주 출근룩.zip]\n\n10월 2주차 출근 기록 📂\n날씨가 갑자기 쌀쌀해져서 옷 입기 애매했던 한 주.\n다들 감기 조심하세요 🤧\n\n#직장인코디 #출근룩 #데일리룩 #가을코디` 
    },
    { 
      title: "주말 일상", 
      content: `주말 기록 ☕️\n특별할 건 없지만 소중한 시간들.\n충전 완료! 다시 달려보자 ⚡️\n\n#카페투어 #주말일상 #데일리기록` 
    }
  ]
};

export default function TemplatesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="py-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center uppercase tracking-tighter">The Templates 📝</h2>
        <p className="text-gray-500 text-sm text-center">"아, 뭐라고 쓰지?" 고민하는 시간을 제로로 만듭니다.</p>
      </header>

      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📸</span> 스토리 캡션 (현실 고증 ver)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.story.map((t, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border-2 border-gray-100 hover:border-black transition-all group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">{t.title}</span>
                <button 
                  onClick={() => copyToClipboard(t.content, `story-${idx}`)}
                  className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all ${copiedId === `story-${idx}` ? "bg-green-500 text-white" : "bg-gray-100 group-hover:bg-black group-hover:text-white"}`}
                >
                  {copiedId === `story-${idx}` ? "COPIED!" : "COPY"}
                </button>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">
                {t.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>🎬</span> 릴스 업로드 포맷
        </h3>
        <div className="space-y-4">
          {TEMPLATES.reels.map((t, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border-2 border-gray-100 hover:border-black transition-all group">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-black">{t.title}</span>
                <button 
                  onClick={() => copyToClipboard(t.content, `reels-${idx}`)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${copiedId === `reels-${idx}` ? "bg-green-500 text-white" : "bg-gray-100 group-hover:bg-black group-hover:text-white"}`}
                >
                  {copiedId === `reels-${idx}` ? "본문 복사 완료" : "본문 복사하기"}
                </button>
              </div>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded-xl border border-gray-100">
                {t.content}
              </pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
