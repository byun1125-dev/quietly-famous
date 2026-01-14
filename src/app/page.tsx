import DailyQuest from "@/components/dashboard/DailyQuest";
import StreakTracker from "@/components/dashboard/StreakTracker";

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      <header className="card-minimal">
        <p className="mono mb-2">The Manager's Desk</p>
        <h2 className="text-4xl font-serif italic">Welcome Back.</h2>
        <p className="mt-6 text-gray-500 max-w-sm text-sm font-medium leading-relaxed italic">
          "오늘도 당신의 고유한 색깔을 세상에 조용히 드러낼 준비가 되었나요?"
        </p>
      </header>

      <section>
        <StreakTracker />
      </section>

      <section>
        <DailyQuest />
      </section>
    </div>
  );
}
