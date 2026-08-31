import { Star, Wallet, Recycle, FileText, Package, Clock, Gift, Lightbulb } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import dashboard from "../assets/dashboard.jpg";

const STATS = [
  { icon: Star, label: "Total Points", value: "1,250", sub: "+100 this week" },
  { icon: Wallet, label: "Rewards Balance", value: "800" },
  { icon: Recycle, label: "Total Recycled", value: "25.5 kg" },
];

const RECENT_ACTIVITY = [
  { icon: Recycle, name: "Plastic Bottles", meta: "Today, 10:42 AM • 2.5kg", points: "+50 pts", color: "3B82F6", bg: "#EFF6FF"},
  { icon: FileText, name: "Cardboard", meta: "Yesterday, 14:15 PM • 5.0kg", points: "+100 pts", color: "#F59E0B", bg: "#FEF3C7"},
  { icon: Package, name: "Aluminum Cans", meta: "Oct 12, 09:00 AM • 1.2kg", points: "+72 pts", color: "#6B7280", bg: "#F3F4F6" },
];

const FEATURED_REWARDS = [
  { badge: "M", color: "#F59E0B", name: "MTN N500 Airtime", points: "500 pts" },
  { badge: "S", color: "#EF4444", name: "Shoprite Voucher", points: "900 pts" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left / main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Greeting card */}
          <div className="bg-[#EAF6EC] rounded-xl p-6 flex items-center justify-between gap-6">
            <div>
              <h1 className="text-xl font-bold text-[#1A1A2E]">
                Good morning, Hameedat! 🌿
              </h1>
              <p className="mt-1 text-sm text-[#6B7280]">
                You have earned 1,250 points from 8 recycling visits. Keep it up!
              </p>
              <button className="mt-4 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors">
                Log New Visit
              </button>
            </div>
            
            <img 
              src={dashboard} 
              alt="Recycling" 
              className="hidden sm:block h-32 w-auto object-contain flex-shrink-0" 
            />

          </div>

          {/* Stats row */}
          <div className="grid sm:grid-cols-3 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Icon className="w-4 h-4 text-[#0D631B]" />
                    {stat.label}
                  </div>
                  <p className="mt-2 text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
                  {stat.sub && <p className="text-xs text-[#27AE60]">{stat.sub}</p>}
                </div>
              );
            })}
          </div>

          {/* Progress toward next reward */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-sm text-[#1A1A2E]">
              🎉 You are 200 points away from your next reward!
            </p>
            <div className="mt-2 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div className="h-full bg-[#0D631B]" style={{ width: "80%" }} />
            </div>
            <p className="mt-1 text-xs text-[#6B7280] text-right">800 / 1000 pts</p>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1A1A2E]">Recent Activity</p>
              <a href="/recycle-history" className="text-xs text-[#0D631B] hover:underline">
                View All
              </a>
            </div>
            <div className="mt-4 divide-y divide-[#E5E7EB]">
              {RECENT_ACTIVITY.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {/* Replace the icon span in the RECENT_ACTIVITY.map with this: */}
                      <span 
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.bg }}
                      >
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                      </span>
                      <div>
                        <p className="text-sm text-[#1A1A2E]">{item.name}</p>
                        <p className="text-xs text-[#6B7280]">{item.meta}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#0D631B]">{item.points}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Quick Actions</p>
            <div className="space-y-2">
              <a
                href="/reward-history"
                className="flex items-center gap-2 justify-center text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <Clock className="w-4 h-4" /> View Reward History
              </a>
              <a
                href="/reward"
                className="flex items-center gap-2 justify-center text-sm bg-[#0D631B] text-white px-4 py-2 rounded-lg hover:bg-[#0a4f15]"
              >
                <Gift className="w-4 h-4" /> Redeem Rewards
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Featured Rewards</p>
            <div className="space-y-3">
              {FEATURED_REWARDS.map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: r.color }}
                    >
                      {r.badge}
                    </span>
                    <div>
                      <p className="text-sm text-[#1A1A2E]">{r.name}</p>
                      <p className="text-xs text-[#6B7280]">{r.points}</p>
                    </div>
                  </div>
                  <span className="text-[#6B7280]">›</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#E0F2FE] rounded-xl p-4 text-sm text-[#0369A1]">
            <p className="font-semibold flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> Recycling Tip
            </p>
            <p className="mt-1 text-xs">
              Metal waste earns the most points at 60pts per kg. Try separating
              your cans!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}