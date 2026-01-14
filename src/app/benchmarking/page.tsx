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
      <header className="border-b border-[var(--border)] pt-8 pb-12">
        <p className="mono mb-3 text-gray-500">Research</p>
        <h2 className="text-5xl font-bold mb-6">Content Deconstructor.</h2>
        <p className="mt-4 text-gray-600 max-w-lg text-base leading-relaxed">
          성공한 콘텐츠를 분석하고 구조를 학습하세요.
        </p>
      </header>

      <section className="bg-white border border-[var(--border)] p-8 rounded-lg shadow-sm space-y-10">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">타겟 링크</label>
          <input 
            placeholder="벤치마킹할 계정이나 영상 링크를 입력하세요..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#8A9A8A] transition-colors"
          />
        </div>

        <div className="grid gap-8">
          {FRAMEWORK.map((item, index) => (
            <div key={item.key} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8A9A8A] text-white flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-gray-800">{item.label}</h4>
              </div>
              <textarea 
                value={data[item.key] || ""}
                onChange={(e) => setData(prev => ({ ...prev, [item.key]: e.target.value }))}
                placeholder={item.placeholder}
                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg leading-relaxed outline-none focus:border-[#8A9A8A] transition-colors resize-none"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="p-8 bg-gradient-to-br from-[#8A9A8A]/10 to-transparent border border-[var(--border)] rounded-lg">
        <div className="flex gap-4">
          <div className="text-3xl">💡</div>
          <p className="text-sm leading-relaxed text-gray-700">
            <strong>Tip:</strong> 구조를 따라 하는 것은 카피가 아니라 학습입니다. 뼈대를 가져오고 살(내용)은 내 것으로 채우세요.
          </p>
        </div>
      </div>
    </div>
  );
}
