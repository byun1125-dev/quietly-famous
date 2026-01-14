"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState } from "react";

const STEPS = [
  {
    title: "IDENTIFY",
    questions: ["Target Account ID", "Core Aesthetic Type", "Color Palette Mood"]
  },
  {
    title: "ANALYZE",
    questions: ["Pattern in High-Response Posts", "Hashtag Strategy", "Story Communication Style"]
  },
  {
    title: "APPLY",
    questions: ["Next Action Item: Angle", "Unique Value Point", "Draft: First Caption"]
  }
];

export default function BenchmarkingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useSyncData<Record<string, string>>("benchmarking_data", {});

  const handleInputChange = (q: string, val: string) => {
    setAnswers(prev => ({ ...prev, [q]: val }));
  };

  return (
    <div className="space-y-12">
      <header className="card-minimal">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Research</h3>
        <h2 className="text-6xl font-black italic tracking-tighter uppercase">Role Model.</h2>
      </header>

      <div className="flex gap-4 mb-20">
        {STEPS.map((step, idx) => (
          <div key={idx} className={`h-1 flex-1 transition-colors ${idx <= activeStep ? "bg-[#FF5C00]" : "bg-gray-100"}`} />
        ))}
      </div>

      <div className="space-y-16">
        <h4 className="text-[5rem] font-black tracking-tighter text-gray-100 leading-none">0{activeStep + 1}</h4>
        <div className="space-y-12">
          {STEPS[activeStep].questions.map((q, i) => (
            <div key={i} className="group border-b border-black pb-4">
              <p className="text-xs font-bold uppercase mb-4 text-[#FF5C00] tracking-widest">{q}</p>
              <input 
                value={answers[q] || ""}
                onChange={(e) => handleInputChange(q, e.target.value)}
                placeholder="TYPE YOUR OBSERVATION..."
                className="w-full bg-transparent text-2xl font-bold uppercase tracking-tighter outline-none placeholder:text-gray-200"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-10">
          <button 
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
            className={`text-xs font-black uppercase tracking-widest ${activeStep === 0 ? "opacity-0" : "hover:text-[#FF5C00]"}`}
          >
            Previous
          </button>
          <button 
            onClick={() => activeStep < STEPS.length - 1 ? setActiveStep(prev => prev + 1) : alert("Analysis Sync Complete.")}
            className="text-xs font-black uppercase tracking-widest bg-black text-white px-8 py-4 hover:bg-[#FF5C00] transition-colors"
          >
            {activeStep === STEPS.length - 1 ? "Finish Sync" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
