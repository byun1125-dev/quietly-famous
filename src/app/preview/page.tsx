"use client";

import { useState } from "react";

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState("grid");

  return (
    <div className="max-w-[400px] mx-auto bg-white min-h-screen shadow-2xl border-x border-gray-100">
      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h1 className="font-bold text-lg">quietly_famous_official</h1>
        <div className="flex gap-4">
          <span className="text-xl">➕</span>
          <span className="text-xl">☰</span>
        </div>
      </header>

      {/* Profile Info */}
      <section className="p-4 flex gap-8 items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl">👤</div>
          </div>
        </div>
        <div className="flex-1 flex justify-around text-center">
          <div><div className="font-bold">127</div><div className="text-xs text-gray-500">게시물</div></div>
          <div><div className="font-bold">1.2만</div><div className="text-xs text-gray-500">팔로워</div></div>
          <div><div className="font-bold">850</div><div className="text-xs text-gray-500">팔로잉</div></div>
        </div>
      </section>

      {/* Bio */}
      <section className="px-4 pb-4">
        <h2 className="font-bold text-sm">Quietly Famous</h2>
        <p className="text-sm text-gray-800">조용하지만 확실한 존재감 🌑</p>
        <p className="text-sm text-blue-900">linktr.ee/quietlyfamous</p>
      </section>

      {/* Action Buttons */}
      <section className="px-4 flex gap-2 mb-6">
        <button className="flex-1 bg-gray-100 py-2 rounded-lg text-sm font-bold">프로필 편집</button>
        <button className="flex-1 bg-gray-100 py-2 rounded-lg text-sm font-bold">프로필 공유</button>
      </section>

      {/* Tabs */}
      <div className="flex border-t border-gray-100">
        <button 
          onClick={() => setActiveTab("grid")}
          className={`flex-1 py-3 text-xl transition-colors ${activeTab === "grid" ? "border-t-2 border-black" : "opacity-30"}`}
        >
          ▦
        </button>
        <button 
          onClick={() => setActiveTab("reels")}
          className={`flex-1 py-3 text-xl transition-colors ${activeTab === "reels" ? "border-t-2 border-black" : "opacity-30"}`}
        >
          🎬
        </button>
        <button 
          onClick={() => setActiveTab("tagged")}
          className={`flex-1 py-3 text-xl transition-colors ${activeTab === "tagged" ? "border-t-2 border-black" : "opacity-30"}`}
        >
          👤
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-[1px]">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 flex items-center justify-center relative group cursor-pointer">
            <span className="text-gray-300">Image</span>
            {i === 0 && (
              <div className="absolute top-2 right-2 text-white drop-shadow-md">📁</div>
            )}
          </div>
        ))}
      </div>

      <div className="p-8 text-center bg-gray-50 mt-10 border-t border-dashed border-gray-200">
        <p className="text-xs text-gray-400 font-medium">
          사용자님이 제작하신 인스타 프리뷰 코드를<br />여기에 이식하여 완성하세요!
        </p>
      </div>
    </div>
  );
}
