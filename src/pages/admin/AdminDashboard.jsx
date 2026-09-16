import { useState, useEffect } from "react";
import {
  Users,
  Recycle,
  Gift,
  Wallet,
  Download,
  PlusCircle,
  UserPlus,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { dashboardService } from "../../services";
import { useAuth } from "../../context/AuthContext";


const MATERIAL_STYLES = {
  PLASTIC: { bg: "#DBEAFE", text: "#3B82F6", label: "PET Plastic" },
  "PET Plastic": { bg: "#DBEAFE", text: "#3B82F6", label: "PET Plastic" },
  CANS_METAL: { bg: "#DCFCE7", text: "#16A34A", label: "Aluminum" },
  Aluminum: { bg: "#DCFCE7", text: "#16A34A", label: "Aluminum" },
  GLASS: { bg: "#F3F4F6", text: "#6B7280", label: "Glass" },
  Glass: { bg: "#F3F4F6", text: "#6B7280", label: "Glass" },
};

const TOP_RECYCLERS = [
  { rank: 1, name: "EcoSchool Ikeja", weight: "450 kg" },
  { rank: 2, name: "Oluwaseun B.", weight: "312 kg" },
  { rank: 3, name: "GreenTech Ltd", weight: "289 kg" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      try {
        const response = await dashboardService.getAdminDashboard();
        if (isMounted) setData(response);
      } catch (err) {
        console.warn("Using default admin analytics:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toNumber = (value, fallback = 0) => {
    const parsed = Number(value ?? fallback);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const formatLabel = (value) => {
    if (!value) return "Unknown";
    return String(value)
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatMetricNumber = (value, fallback) => {
    const numeric = toNumber(value, fallback);
    return Number.isFinite(numeric) ? numeric.toLocaleString() : String(fallback ?? 0);
  };

  const pickFirstDefined = (...values) => values.find((value) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0) && !(typeof value === 'object' && Object.keys(value).length === 0));

  const overview = data?.overview || data || {};
  const usersByRole = Array.isArray(data?.usersByRole) ? data.usersByRole : Array.isArray(overview.usersByRole) ? overview.usersByRole : [];
  const citizenCount = usersByRole.reduce((sum, item) => {
    const role = String(item?.role || '').toUpperCase();
    if (role === 'CITIZEN') {
      return sum + toNumber(item?.count ?? item?.total ?? item?.value ?? 0, 0);
    }
    return sum;
  }, 0);

  const totalUsers = toNumber(
    pickFirstDefined(
      citizenCount > 0 ? citizenCount : undefined,
      overview.totalCitizens,
      data?.totalCitizens,
      overview.totalUsers,
      data?.totalUsers,
      data?.usersCount,
      data?.stats?.totalUsers,
      overview.usersCount,
      0
    ),
    0
  );
  const wasteCollected = toNumber(
    pickFirstDefined(
      overview.totalWeightRecycledKg,
      overview.totalWasteKg,
      overview.totalWeightKg,
      data?.totalWeightKg,
      data?.allTimeWeightKg,
      data?.totalWasteKg,
      data?.stats?.totalWeightKg,
      0
    ),
    0
  );
  const rewardsIssued = toNumber(
    pickFirstDefined(
      overview.totalRewardsIssued,
      overview.rewardsIssuedCount,
      overview.totalRewardsRedeemed,
      data?.totalRewardsIssued,
      data?.rewardsIssuedCount,
      data?.rewardsIssued,
      data?.stats?.rewardsIssuedCount,
      0
    ),
    0
  );
  const revenue = toNumber(
    pickFirstDefined(
      overview.totalRevenue,
      overview.totalRevenueGenerated,
      overview.revenue,
      data?.totalRevenue,
      data?.totalRevenueGenerated,
      data?.revenue,
      data?.stats?.totalRevenue,
      0
    ),
    0
  );

  const stats = [
    { icon: Users, label: "Total Users", value: formatMetricNumber(totalUsers, 0), change: "+12%", color: "#3B82F6", bg: "#DBEAFE" },
    { icon: Recycle, label: "Waste Collected", value: `${formatMetricNumber(wasteCollected || overview.wasteCollectedKg || data?.wasteCollectedKg || 0, 0)} kg`, change: "+9%", color: "#0D631B", bg: "#E7F7EC" },
    { icon: Gift, label: "Rewards Issued", value: formatMetricNumber(rewardsIssued, 0), change: "+5%", color: "#7C3AED", bg: "#EFECFF" },
    { icon: Wallet, label: "Revenue", value: `₦${formatMetricNumber(revenue, 0)}`, change: "+20%", color: "#B45309", bg: "#FEF3C7" },
  ];

  const normalizeBreakdown = (breakdown) => {
    if (Array.isArray(breakdown)) {
      if (breakdown.length === 0) return [];
      return breakdown.map((item, index) => ({
        name: item.name || item.label || item.material || item.category || item.wasteType || `Category ${index + 1}`,
        value: toNumber(item.value ?? item.percent ?? item.share ?? item.count ?? item.totalWeightKg ?? item.weightKg ?? 0, 0),
        color: item.color || ["#0D631B", "#4ADE80", "#1A1A2E", "#3B82F6"][index % 4],
      }));
    }

    if (breakdown && typeof breakdown === "object") {
      const entries = Object.entries(breakdown);
      if (entries.length === 0) return [];
      return entries.map(([key, value], index) => ({
        name: formatLabel(key),
        value: toNumber(value, 0),
        color: ["#0D631B", "#4ADE80", "#1A1A2E", "#3B82F6"][index % 4],
      }));
    }

    return [];
  };

  const normalizeMonthlyWaste = (monthly) => {
    if (Array.isArray(monthly)) {
      if (monthly.length === 0) return [];
      return monthly.map((item, index) => ({
        month: item.month || item.label || item.name || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index] || `M${index + 1}`,
        kg: toNumber(item.kg ?? item.weightKg ?? item.totalWeightKg ?? item.totalKg ?? item.value ?? item.amount, 0),
      }));
    }

    return [];
  };

  const normalizeTopRecyclers = (recyclers) => {
    if (!Array.isArray(recyclers) || recyclers.length === 0) {
      return TOP_RECYCLERS.map((item, index) => ({
        name: item.name,
        weight: item.weight,
        totalWeightKg: item.weight ? Number.parseFloat(item.weight) || 0 : 0,
        rank: index + 1,
      }));
    }

    return recyclers.map((item, index) => ({
      rank: index + 1,
      name: item.name || item.user || item.fullName || `Recycler ${index + 1}`,
      weight: `${toNumber(item.totalWeightKg ?? item.weightKg ?? item.totalWeight ?? item.weight ?? 0, 0).toLocaleString()} kg`,
      totalWeightKg: toNumber(item.totalWeightKg ?? item.weightKg ?? item.totalWeight ?? item.weight ?? 0, 0),
    }));
  };

  const normalizeRecentCollections = (recent) => {
    if (Array.isArray(recent)) {
      if (recent.length === 0) return [];
      return recent.map((row) => ({
        user: row.user || row.userName || row.userEmail || row.name || "Citizen",
        material: row.material || row.wasteType || row.category || row.type || row.name || "PET Plastic",
        weight: row.weight || row.weightKg || row.amountKg ? `${row.weight ?? row.weightKg ?? row.amountKg} kg` : "0 kg",
        weightKg: toNumber(row.weightKg ?? row.weight ?? row.amountKg, 0),
        date: row.createdAt || row.date || row.recordedAt || "Today",
        verified: row.verified ?? true,
      }));
    }

    return [];
  };

  const recentCollections = normalizeRecentCollections(
    pickFirstDefined(
      data?.overview?.recentCollections,
      data?.recentCollections,
      data?.recentFeed,
      data?.activity,
      data?.stats?.recentCollections,
      overview.recentCollections,
      overview.recentFeed,
      []
    )
  );
  const breakdown = normalizeBreakdown(
    pickFirstDefined(
      data?.overview?.wasteBreakdown,
      data?.wasteBreakdown,
      data?.overview?.wasteCategoryBreakdown,
      data?.wasteCategoryBreakdown,
      data?.categoryBreakdown,
      data?.stats?.categoryBreakdown,
      overview.wasteBreakdown,
      overview.wasteCategoryBreakdown,
      overview.categoryBreakdown,
      []
    )
  );
  const monthlyData = normalizeMonthlyWaste(
    pickFirstDefined(
      data?.overview?.wasteCollectedMonthly,
      data?.wasteCollectedMonthly,
      data?.overview?.monthlyWaste,
      data?.monthlyWaste,
      data?.monthlyCollections,
      data?.stats?.monthlyWaste,
      overview.wasteCollectedMonthly,
      overview.monthlyWaste,
      overview.monthlyCollections,
      []
    )
  );
  const topRecyclers = normalizeTopRecyclers(
    pickFirstDefined(
      data?.overview?.topLagosRecyclers,
      data?.topLagosRecyclers,
      overview.topLagosRecyclers,
      []
    )
  );

  const totalBreakdownValue = breakdown.reduce((sum, item) => sum + toNumber(item.value, 0), 0);
  const chartBreakdown = totalBreakdownValue > 0
    ? breakdown.map((item) => ({
        ...item,
        value: (toNumber(item.value, 0) / totalBreakdownValue) * 100,
      }))
    : breakdown;
  const hasMonthlyData = monthlyData.length > 0;
  const hasBreakdownData = breakdown.length > 0;
  const hasRecentCollections = recentCollections.length > 0;

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 font-sans">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">
            Welcome, {user?.name?.split(" ")[0] || "Admin"}! 👋
          </h1>
          <p className="text-sm text-[#6B7280]">
            Platform Overview • Lagos Recycling Network
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col justify-center items-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D631B]" />
          <p className="text-sm font-medium">Loading platform analytics...</p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: stat.bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-medium text-[#16A34A]">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-[#6B7280]">{stat.label}</p>
                  <p className="text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="mt-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Waste Collected Monthly (kg)</p>
              {hasMonthlyData ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <Tooltip cursor={{ fill: "#F3F4F6" }} formatter={(v) => [`${v} kg`, "Collected"]} />
                    <Bar dataKey="kg" fill="#0D631B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-sm text-[#6B7280] border border-dashed border-[#E5E7EB] rounded-lg">
                  No monthly waste data available yet.
                </div>
              )}
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Waste Breakdown by Category</p>
              {hasBreakdownData ? (
                <>
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={chartBreakdown}
                          dataKey="value"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {chartBreakdown.map((entry, idx) => (
                            <Cell key={entry.name || idx} fill={entry.color || ["#0D631B", "#4ADE80", "#1A1A2E", "#3B82F6"][idx % 4]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-lg font-bold text-[#1A1A2E]">{totalBreakdownValue > 0 ? "100%" : "0%"}</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {breakdown.map((item, idx) => (
                      <div key={item.name || idx} className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color || ["#0D631B", "#4ADE80", "#1A1A2E", "#3B82F6"][idx % 4] }}
                        />
                        {item.name} ({item.value}%)
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-sm text-[#6B7280] border border-dashed border-[#E5E7EB] rounded-lg">
                  No category breakdown data available yet.
                </div>
              )}
            </div>
          </div>

          {/* Recent collections + side cards */}
          <div className="mt-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-[#1A1A2E]">Recent Collection Drop-offs</p>
                <Link to="/admin/record-waste" className="text-xs text-[#0D631B] font-medium hover:underline">
                  Log New Drop-off
                </Link>
              </div>
              {hasRecentCollections ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                        <th className="pb-2 font-medium">User</th>
                        <th className="pb-2 font-medium">Material</th>
                        <th className="pb-2 font-medium">Weight</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCollections.map((row, idx) => {
                        const mat = row.wasteType || row.material || "PET Plastic";
                        const style = MATERIAL_STYLES[mat] || MATERIAL_STYLES["PET Plastic"];
                        const statusLabel = row.verified === false ? "Pending" : "Recorded";
                        return (
                          <tr key={idx} className="border-b border-[#F3F4F6]">
                            <td className="py-3 text-[#1A1A2E] font-medium">{row.user || row.userEmail || "Citizen"}</td>
                            <td className="py-3">
                              <span
                                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: style.bg, color: style.text }}
                              >
                                {style.label || mat}
                              </span>
                            </td>
                            <td className="py-3 text-[#374151]">{row.weightKg ? `${row.weightKg} kg` : row.weight}</td>
                            <td className="py-3 text-[#6B7280]">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : row.date}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${row.verified === false ? 'text-[#B45309] bg-[#FEF3C7]' : 'text-[#0D631B] bg-[#E7F7EC]'}`}>
                                <CheckCircle2 className="w-3 h-3" /> {statusLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-sm text-[#6B7280] border border-dashed border-[#E5E7EB] rounded-lg">
                  No recent drop-offs recorded yet.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
                <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Quick Staff Actions</p>
                <div className="space-y-2">
                  <Link
                    to="/admin/record-waste"
                    className="flex items-center gap-2 justify-center text-sm bg-[#0D631B] text-white px-4 py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" /> Record Citizen Waste
                  </Link>
                  <Link
                    to="/admin/manage-users"
                    className="flex items-center gap-2 justify-center text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" /> Manage Citizens & Users
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
                <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Top Lagos Recyclers</p>
                <div className="space-y-3">
                  {topRecyclers.map((r) => (
                    <div key={r.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#E7F7EC] text-[#0D631B] text-xs font-bold flex items-center justify-center">
                          {r.rank}
                        </span>
                        <p className="text-sm text-[#1A1A2E] font-medium">{r.name}</p>
                      </div>
                      <span className="text-xs text-[#6B7280] font-semibold">{r.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}