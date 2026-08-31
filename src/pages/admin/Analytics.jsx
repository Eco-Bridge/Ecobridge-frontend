import {
  UserPlus,
  Recycle,
  Coins,
  Wallet,
  Download,
  Trophy,
  TrendingUp,
  TrendingDown,
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

const STATS = [
  { icon: UserPlus, label: "New Users", value: "152", change: "+12%", up: true, color: "#3B82F6", bg: "#DBEAFE" },
  { icon: Recycle, label: "Waste Collected", value: "820kg", change: "+8%", up: true, color: "#0D631B", bg: "#E7F7EC" },
  { icon: Coins, label: "Points Distributed", value: "41,000", change: "-2%", up: false, color: "#7C3AED", bg: "#EFECFF" },
  { icon: Wallet, label: "Est. Revenue", value: "₦80k", change: "+5%", up: true, color: "#B45309", bg: "#FEF3C7" },
];

const MONTHLY_WASTE = [
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

const USER_GROWTH = [
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

const WASTE_BY_TYPE = [
  { name: "Plastic", value: 40, color: "#3B82F6" },
  { name: "Paper", value: 25, color: "#F59E0B" },
  { name: "Metal", value: 20, color: "#9CA3AF" },
  { name: "Glass", value: 10, color: "#06B6D4" },
  { name: "Electronics", value: 5, color: "#7C3AED" },
];

const MOST_REDEEMED = [
  { name: "MTN N500", count: 145 },
  { name: "Airtel N200", count: 98 },
  { name: "Shoprite N1000", count: 67 },
  { name: "MTN N100", count: 52 },
  { name: "Discount", count: 25 },
];

const COLLECTION_CENTERS = [
  { name: "Ikeja", pct: 85 },
  { name: "Lekki", pct: 60 },
  { name: "Surulere", pct: 53 },
  { name: "Yaba", pct: 40 },
  { name: "Ajah", pct: 34 },
];

const RANK_COLORS = { 1: "#F59E0B", 2: "#9CA3AF", 3: "#B45309" };

const TOP_RECYCLERS = [
  { rank: 1, name: "John Doe", id: "ECO-882", kg: 45.2, points: 4520, reward: "Airtime" },
  { rank: 2, name: "Amina Smith", id: "ECO-441", kg: 38.0, points: 3800, reward: null },
  { rank: 3, name: "Chidi Okonkwo", id: "ECO-719", kg: 31.5, points: 3150, reward: "Airtime" },
  { rank: 4, name: "Bisi Lawal", id: "ECO-160", kg: 29.1, points: 2910, reward: null },
];

const MATERIAL_STYLES = {
  Plastic: { bg: "#DBEAFE", text: "#3B82F6" },
  Paper: { bg: "#FEF3C7", text: "#B45309" },
  Metal: { bg: "#F3F4F6", text: "#6B7280" },
};

const RECENT_TRANSACTIONS = [
  { user: "ECO-882", type: "Plastic", weight: "12.5kg", points: "+125" },
  { user: "ECO-411", type: "Paper", weight: "8.2kg", points: "+82" },
  { user: "ECO-933", type: "Metal", weight: "4.0kg", points: "+40" },
  { user: "ECO-105", type: "Plastic", weight: "15.0kg", points: "+150" },
];

const maxRedeemed = Math.max(...MOST_REDEEMED.map((r) => r.count));

export default function Analytics() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-end gap-3 flex-wrap">
        <select className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white focus:outline-none">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
        </select>
        <button className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15]">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.up ? TrendingUp : TrendingDown;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: stat.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.up ? "text-[#16A34A]" : "text-[#DC2626]"
                  }`}
                >
                  <TrendIcon className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 text-xs text-[#6B7280]">{stat.label}</p>
              <p className="text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
              <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: stat.change.replace(/[^0-9]/g, "") + "0%", backgroundColor: stat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Monthly Waste Collection</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_WASTE}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip cursor={{ fill: "#F3F4F6" }} formatter={(v) => [`${v} kg`, "Collected"]} />
              <Bar dataKey="kg" radius={[4, 4, 0, 0]}>
                {MONTHLY_WASTE.map((entry, i) => (
                  <Cell key={entry.month} fill={i === MONTHLY_WASTE.length - 1 ? "#0D631B" : "#86EFAC"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">User Growth</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={USER_GROWTH}>
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
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Waste by Type</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={WASTE_BY_TYPE} dataKey="value" innerRadius={38} outerRadius={58} paddingAngle={2}>
                  {WASTE_BY_TYPE.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-[#1A1A2E]">5,320</span>
              <span className="text-[10px] text-[#6B7280]">kg total</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {WASTE_BY_TYPE.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Most Redeemed Rewards</p>
          <div className="space-y-3">
            {MOST_REDEEMED.map((r) => (
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
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Collection Centers</p>
          <div className="space-y-3">
            {COLLECTION_CENTERS.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#374151]">{c.name}</span>
                  <span className="text-[#6B7280]">{c.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#0D631B]" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Recyclers / Recent Transactions */}
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Top Recyclers</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                <th className="pb-2 font-medium">Rank</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Kg</th>
                <th className="pb-2 font-medium">Points</th>
                <th className="pb-2 font-medium">Rewards</th>
              </tr>
            </thead>
            <tbody>
              {TOP_RECYCLERS.map((u) => (
                <tr key={u.id} className="border-b border-[#F3F4F6]">
                  <td className="py-2.5">
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ backgroundColor: RANK_COLORS[u.rank] || "#D1D5DB" }}
                    >
                      {u.rank}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#0D631B] text-white text-[10px] font-semibold flex items-center justify-center">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div>
                        <p className="text-[#1A1A2E] font-medium leading-none">{u.name}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-[#374151]">{u.kg}</td>
                  <td className="py-2.5 text-[#374151]">{u.points.toLocaleString()}</td>
                  <td className="py-2.5">
                    {u.reward ? (
                      <span className="text-xs bg-[#E7F7EC] text-[#0D631B] px-2 py-0.5 rounded-full">
                        {u.reward}
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-[#9CA3AF] px-2 py-0.5 rounded-full">
                        None
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#1A1A2E]">Recent Transactions</p>
            <a href="/admin/record-waste" className="text-xs text-[#0D631B] hover:underline">
              View All
            </a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Wt</th>
                <th className="pb-2 font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_TRANSACTIONS.map((t) => {
                const style = MATERIAL_STYLES[t.type];
                return (
                  <tr key={t.user} className="border-b border-[#F3F4F6]">
                    <td className="py-2.5 text-[#1A1A2E]">{t.user}</td>
                    <td className="py-2.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-[#374151]">{t.weight}</td>
                    <td className="py-2.5 font-medium text-[#0D631B]">{t.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary banner */}
      <div className="mt-6 bg-[#12151C] rounded-xl px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#0D631B] flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">January Summary</p>
            <p className="text-xs text-white/60">
              Record breaking month for plastic collection in Ikeja.
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-[10px] text-white/50">WASTE</p>
            <p className="text-sm font-bold text-white">820kg</p>
          </div>
          <div>
            <p className="text-[10px] text-white/50">USERS</p>
            <p className="text-sm font-bold text-white">152</p>
          </div>
          <div>
            <p className="text-[10px] text-white/50">REVENUE</p>
            <p className="text-sm font-bold text-white">₦80k</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}