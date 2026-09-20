import { useState, useEffect } from "react";
import { Star, Wallet, Recycle, FileText, Package, Clock, Gift, Lightbulb, TreePine, Droplets, Wind, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import dashboardImg from "../assets/dashboard.jpg";
import { useAuth } from "../context/AuthContext";
import { dashboardService, rewardsService, calculateEnvironmentalImpact } from "../services";
import { toNumber } from "../utils/formatters";

const MATERIAL_ICONS = {
  PLASTIC: { icon: Recycle, color: "#3B82F6", bg: "#EFF6FF", label: "Plastic Bottles" },
  CANS_METAL: { icon: Package, color: "#6B7280", bg: "#F3F4F6", label: "Aluminum Cans" },
  PAPER_CARDBOARD: { icon: FileText, color: "#F59E0B", bg: "#FEF3C7", label: "Cardboard & Paper" },
  GLASS: { icon: Package, color: "#0D9488", bg: "#CCFBF1", label: "Glass Bottles" },
  E_WASTE: { icon: Package, color: "#7C3AED", bg: "#EFECFF", label: "Electronic Waste" },
  OTHER: { icon: Recycle, color: "#0D631B", bg: "#E7F7EC", label: "Other Recyclables" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [featuredRewards, setFeaturedRewards] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [dashRes, rewardsRes] = await Promise.allSettled([
          dashboardService.getUserDashboard(),
          rewardsService.getRewards({ limit: 3 }),
        ]);

        if (isMounted) {
          if (dashRes.status === 'fulfilled') {
            const response = dashRes.value;
            setDashboardData(response?.data || response);
          }
          if (rewardsRes.status === 'fulfilled') {
            const response = rewardsRes.value;
            const list = Array.isArray(response)
              ? response
              : response?.rewards || response?.data?.rewards || response?.data || [];
            setFeaturedRewards(list.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  // Backend returns: data.points.currentBalance, data.recyclingSummary.totalWeightKg, data.recentRecyclingHistory
  const pointsField = dashboardData?.points;
  const points = toNumber(
    typeof pointsField === 'object'
      ? (pointsField?.currentBalance ?? pointsField?.totalEarned)
      : pointsField ?? dashboardData?.pointsBalance ?? user?.points ?? 0
  );
  const recyclingSummary = dashboardData?.recyclingSummary;
  const totalKg = toNumber(
    recyclingSummary?.totalWeightKg ??
    dashboardData?.totalRecycledKg ??
    dashboardData?.totalWeightRecycledKg ??
    dashboardData?.kgRecycled ??
    user?.totalRecycled ??
    0
  );
  const visitCount =
    recyclingSummary?.totalSubmissions ??
    dashboardData?.centerVisits ??
    dashboardData?.visitsCount ??
    user?.centerVisits ??
    0;
  const recentActivity =
    dashboardData?.recentRecyclingHistory ||
    dashboardData?.recentHistory ||
    dashboardData?.recentActivity ||
    [];

  // Calculate environmental metrics
  const impact = dashboardData?.environmentalImpact || calculateEnvironmentalImpact(totalKg);
  const co2Saved = toNumber(
    impact?.co2Saved ?? impact?.co2SavedKg ?? impact?.co2Prevented,
    Number((totalKg * 1.85).toFixed(2))
  );

  // Next milestone calculation
  const nextMilestone = points < 500 ? 500 : points < 1000 ? 1000 : Math.ceil((points + 1) / 500) * 500;
  const ptsRemaining = Math.max(0, nextMilestone - points);
  const progressPct = Math.min(100, Math.round((points / nextMilestone) * 100));

  const activeVouchersCount =
    dashboardData?.activeVouchersCount ??
    dashboardData?.vouchersCount ??
    (Array.isArray(dashboardData?.activeVouchers) ? dashboardData.activeVouchers.length : 0);

  const stats = [
    { icon: Star, label: "Total Points", value: points.toLocaleString(), sub: `+${visitCount} visits recorded` },
    { icon: Wallet, label: "Vouchers & Rewards", value: activeVouchersCount },
    { icon: Recycle, label: "Total Recycled", value: `${totalKg} kg` },
  ];

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-3 gap-6 font-sans">
        {/* Left / main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Greeting card */}
          <div className="bg-[#EAF6EC] rounded-2xl p-6 flex items-center justify-between gap-6 border border-[#CDEED3]">
            <div>
              <h1 className="text-xl font-bold text-[#1A1A2E]">
                Good day, {user?.name?.split(" ")[0] || "Eco-Champion"}! 🌿
              </h1>
              <p className="mt-1 text-sm text-[#6B7280]">
                You have earned {points.toLocaleString()} points from {visitCount} recycling visits. Keep up the green impact!
              </p>
              <Link
                to="/reward"
                className="mt-4 inline-block bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors"
              >
                Redeem Points
              </Link>
            </div>
            
            <img 
              src={dashboardImg} 
              alt="Recycling" 
              className="hidden sm:block h-32 w-auto object-contain flex-shrink-0" 
            />
          </div>

          {/* Stats row */}
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <Icon className="w-4 h-4 text-[#0D631B]" />
                      {stat.label}
                    </div>
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />}
                  </div>
                  <p className="mt-2 text-xl font-bold text-[#1A1A2E]">{loading ? "–" : stat.value}</p>
                  {stat.sub && <p className="text-xs text-[#27AE60] mt-0.5">{stat.sub}</p>}
                </div>
              );
            })}
          </div>

          {/* Environmental Impact Card (from Backend Specs) */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Your Environmental Impact</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#E7F7EC] rounded-xl p-3.5 border border-[#C6ECCF]">
                <Wind className="w-5 h-5 text-[#0D631B] mx-auto mb-1" />
                <p className="text-lg font-bold text-[#0D631B]">{co2Saved.toFixed(2)} kg</p>
                <p className="text-[10px] text-[#0D631B] font-medium tracking-tight">CO₂ PREVENTED</p>
              </div>
              <div className="bg-[#EFF6FF] rounded-xl p-3.5 border border-[#D5E6FE]">
                <TreePine className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
                <p className="text-lg font-bold text-[#2563EB]">{impact.treesEquivalent ?? ((totalKg * 1.85) / 21.77).toFixed(1)}</p>
                <p className="text-[10px] text-[#2563EB] font-medium tracking-tight">TREES EQUIVALENT</p>
              </div>
              <div className="bg-[#ECFEFF] rounded-xl p-3.5 border border-[#CCFBF1]">
                <Droplets className="w-5 h-5 text-[#0D9488] mx-auto mb-1" />
                <p className="text-lg font-bold text-[#0D9488]">{impact.waterSavedLiters ?? (totalKg * 120).toLocaleString()} L</p>
                <p className="text-[10px] text-[#0D9488] font-medium tracking-tight">WATER SAVED</p>
              </div>
            </div>
          </div>

          {/* Progress toward next reward */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
            <p className="text-sm text-[#1A1A2E] font-medium">
              {ptsRemaining === 0
                ? "🎉 You have reached your current reward goal!"
                : `🎉 You are ${ptsRemaining} points away from your next milestone (${nextMilestone} pts)!`}
            </p>
            <div className="mt-2.5 h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div className="h-full bg-[#0D631B] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-[#6B7280] text-right">{points.toLocaleString()} / {nextMilestone} pts</p>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1A1A2E]">Recent Activity</p>
              <Link to="/recycle-history" className="text-xs text-[#0D631B] font-medium hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center items-center text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#0D631B]" />
                <span className="text-xs">Loading activity...</span>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-[#E5E7EB]">
                {recentActivity.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#6B7280]">No recycling activity yet.</p>
                ) : recentActivity.slice(0, 4).map((item, idx) => {
                  const typeKey = (item.wasteType || item.type || "OTHER").toUpperCase();
                  const style = MATERIAL_ICONS[typeKey] || MATERIAL_ICONS.OTHER;
                  const Icon = style.icon;
                  const itemTitle = item.name || style.label || item.wasteType;
                  const itemMeta = item.meta || `${item.weightKg || item.weight || ""} • ${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Drop-off recorded"}`;
                  const itemPoints = item.points ? (typeof item.points === 'number' ? `+${item.points} pts` : item.points) : `+${item.pointsAwarded || 50} pts`;

                  return (
                    <div key={idx} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: style.bg }}
                        >
                          <Icon className="w-4 h-4" style={{ color: style.color }} />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A2E]">{itemTitle}</p>
                          <p className="text-xs text-[#6B7280]">{itemMeta}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#0D631B]">{itemPoints}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Quick Actions</p>
            <div className="space-y-2">
              <Link
                to="/reward-history"
                className="flex items-center gap-2 justify-center text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Clock className="w-4 h-4" /> View Reward History
              </Link>
              <Link
                to="/reward"
                className="flex items-center gap-2 justify-center text-sm bg-[#0D631B] text-white px-4 py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
              >
                <Gift className="w-4 h-4" /> Redeem Rewards
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Featured Rewards</p>
            <div className="space-y-3">
              {loading ? (
                <div className="py-6 flex justify-center items-center text-slate-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0D631B]" />
                  <span className="text-xs">Loading featured rewards...</span>
                </div>
              ) : featuredRewards.length === 0 ? (
                <p className="py-3 text-xs text-[#6B7280] text-center">No rewards available right now.</p>
              ) : (
                featuredRewards.map((r) => (
                  <Link
                    key={r.id || r.title || r.name}
                    to="/reward"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: r.color || "#0D631B" }}
                      >
                        {r.badge || (r.title || r.name || "R")[0]}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A2E]">{r.title || r.name}</p>
                        <p className="text-xs text-[#6B7280]">{r.pointsRequired || r.points} pts</p>
                      </div>
                    </div>
                    <span className="text-[#6B7280] text-sm">›</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-4 text-sm text-[#0369A1]">
            <p className="font-semibold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> Eco-Tip of the Week
            </p>
            <p className="mt-1 text-xs text-[#075985] leading-relaxed">
              Electronics (25 pts/kg) and Metal Cans (15 pts/kg) earn the highest rates. Rinsing and sorting them increases your points credit!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}