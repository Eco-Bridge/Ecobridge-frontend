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
import { dashboardService, rewardsService } from "../../services";

const DEFAULT_MONTHLY_WASTE = [
  { month: "Jan", kg: 320 },
  { month: "Feb", kg: 380 },
  { month: "Mar", kg: 290 },
  { month: "Apr", kg: 420 },
  { month: "May", kg: 480 },
  { month: "Jun", kg: 510 },
  { month: "Jul", kg: 560 },
  { month: "Aug", kg: 600 },
  { month: "Sep", kg: 640 },
  { month: "Oct", kg: 680 },
  { month: "Nov", kg: 720 },
  { month: "Dec", kg: 820 },
];

const DEFAULT_USER_GROWTH = [
  { month: "Jan", users: 40 },
  { month: "Feb", users: 55 },
  { month: "Mar", users: 60 },
  { month: "Apr", users: 75 },
  { month: "May", users: 85 },
  { month: "Jun", users: 95 },
  { month: "Jul", users: 105 },
  { month: "Aug", users: 115 },
  { month: "Sep", users: 125 },
  { month: "Oct", users: 135 },
  { month: "Nov", users: 145 },
  { month: "Dec", users: 152 },
];

const DEFAULT_WASTE_BY_TYPE = [
  { name: "Plastic", value: 40, color: "#3B82F6" },
  { name: "Paper", value: 25, color: "#F59E0B" },
  { name: "Metal", value: 20, color: "#9CA3AF" },
  { name: "Glass", value: 10, color: "#06B6D4" },
  { name: "Electronics", value: 5, color: "#7C3AED" },
];

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
  const [monthlyWaste, setMonthlyWaste] = useState(DEFAULT_MONTHLY_WASTE);
  const [userGrowth, setUserGrowth] = useState(DEFAULT_USER_GROWTH);
  const [wasteByType, setWasteByType] = useState(DEFAULT_WASTE_BY_TYPE);
  const [mostRedeemed, setMostRedeemed] = useState([
    { name: "MTN N500", count: 145 },
    { name: "Airtel N200", count: 98 },
    { name: "Shoprite N1000", count: 67 },
    { name: "MTN N100", count: 52 },
    { name: "Discount", count: 25 },
  ]);

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
          const data = dashRes.value;
          const overview = data?.overview || data || {};
          const usersByRole = Array.isArray(data?.usersByRole) ? data.usersByRole : [];
          const totalUsers =
            Number(overview.totalUsers ?? data?.totalUsers ?? 0) ||
            usersByRole.reduce((sum, item) => sum + Number(item.count || 0), 0) ||
            0;

          setStats({
            totalUsers,
            totalWasteKg: Number(overview.totalWeightRecycledKg ?? data?.totalWeightKg ?? data?.allTimeWeightKg ?? 0),
            totalPoints: Number(overview.totalPointsDistributed ?? data?.totalPoints ?? data?.allTimePoints ?? 0),
            totalRedemptions: Number(overview.totalRewardsRedeemed ?? data?.totalRedemptions ?? data?.redemptionsCount ?? 0),
          });

          const breakdown = data?.wasteCategoryBreakdown ?? data?.categoryBreakdown ?? data?.wasteByCategory ?? null;
          if (Array.isArray(breakdown) && breakdown.length > 0) {
            const pieData = breakdown.map((item, index) => ({
              name: item.name || item.category || item.label || `Category ${index + 1}`,
              value: Number(item.value ?? item.percent ?? item.count ?? 0),
              color: item.color || WASTE_COLORS[item.key] || WASTE_COLORS.OTHER || "#6B7280",
            }));
            setWasteByType(pieData);
          } else if (breakdown && typeof breakdown === "object") {
            const entries = Object.entries(breakdown);
            if (entries.length > 0) {
              const total = entries.reduce((sum, [, v]) => sum + (Number(v) || 0), 0);
              const pieData = entries.map(([key, value]) => ({
                name: key
                  .replace("_", "/")
                  .replace("PAPER_CARDBOARD", "Paper")
                  .replace("CANS_METAL", "Metal")
                  .replace("E_WASTE", "E-Waste")
                  .replace(/^(.)(.*)/, (m, a, b) => a + b.toLowerCase()),
                value: total > 0 ? Math.round((Number(value) / total) * 100) : 0,
                color: WASTE_COLORS[key] ?? "#6B7280",
              }));
              setWasteByType(pieData);
            }
          }

          const monthly = data?.monthlyWaste ?? data?.monthlyCollections ?? null;
          if (Array.isArray(monthly) && monthly.length > 0) {
            const formatted = monthly.map((m) => ({
              month: m.month
                ? MONTH_NAMES[parseInt(m.month, 10) - 1] ?? m.month
                : m.label ?? m.name ?? "",
              kg: Number(m.weightKg ?? m.kg ?? m.amount ?? 0),
            }));
            setMonthlyWaste(formatted);
          }

          const growth = data?.userGrowth ?? data?.monthlyUsers ?? null;
          if (Array.isArray(growth) && growth.length > 0) {
            const formatted = growth.map((g) => ({
              month: g.month
                ? MONTH_NAMES[parseInt(g.month, 10) - 1] ?? g.month
                : g.label ?? "",
              users: Number(g.count ?? g.users ?? 0),
            }));
            setUserGrowth(formatted);
          }
        }

        // Most redeemed rewards
        if (redemptionsRes.status === "fulfilled") {
          const redemptions = redemptionsRes.value?.redemptions ?? redemptionsRes.value ?? [];
          if (Array.isArray(redemptions) && redemptions.length > 0) {
            // Count redemptions per reward
            const countMap = {};
            redemptions.forEach((r) => {
              const name = r.reward?.title ?? r.rewardName ?? r.name ?? "Unknown";
              countMap[name] = (countMap[name] || 0) + 1;
            });
            const sorted = Object.entries(countMap)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);
            if (sorted.length > 0) setMostRedeemed(sorted);
          }
        }
      } catch (err) {
        console.error("Analytics load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

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
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Citizen User Growth</p>
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
        </div>
      </div>

      {/* Waste by Type / Most Redeemed / Collection Centers */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Waste by Type</p>
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
                {loading ? "–" : Number(stats.totalWasteKg).toLocaleString()}
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
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Most Redeemed Rewards</p>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Loading...</span>
            </div>
          ) : (
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
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Platform Summary</p>
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
                    {loading ? "–" : item.value}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
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