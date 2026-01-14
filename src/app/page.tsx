import DailyQuest from "@/components/dashboard/DailyQuest";
import StreakTracker from "@/components/dashboard/StreakTracker";

export default function Home() {
  return (
    <div className="space-y-8">
      <header className="py-4">
        <h2 className="text-2xl font-bold text-gray-900">The Manager's Desk</h2>
        <p className="text-gray-500 text-sm">오늘도 조용히, 하지만 유명해질 준비 되셨나요?</p>
      </header>

      {/* A. 오늘의 미션 */}
      <section>
        <DailyQuest />
      </section>

      {/* B. 연속 달성 현황 */}
      <section>
        <StreakTracker />
      </section>

      {/* 비서 알림 (Chatbot Sneak Peek) */}
      <section className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex gap-3">
          <span className="text-2xl">👩‍💼</span>
          <div>
            <p className="text-indigo-900 font-semibold text-sm">Secretary's Message</p>
            <p className="text-indigo-700 text-sm mt-1">
              "지각하더라도 사진은 찍고 가야지? 현관 거울 앞에 서봐!"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
