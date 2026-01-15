import DailyQuest from "@/components/dashboard/DailyQuest";
import StreakTracker from "@/components/dashboard/StreakTracker";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentArchive from "@/components/dashboard/RecentArchive";

export default function Home() {
  return (
    <div className="flex flex-col h-full divide-y divide-black">
      {/* Header Info Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 divide-x divide-black">
        <div className="p-6">
          <StreakTracker />
        </div>
        <div className="p-6 bg-white">
          <DailyQuest />
        </div>
      </section>

      {/* Stats Section */}
      <section className="p-0 bg-white">
        <QuickStats />
      </section>

      {/* Archive Section */}
      <section className="bg-white">
        <RecentArchive />
      </section>
    </div>
  );
}
