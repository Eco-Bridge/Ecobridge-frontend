import { useState, useEffect } from "react";
import {
  UserPlus,
  Recycle,
  Coins,
  Wallet,
  Download,
  Trophy,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import AdminLayout from "../../layouts/AdminLayout";
import { dashboardService, rewardsService, userService } from "../../services";

const WASTE_COLORS = {
  PLASTIC: "#3B82F6",
  PAPER_CARDBOARD: "#F59E0B",
  CANS_METAL: "#9CA3AF",
  GLASS: "#06B6D4",
  E_WASTE: "#7C3AED",
  OTHER: "#0D631B",
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWasteKg: 0,
    totalPoints: 0,
    totalRedemptions: 0,
  });
  const [monthlyWaste, setMonthlyWaste] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [wasteByType, setWasteByType] = useState([]);
  const [mostRedeemed, setMostRedeemed] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      try {
        const [dashRes, redemptionsRes] = await Promise.allSettled([
          dashboardService.getAdminDashboard(),
          rewardsService.getAllRedemptions({ limit: 100 }),
        ]);

        if (!isMounted) return;

        if (dashRes.status === "fulfilled") {
          const data = dashRes.value || {};
          const overview = data.overview && typeof data.overview === "object" ? data.overview : data;
          const usersByRole = Array.isArray(data.usersByRole) ? data.usersByRole : [];

          const citizenCount = usersByRole.reduce((sum, item) => {
            const role = String(item?.role || "").toUpperCase();
            if (role === "CITIZEN") {
              return sum + Number(item?.count ?? item?.total ?? item?.value ?? 0);
            }
            return sum;
          }, 0);

          const totalUsers = Number(
            citizenCount > 0
              ? citizenCount
              : overview.totalCitizens ?? data.totalCitizens ?? overview.totalUsers ?? data.totalUsers ?? 0
          );

          const totalWasteKg = Number(
            overview.totalWeightRecycledKg ??
            overview.totalWasteKg ??
            overview.totalWeightKg ??
            data.totalWasteKg ??
            data.totalWeightKg ??
            data.allTimeWeightKg ??
            0
          );

          const totalPoints = Number(
            overview.totalPointsDistributed ??
            overview.totalPoints ??
            data.totalPoints ??
            data.allTimePoints ??
            0
          );

          const totalRedemptions = Number(
            overview.totalRewardsRedeemed ??
            overview.totalRedemptions ??
            data.totalRedemptions ??
            data.redemptionsCount ??
            0
          );

          setStats({
            totalUsers,
            totalWasteKg,
            totalPoints,
            totalRedemptions,
          });

          const breakdown =
            data.wasteCategoryBreakdown ??
            data.categoryBreakdown ??
            data.wasteBreakdown ??
            overview.wasteCategoryBreakdown ??
            overview.wasteBreakdown ??
            overview.categoryBreakdown ??
            [];

          if (Array.isArray(breakdown) && breakdown.length > 0) {
            const pieData = breakdown.map((item, index) => ({
              name:
                item.name ||
                item.category ||
                item.label ||
                item.wasteType ||
                `Category ${index + 1}`,
              value: Number(
                item.value ?? item.percent ?? item.share ?? item.count ?? item.totalWeightKg ?? item.weightKg ?? 0
              ),
              color:
                item.color ||
                WASTE_COLORS[String(item.key || item.name || item.category || item.wasteType || "OTHER").toUpperCase()] ||
                WASTE_COLORS.OTHER ||
                "#6B7280",
            }));
            setWasteByType(pieData);
          } else if (breakdown && typeof breakdown === "object") {
            const entries = Object.entries(breakdown);
            if (entries.length > 0) {
              const pieData = entries.map(([key, value], index) => ({
                name: key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase()),
                value: Number(value) || 0,
                color:
                  WASTE_COLORS[String(key).toUpperCase()] ||
                  ["#0D631B", "#3B82F6", "#F59E0B", "#7C3AED", "#9CA3AF"][index % 5],
              }));
              setWasteByType(pieData);
            } else {
              setWasteByType([]);
            }
          } else {
            setWasteByType([]);
          }

          const monthly =
            data.monthlyWaste ??
            data.wasteCollectedMonthly ??
            data.monthlyCollections ??
            overview.monthlyWaste ??
            overview.wasteCollectedMonthly ??
            overview.monthlyCollections ??
            [];

          if (Array.isArray(monthly) && monthly.length > 0) {
            const formatted = monthly.map((item, index) => ({
              month: item.month || item.label || item.name || MONTH_NAMES[index] || `M${index + 1}`,
              kg: Number(item.kg ?? item.weightKg ?? item.totalWeightKg ?? item.value ?? item.amount ?? 0),
            }));
            setMonthlyWaste(formatted);
          } else {
            setMonthlyWaste([]);
          }

        let growth =
          data.userGrowth ??
          data.monthlyUsers ??
          overview.userGrowth ??
          overview.monthlyUsers ??
          [];

        if (!Array.isArray(growth) || growth.length === 0) {
          try {
            const usersMeta = await userService.getUsersWithMeta();
            if (Array.isArray(usersMeta?.userGrowth) && usersMeta.userGrowth.length > 0) {
              growth = usersMeta.userGrowth;
            }
          } catch {
            // Ignore fallback fetch error
          }
        }

        if (Array.isArray(growth) && growth.length > 0) {
          const formatted = growth.map((item, index) => ({
            month:
              item.month ||
              item.label ||
              item.name ||
              item.monthKey ||
              MONTH_NAMES[index] ||
              `M${index + 1}`,
            users: Number(item.count ?? item.users ?? item.total ?? item.value ?? 0),
          }));

          setUserGrowth(formatted);
        } else {
          setUserGrowth([]);
        }
      }

        if (redemptionsRes.status === "fulfilled") {
          const redemptions = redemptionsRes.value?.redemptions ?? redemptionsRes.value?.data ?? redemptionsRes.value ?? [];
          if (Array.isArray(redemptions) && redemptions.length > 0) {
            const countMap = {};
            redemptions.forEach((r) => {
              const name = r.reward?.title ?? r.rewardName ?? r.name ?? r.reward?.name ?? "Unknown";
              countMap[name] = (countMap[name] || 0) + 1;
            });
            const sorted = Object.entries(countMap)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);
            setMostRedeemed(sorted.length > 0 ? sorted : []);
          } else {
            setMostRedeemed([]);
          }
        }
      } catch (err) {
        console.error("Analytics load error:", err);
        setMonthlyWaste([]);
        setUserGrowth([]);
        setWasteByType([]);
        setMostRedeemed([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  const hasMonthlyWaste = monthlyWaste.length > 0;
  const hasUserGrowth = userGrowth.length > 0;
  const hasWasteBreakdown = wasteByType.length > 0;
  const hasMostRedeemed = mostRedeemed.length > 0;
  const hasPlatformSummary = Number(stats.totalWasteKg) > 0 || Number(stats.totalUsers) > 0 || Number(stats.totalRedemptions) > 0;
  const maxRedeemed = Math.max(...mostRedeemed.map((r) => r.count), 1);

  const STAT_CARDS = [
    {
      icon: UserPlus,
      label: "Total Citizens",
      value: loading ? "–" : stats.totalUsers.toLocaleString(),
      color: "#3B82F6",
      bg: "#DBEAFE",
    },
    {
      icon: Recycle,
      label: "Waste Collected",
      value: loading ? "–" : `${Number(stats.totalWasteKg).toLocaleString()} kg`,
      color: "#0D631B",
      bg: "#E7F7EC",
    },
    {
      icon: Coins,
      label: "Points Distributed",
      value: loading ? "–" : Number(stats.totalPoints).toLocaleString(),
      color: "#7C3AED",
      bg: "#EFECFF",
    },
    {
      icon: Wallet,
      label: "Total Redemptions",
      value: loading ? "–" : stats.totalRedemptions.toLocaleString(),
      color: "#B45309",
      bg: "#FEF3C7",
    },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3 flex-wrap font-sans">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Platform Analytics &amp; Reports</h1>
          <p className="text-sm text-[#6B7280]">Recycling trends and voucher redemptions</p>
        </div>

        <div className="flex items-center gap-3">
          <select className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#374151] focus:outline-none shadow-xs">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: stat.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </span>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-300" />}
              </div>
              <p className="mt-3 text-xs text-[#6B7280]">{stat.label}</p>
              <p className="text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid lg:grid-cols-2 gap-6 font-sans">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Monthly Waste Collection (kg)</p>
          {loading ? (
            <div className="flex h-[200px] flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#0D631B]" />
              <span className="text-xs text-[#6B7280]">Loading monthly waste data...</span>
            </div>
          ) : hasMonthlyWaste ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyWaste}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip cursor={{ fill: "#F3F4F6" }} formatter={(v) => [`${v} kg`, "Collected"]} />
                <Bar dataKey="kg" radius={[4, 4, 0, 0]}>
                  {monthlyWaste.map((entry, i) => (
                    <Cell key={entry.month} fill={i === monthlyWaste.length - 1 ? "#0D631B" : "#86EFAC"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-[#6B7280] text-center px-4">
              No monthly waste data yet.
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Citizen User Growth</p>
          {loading ? (
            <div className="flex h-[200px] flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#0D631B]" />
              <span className="text-xs text-[#6B7280]">Loading citizen user growth...</span>
            </div>
          ) : hasUserGrowth ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="userGrowthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D631B" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0D631B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip formatter={(v) => [v, "Users"]} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0D631B"
                  strokeWidth={2}
                  fill="url(#userGrowthFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-[#6B7280] text-center px-4">
              No user growth data yet.
            </div>
          )}
        </div>
      </div>

      {/* Waste by Type / Most Redeemed / Collection Centers */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Waste by Type</p>
          {loading ? (
            <div className="flex h-[180px] flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#0D631B]" />
              <span className="text-xs text-[#6B7280]">Loading waste breakdown...</span>
            </div>
          ) : hasWasteBreakdown ? (
            <>
              <div className="relative">
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie data={wasteByType} dataKey="value" innerRadius={38} outerRadius={58} paddingAngle={2}>
                      {wasteByType.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold text-[#1A1A2E]">
                    {Number(stats.totalWasteKg).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#6B7280]">kg total</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {wasteByType.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    {item.name} ({item.value}%)
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[180px] items-center justify-center text-sm text-[#6B7280] text-center px-4">
              No waste breakdown data yet.
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Most Redeemed Rewards</p>
          {loading ? (
            <div className="flex h-[180px] flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#0D631B]" />
              <span className="text-xs text-[#6B7280]">Loading redeemed rewards...</span>
            </div>
          ) : hasMostRedeemed ? (
            <div className="space-y-3">
              {mostRedeemed.map((r) => (
                <div key={r.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#374151]">{r.name}</span>
                    <span className="text-[#6B7280]">{r.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0D631B]"
                      style={{ width: `${(r.count / maxRedeemed) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[180px] items-center justify-center text-sm text-[#6B7280] text-center px-4">
              No redeemed rewards yet.
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Platform Summary</p>
          {loading ? (
            <div className="flex h-[180px] flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#0D631B]" />
              <span className="text-xs text-[#6B7280]">Loading platform summary...</span>
            </div>
          ) : hasPlatformSummary ? (
            <div className="space-y-4">
              {[
                { label: "CO₂ Prevented", value: `${(Number(stats.totalWasteKg) * 1.85).toFixed(0)} kg`, color: "#0D631B" },
                { label: "Trees Equivalent", value: `${((Number(stats.totalWasteKg) * 1.85) / 21.77).toFixed(0)}`, color: "#16A34A" },
                { label: "Water Saved", value: `${(Number(stats.totalWasteKg) * 120).toLocaleString()} L`, color: "#0369A1" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#374151]">{item.label}</span>
                    <span className="font-semibold" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[180px] items-center justify-center text-sm text-[#6B7280] text-center px-4">
              No platform summary data yet.
            </div>
          )}
        </div>
      </div>

      {/* Summary banner */}
      <div className="mt-6 bg-[#12151C] rounded-2xl px-6 py-5 flex items-center justify-between flex-wrap gap-4 font-sans text-white shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#0D631B] flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Lagos Environmental Milestone</p>
            <p className="text-xs text-white/60">
              {loading
                ? "Loading platform data..."
                : `Over ${Number(stats.totalWasteKg).toLocaleString()} kg of recyclable waste diverted from Lagos landfills.`}
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-[10px] text-white/50 uppercase">Total Waste</p>
            <p className="text-sm font-bold text-white">
              {loading ? "–" : `${Number(stats.totalWasteKg).toLocaleString()} kg`}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase">Active Citizens</p>
            <p className="text-sm font-bold text-white">
              {loading ? "–" : stats.totalUsers.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase">Redemptions</p>
            <p className="text-sm font-bold text-white">
              {loading ? "–" : stats.totalRedemptions.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}