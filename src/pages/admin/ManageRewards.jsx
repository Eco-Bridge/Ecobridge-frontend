import { useState } from "react";
import { Search, Plus, Tag, CheckCircle2, Gift, Smartphone, ShoppingBasket, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";

const STATS = [
  { icon: Tag, label: "TOTAL REWARDS", value: "1,245", color: "#3B82F6", bg: "#DBEAFE" },
  { icon: CheckCircle2, label: "ACTIVE REWARDS", value: "1,102", color: "#16A34A", bg: "#DCFCE7" },
  { icon: Gift, label: "REDEEMED THIS MONTH", value: "348", color: "#7C3AED", bg: "#EFECFF" },
];

const REWARDS = [
  {
    name: "MTN N500 Airtime",
    category: "Telecom • Airtime",
    status: "Active",
    points: 5000,
    stock: "Unlimited",
    lowStock: false,
    icon: Smartphone,
    iconBg: "#FEF3C7",
    iconColor: "#B45309",
  },
  {
    name: "Airtel N200 Airtime",
    category: "Telecom • Airtime",
    status: "Active",
    points: 2000,
    stock: "Unlimited",
    lowStock: false,
    icon: Smartphone,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
  },
  {
    name: "Shoprite N1000 Voucher",
    category: "Retail • Groceries",
    status: "Low Stock",
    points: 10000,
    stock: "12 left",
    lowStock: true,
    icon: ShoppingBasket,
    iconBg: "#EFECFF",
    iconColor: "#7C3AED",
  },
];

export default function ManageRewards() {
  const [search, setSearch] = useState("");

  const filtered = REWARDS.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Reward Inventory</h1>
          <p className="text-sm text-[#6B7280]">Manage and track available user rewards.</p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15]">
          <Plus className="w-4 h-4" /> Add New Reward
        </button>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
              </div>
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: stat.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rewards..."
          className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
        />
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((reward) => {
          const Icon = reward.icon;
          return (
            <div key={reward.name} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
              <div className="flex items-start justify-between">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: reward.iconBg }}
                >
                  <Icon className="w-5 h-5" style={{ color: reward.iconColor }} />
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    reward.lowStock ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#E7F7EC] text-[#0D631B]"
                  }`}
                >
                  {reward.status}
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">{reward.name}</p>
              <p className="text-xs text-[#6B7280]">{reward.category}</p>

              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Points Required</span>
                  <span className="font-semibold text-[#0D631B]">
                    {reward.points.toLocaleString()} pts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Stock Level</span>
                  <span className={`font-medium ${reward.lowStock ? "text-[#DC2626]" : "text-[#374151]"}`}>
                    {reward.stock}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-[#E5E7EB] text-[#374151] py-2 rounded-lg hover:bg-gray-50">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-[#FECACA] text-[#DC2626] py-2 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}