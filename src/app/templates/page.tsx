"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState } from "react";
import { GoogleGenerativeAI } from '@google/generative-ai';

type Template = { id: string; title: string; body: string };

const RECOMMENDATIONS = [
  "이번 주 출근룩.zip - 무심한 세로 그리드용",
  "지각 위기 생존 코디 - 스토리 감성",
  "무채색 룩에 포인트 주는 법 - 정보성 릴스",
  "내 가방 속 '조용히 유명한' 아이템들"
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useSyncData<Template[]>("user_templates", []);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [showVariations, setShowVariations] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);

  const addTemplate = () => {
    if (!newTitle || !newBody) return;
    setTemplates(prev => [{ id: Math.random().toString(36).substring(7), title: newTitle, body: newBody }, ...prev]);
    setNewTitle("");
    setNewBody("");
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("복사되었습니다.");
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // AI 변형 생성 (클라이언트 사이드)
  const generateVariations = async (original: string) => {
    try {
      // Gemini API 키 (클라이언트에서 직접 사용)
      const API_KEY = 'AIzaSyA96BP2u3jPeOpTkY3_8v9c9Z8N2jBVa_o';
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `다음 인스타그램 캡션을 3가지 다른 스타일로 변형해주세요. 원본의 의미는 유지하되, 톤과 표현을 다르게 해주세요.

원본: "${original}"

조건:
1. 각 변형은 원본과 비슷한 길이
2. 인스타그램에 적합한 캐주얼한 톤
3. 이모지는 적절히 사용

변형 1, 변형 2, 변형 3을 각각 새 줄로 구분해서 제공해주세요.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // 응답을 라인별로 분리
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      // 상위 3개만 반환 (변형 1, 2, 3)
      return lines.slice(0, 3).map(line => 
        line.replace(/^변형\s*\d+[:：]\s*/i, '').trim()
      );
    } catch (error) {
      console.error('AI 생성 실패:', error);
      // 실패 시 간단한 패턴 기반 폴백
      return [
        `✨ ${original} ✨`,
        `${original}! 어때요? 💬`,
        `완전 ${original} 💪`
      ];
    }
  };

  const showTemplateVariations = async (template: Template) => {
    setShowVariations(template.id);
    setVariations(['생성 중...', '', '']);
    
    try {
      const newVariations = await generateVariations(template.body);
      setVariations(newVariations);
    } catch (error) {
      setVariations(['AI 생성 실패', '다시 시도해주세요', '']);
    }
  };

  return (
    <div className="flex flex-col h-full divide-y divide-black bg-white">
      {/* Header Info Section */}
      <section className="px-6 py-4 border-b border-black">
        <p className="text-xs opacity-40 mb-2">Cheat Key</p>
        <h2 className="text-xl font-normal mb-2">
          Content Templates
        </h2>
        <p className="text-xs leading-relaxed opacity-60">
          자주 쓰는 캡션이나 해시태그를 저장하고 AI로 변형해 빠르게 활용하세요.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-black">
        {/* Recommendation Section */}
        <div className="px-6 py-4 space-y-4 bg-[#F5F5F2]">
          <h3 className="text-sm font-medium">Ideas</h3>
          <div className="grid grid-cols-1 gap-2">
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="p-3 bg-white border border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  <span className="text-sm opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                  <p className="text-sm leading-tight">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Templates Section */}
        <div className="px-6 py-4 space-y-4 bg-white">
          <h3 className="text-sm font-medium">Create Template</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs opacity-40">Title</p>
              <input 
                placeholder="Enter title..." 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border border-black text-sm outline-none bg-white placeholder:opacity-20"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs opacity-40">Content</p>
              <textarea 
                placeholder="Enter caption or hashtags..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-black text-sm outline-none bg-white resize-none placeholder:opacity-20"
              />
            </div>
            <button 
              onClick={addTemplate} 
              className="w-full py-3 bg-black text-white text-sm hover:bg-opacity-80 transition-colors"
            >
              Save Template
            </button>
          </div>
        </div>
      </section>

      {/* Saved Templates Grid */}
      {templates.length > 0 && (
        <section className="px-6 py-6 bg-[#F5F5F2]">
          <h3 className="text-sm font-medium mb-4">Saved Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t => (
              <div key={t.id} className="border border-black bg-white overflow-hidden flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="p-4 border-b border-black flex-1">
                  <h4 className="text-sm font-medium mb-2 leading-tight">{t.title}</h4>
                  <p className="text-xs opacity-60 leading-relaxed line-clamp-4">{t.body}</p>
                </div>
                
                <div className="p-0 flex divide-x divide-black border-t border-black text-xs">
                  <button 
                    onClick={() => copy(t.body)} 
                    className="flex-1 py-2 bg-white hover:bg-black hover:text-white transition-colors"
                  >
                    Copy
                  </button>
                  <button 
                    onClick={() => showTemplateVariations(t)} 
                    className="flex-1 py-2 bg-white hover:bg-black hover:text-white transition-colors"
                  >
                    Variations
                  </button>
                  <button 
                    onClick={() => deleteTemplate(t.id)} 
                    className="px-3 py-2 bg-white hover:bg-black hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Template Variations */}
                {showVariations === t.id && (
                  <div className="bg-[#FFFFE0] border-t-2 border-black p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-black uppercase text-[10px] tracking-widest">Recommended Options</h5>
                      <button onClick={() => setShowVariations(null)} className="font-black text-lg">&times;</button>
                    </div>
                    <div className="space-y-3">
                      {variations.map((variation, index) => (
                        <div key={index} className="p-4 border-2 border-black bg-white flex items-start gap-3">
                          <p className="text-xs font-bold uppercase flex-1">{variation}</p>
                          <button
                            onClick={() => copy(variation)}
                            className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase hover:bg-[#8A9A8A] transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
