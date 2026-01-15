"use client";

import { useState, useEffect } from "react";

const TIPS = [
  {
    icon: "💡",
    text: "첫 3초가 중요해요. Hook은 질문이나 반전으로 시작하면 시선을 사로잡을 수 있어요.",
    category: "콘텐츠 제작"
  },
  {
    icon: "📸",
    text: "자연광이 가장 예쁜 시간은 오전 10시와 오후 4시. 골든아워를 놓치지 마세요!",
    category: "촬영 팁"
  },
  {
    icon: "✍️",
    text: "캡션은 짧고 강렬하게. 첫 문장에 핵심 메시지를 담으면 더 많은 사람이 읽어요.",
    category: "캡션 작성"
  },
  {
    icon: "🎯",
    text: "해시태그는 10-15개가 적당해요. 너무 많으면 스팸으로 보일 수 있어요.",
    category: "해시태그"
  },
  {
    icon: "⏰",
    text: "당신의 팔로워가 가장 활발한 시간대를 찾아보세요. 보통 점심시간과 저녁 8-10시가 좋아요.",
    category: "업로드 타이밍"
  },
  {
    icon: "💬",
    text: "댓글에 바로 답장하세요. 첫 1시간 내 소통이 알고리즘에 긍정적 영향을 줍니다.",
    category: "소통"
  },
  {
    icon: "🎨",
    text: "피드 전체 색감을 생각하세요. 3x3 그리드로 봤을 때 조화로운지 확인해보세요.",
    category: "피드 관리"
  },
  {
    icon: "📊",
    text: "일주일에 최소 3-4회 게시하는 것이 알고리즘에 유리해요. 꾸준함이 핵심입니다.",
    category: "포스팅 빈도"
  },
  {
    icon: "🎬",
    text: "릴스는 15초 이내가 가장 완주율이 높아요. 핵심만 담아 짧고 굵게!",
    category: "릴스"
  },
  {
    icon: "✨",
    text: "진정성이 가장 중요해요. 완벽하지 않아도 괜찮아요. 당신만의 색깔을 보여주세요.",
    category: "마인드셋"
  }
];

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(TIPS[0]);

  useEffect(() => {
    // 하루에 한 번씩 팁이 바뀌도록 (날짜 기준)
    const today = new Date().toDateString();
    const tipIndex = Math.abs(today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % TIPS.length;
    setCurrentTip(TIPS[tipIndex]);
  }, []);

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex items-center gap-3 mb-6">
        <span className="mono font-bold px-2 py-1 bg-black text-white">Daily Tip</span>
        <span className="text-[10px] mono font-bold text-[#8A9A8A]">[{currentTip.category}]</span>
      </div>
      <p className="text-lg md:text-xl font-black leading-tight tracking-tighter italic">
        "{currentTip.text}"
      </p>
      <div className="mt-8 text-5xl opacity-20">{currentTip.icon}</div>
    </div>
  );
}
