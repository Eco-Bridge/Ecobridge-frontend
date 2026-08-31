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
  Clock,
} from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import AdminLayout from "../../layouts/AdminLayout";

const STATS = [
  { icon: Users, label: "Total Users", value: "1,247", change: "+12%", color: "#3B82F6", bg: "#DBEAFE" },
  { icon: Recycle, label: "Waste Collected", value: "5,320 kg", change: "+9%", color: "#0D631B", bg: "#E7F7EC" },
  { icon: Gift, label: "Rewards Issued", value: "387", change: "+5%", color: "#7C3AED", bg: "#EFECFF" },
  { icon: Wallet, label: "Revenue", value: "₦532,000", change: "+20%", color: "#B45309", bg: "#FEF3C7" },
];

const MONTHLY_WASTE = [
  { month: "Jan", kg: 320 },
  { month: "Feb", kg: 420 },
  { month: "Mar", kg: 560 },
  { month: "Apr", kg: 480 },
  { month: "May", kg: 650 },
  { month: "Jun", kg: 720 },
];

const WASTE_BREAKDOWN = [
  { name: "PET Plastics", value: 50, color: "#0D631B" },
  { name: "Aluminum", value: 35, color: "#4ADE80" },
  { name: "Glass", value: 15, color: "#1A1A2E" },
];

const MATERIAL_STYLES = {
  "PET Plastic": { bg: "#DBEAFE", text: "#3B82F6" },
  Aluminum: { bg: "#DCFCE7", text: "#16A34A" },
  Glass: { bg: "#F3F4F6", text: "#6B7280" },
};

const RECENT_COLLECTIONS = [
  { user: "John Doe", material: "PET Plastic", weight: "12.5 kg", date: "Today, 10:23 AM", verified: true },
  { user: "Ada Obi", material: "Aluminum", weight: "5.2 kg", date: "Today, 09:15 AM", verified: true },
  { user: "Michael T.", material: "Glass", weight: "18.0 kg", date: "Yesterday", verified: true },
  { user: "Sarah Jen", material: "PET Plastic", weight: "2.1 kg", date: "Yesterday", verified: false },
];

const TOP_RECYCLERS = [
  { rank: 1, name: "EcoSchool Ikeja", weight: "450 kg" },
  { rank: 2, name: "Oluwaseun B.", weight: "312 kg" },
  { rank: 3, name: "GreenTech Ltd", weight: "289 kg" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Good morning, Sarah!</h1>
          <p className="text-sm text-[#6B7280]">Here's what's happening today.</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
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
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Waste Collected Monthly</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_WASTE}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip cursor={{ fill: "#F3F4F6" }} formatter={(v) => [`${v} kg`, "Collected"]} />
              <Bar dataKey="kg" fill="#0D631B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Waste Breakdown</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={WASTE_BREAKDOWN}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {WASTE_BREAKDOWN.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-[#1A1A2E]">100%</span>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {WASTE_BREAKDOWN.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent collections + side cards */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#1A1A2E]">Recent Collections</p>
            <a href="/admin/record-waste" className="text-xs text-[#0D631B] hover:underline">
              View All
            </a>
          </div>
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
              {RECENT_COLLECTIONS.map((row) => {
                const style = MATERIAL_STYLES[row.material];
                return (
                  <tr key={row.user + row.date} className="border-b border-[#F3F4F6]">
                    <td className="py-3 text-[#1A1A2E]">{row.user}</td>
                    <td className="py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {row.material}
                      </span>
                    </td>
                    <td className="py-3 text-[#374151]">{row.weight}</td>
                    <td className="py-3 text-[#6B7280]">{row.date}</td>
                    <td className="py-3">
                      {row.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[#0D631B] bg-[#E7F7EC] px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Quick Actions</p>
            <div className="space-y-2">
              <a
                href="/admin/record-waste"
                className="flex items-center gap-2 justify-center text-sm bg-[#0D631B] text-white px-4 py-2 rounded-lg hover:bg-[#0a4f15]"
              >
                <PlusCircle className="w-4 h-4" /> Log New Waste
              </a>
              <a
                href="/admin/manage-users"
                className="flex items-center gap-2 justify-center text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <UserPlus className="w-4 h-4" /> Register User
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Top Recyclers</p>
            <div className="space-y-3">
              {TOP_RECYCLERS.map((r) => (
                <div key={r.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E7F7EC] text-[#0D631B] text-xs font-bold flex items-center justify-center">
                      {r.rank}
                    </span>
                    <p className="text-sm text-[#1A1A2E]">{r.name}</p>
                  </div>
                  <span className="text-xs text-[#6B7280]">{r.weight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}