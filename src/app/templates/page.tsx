"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState } from "react";

type Template = { id: string; title: string; body: string };

const EXAMPLE_TEMPLATES = [
  {
    title: "Hook-Body-CTA 구조",
    body: `[후킹 문구] 🔥

[본문 내용을 자세히 작성하세요]

[행동 유도 문구] 💬
#해시태그1 #해시태그2 #해시태그3`
  },
  {
    title: "Best 5 리스트",
    body: `[주제] Best 5 ✨

1. [항목1]
2. [항목2]
3. [항목3]
4. [항목4]
5. [항목5]

당신의 픽은? 👇`
  },
  {
    title: "비포/애프터 스토리",
    body: `전에는 [비포 상황]... 😢

지금은?
✅ [변화1]
✅ [변화2]
✅ [변화3]

[마무리 한마디] 💪`
  },
  {
    title: "꿀팁 공유",
    body: `[주제] 꿀팁 💡

Tip 1. [팁1]
Tip 2. [팁2]
Tip 3. [팁3]

저장해두고 써먹으세요 📌`
  },
  {
    title: "질문형 인게이지먼트",
    body: `솔직히... [질문]?

A. [선택지1]
B. [선택지2]

댓글로 알려주세요! 💬`
  },
  {
    title: "데일리 루틴",
    body: `나의 [시간대] 루틴 ☀️

[시간1] [활동1]
[시간2] [활동2]
[시간3] [활동3]

#루틴 #데일리`
  }
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useSyncData<Template[]>("user_templates", []);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

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

  const loadExample = (example: typeof EXAMPLE_TEMPLATES[0]) => {
    setNewTitle(example.title);
    setNewBody(example.body);
  };

  return (
    <div className="flex flex-col h-full divide-y divide-black bg-white">
      {/* Header Info Section */}
      <section className="px-6 py-4">
        <p className="text-xs opacity-40">Cheat Key</p>
        <h2 className="text-xl font-normal mt-2">
          Content Templates
        </h2>
        <p className="text-sm leading-relaxed opacity-60 mt-3">
          예시 템플릿을 불러와 수정하거나, 직접 작성해서 나만의 캡션 템플릿을 만드세요.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-black">
        {/* Templates Section */}
        <div className="px-6 py-4 space-y-4 bg-[#F5F5F2]">
          <h3 className="text-sm font-medium">Templates</h3>
          {templates.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-black bg-white">
              <p className="text-xs opacity-40">저장된 템플릿이 없습니다.</p>
              <p className="text-xs opacity-40 mt-1">오른쪽에서 새 템플릿을 만들어보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {templates.map((template, i) => (
                <div key={template.id} className="p-3 bg-white border border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group">
                  <div className="flex items-start gap-3">
                    <span className="text-sm opacity-20 group-hover:opacity-100 transition-opacity">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium leading-tight mb-1">{template.title}</h4>
                      <p className="text-xs opacity-60 leading-relaxed line-clamp-2">{template.body}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copy(template.body)}
                        className="px-2 py-1 bg-black text-white text-[10px] hover:bg-opacity-80 transition-colors"
                        title="복사"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="px-2 py-1 bg-white border border-black text-[10px] hover:bg-black hover:text-white transition-colors"
                        title="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Template Section */}
        <div className="px-6 py-4 space-y-4 bg-white">
          <h3 className="text-sm font-medium">Create Template</h3>
          
          {/* Example Templates */}
          <div className="space-y-2">
            <p className="text-xs opacity-40">예시 템플릿</p>
            <div className="grid grid-cols-2 gap-2">
              {EXAMPLE_TEMPLATES.map((example, i) => (
                <button
                  key={i}
                  onClick={() => loadExample(example)}
                  className="px-3 py-2 bg-white border border-black text-xs text-left hover:bg-black hover:text-white transition-colors"
                >
                  {example.title}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
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
                className="w-full h-40 px-3 py-2 border border-black text-sm outline-none bg-white resize-none placeholder:opacity-20"
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
    </div>
  );
}
