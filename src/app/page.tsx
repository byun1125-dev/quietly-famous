import DailyQuest from "@/components/dashboard/DailyQuest";
import StreakTracker from "@/components/dashboard/StreakTracker";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentArchive from "@/components/dashboard/RecentArchive";
import DailyTip from "@/components/dashboard/DailyTip";

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      <header className="border-b border-[var(--border)] pt-8 pb-12">
        <p className="mono mb-3">The Manager's Desk</p>
        <h2 className="text-5xl font-bold mb-6">Welcome Back.</h2>
        <p className="mt-4 text-gray-600 max-w-lg text-base leading-relaxed">
          오늘도 당신의 고유한 색깔을 세상에 조용히 드러낼 준비가 되었나요?
        </p>
      </header>

      {/* Daily Tip */}
      <section>
        <DailyTip />
      </section>

      {/* Quick Stats */}
      <section>
        <QuickStats />
      </section>

      {/* Streak Tracker */}
      <section>
        <StreakTracker />
      </section>

      {/* Today's Quests */}
      <section>
        <DailyQuest />
      </section>

      {/* Recent Archive */}
      <section>
        <RecentArchive />
      </section>
    </div>
  );
}
