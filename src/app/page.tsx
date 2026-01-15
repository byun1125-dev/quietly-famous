import DailyQuest from "@/components/dashboard/DailyQuest";
import StreakTracker from "@/components/dashboard/StreakTracker";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentArchive from "@/components/dashboard/RecentArchive";
import DailyTip from "@/components/dashboard/DailyTip";

export default function Home() {
  return (
    <div className="flex flex-col h-full divide-y divide-black">
      {/* Header Info Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 divide-x divide-black">
        <div className="p-8 md:p-12 space-y-6">
          <p className="mono font-bold text-black opacity-100">Project: Quietly Famous</p>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            THE<br/>DESK
          </h2>
          <div className="max-w-md pt-8">
            <p className="text-lg leading-snug font-medium text-gray-600">
              오늘도 당신의 고유한 색깔을 세상에 조용히 드러낼 준비가 되었나요? 
              당신의 성장은 소리 없이 하지만 확실하게 일어납니다.
            </p>
          </div>
        </div>
        <div className="divide-y divide-black flex flex-col">
          <div className="flex-1 p-8 md:p-12">
            <StreakTracker />
          </div>
          <div className="p-8 md:p-12 bg-[#8A9A8A]/10">
            <DailyTip />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="p-0 border-t border-black bg-white">
        <QuickStats />
      </section>

      {/* Main Working Section */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] divide-x divide-black bg-white">
        <div className="p-8 md:p-12">
          <DailyQuest />
        </div>
        <div className="bg-[#F5F5F2]">
          <RecentArchive />
        </div>
      </section>
    </div>
  );
}
