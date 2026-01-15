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
        <div className="p-6 space-y-3">
          <p className="text-xs opacity-40">The Desk</p>
          <h2 className="text-xl font-normal">
            Today's Workspace
          </h2>
          <div className="max-w-md pt-2">
            <p className="text-sm leading-relaxed opacity-60">
              조용하지만 확실하게.
            </p>
          </div>
        </div>
        <div className="divide-y divide-black flex flex-col">
          <div className="flex-1 p-6">
            <StreakTracker />
          </div>
          <div className="p-6 bg-[#F5F5F2]">
            <DailyTip />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="p-0 border-t border-black bg-white">
        <QuickStats />
      </section>

      {/* Main Working Section */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] divide-x divide-black bg-white">
        <div className="p-6">
          <DailyQuest />
        </div>
        <div className="bg-[#F5F5F2]">
          <RecentArchive />
        </div>
      </section>
    </div>
  );
}
