"use client";

import { useSyncData } from "@/hooks/useSyncData";

const FRAMEWORK = [
  { key: "hook", label: "Hook (도입부)", placeholder: "시청자를 1초 만에 멈추게 한 포인트는?" },
  { key: "body", label: "Body (본문)", placeholder: "정보나 재미를 전달하는 방식은? (자막, 리듬 등)" },
  { key: "cta", label: "CTA (마무리)", placeholder: "팔로우나 저장을 어떻게 유도했나요?" },
  { key: "apply", label: "Apply (적용)", placeholder: "이 구조를 내 콘텐츠에 어떻게 적용할까요?" },
];

export default function BenchmarkingPage() {
  const [data, setData] = useSyncData<Record<string, string>>("model_analysis", {});

  return (
    <div className="space-y-12 pb-20">
      <header className="card-minimal">
        <p className="mono mb-2">Research</p>
        <h2 className="text-4xl font-serif italic">Content Deconstructor.</h2>
      </header>

      <section className="bg-white border border-[var(--border)] p-8 space-y-12">
        <div className="space-y-2 border-b border-[var(--border)] pb-4">
          <p className="mono">Target Link</p>
          <input 
            placeholder="벤치마킹할 계정이나 영상 링크를 입력하세요..."
            className="w-full bg-transparent font-serif italic text-xl outline-none"
          />
        </div>

        <div className="grid gap-12">
          {FRAMEWORK.map((item) => (
            <div key={item.key} className="space-y-4">
              <h4 className="mono text-[#8A9A8A]">{item.label}</h4>
              <textarea 
                value={data[item.key] || ""}
                onChange={(e) => setData(prev => ({ ...prev, [item.key]: e.target.value }))}
                placeholder={item.placeholder}
                className="w-full h-24 bg-transparent font-serif italic leading-relaxed border-none outline-none resize-none"
              />
              <div className="h-[1px] bg-gray-100"></div>
            </div>
          ))}
        </div>
      </section>

      <div className="p-8 bg-[#EBEBE6] border border-[var(--border)] italic font-serif text-sm leading-relaxed text-gray-600">
        "구조를 따라 하는 것은 카피가 아니라 학습입니다. 뼈대를 가져오고 살(내용)은 내 것으로 채우세요."
      </div>
    </div>
  );
}
