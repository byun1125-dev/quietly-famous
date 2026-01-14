"use client";

import { useSyncData } from "@/hooks/useSyncData";

export default function StreakTracker() {
  const [streak] = useSyncData<number>("user_streak", 12);

  return (
    <div className="card-minimal bg-[#FF5C00] text-white -mx-6 md:-mx-20 px-6 md:px-20 py-20 border-none">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Current Streak</h3>
        <div className="flex items-baseline gap-4">
          <span className="text-[12rem] md:text-[18rem] font-black leading-[0.8] tracking-tighter">
            {streak}
          </span>
          <span className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Days</span>
        </div>
        
        <div className="mt-20 border-t-4 border-white pt-8 flex flex-col md:flex-row justify-between items-start gap-8">
          <p className="max-w-xs text-xl font-bold leading-tight uppercase">
            Don't stop now. Your consistency is your power.
          </p>
          <div className="bg-white text-black p-6 font-black text-xs uppercase tracking-widest">
            Reset Warning: 0h 14m remaining
          </div>
        </div>
      </div>
    </div>
  );
}
