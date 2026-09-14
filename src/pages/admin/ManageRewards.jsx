import { useState, useEffect } from "react";
import { Search, Plus, Tag, CheckCircle2, Gift, Smartphone, ShoppingBasket, Pencil, Trash2, X, Loader2 } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { rewardsService } from "../../services";

const DEFAULT_REWARDS = [
  {
    id: "rew-1",
    name: "MTN N500 Airtime",
    category: "Telecom • Airtime",
    status: "Active",
    points: 500,
    stock: "Unlimited",
    lowStock: false,
    icon: Smartphone,
    iconBg: "#FEF3C7",
    iconColor: "#B45309",
  },
  {
    id: "rew-2",
    name: "Airtel N200 Airtime",
    category: "Telecom • Airtime",
    status: "Active",
    points: 200,
    stock: "Unlimited",
    lowStock: false,
    icon: Smartphone,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
  },
  {
    id: "rew-3",
    name: "Shoprite N1000 Voucher",
    category: "Retail • Groceries",
    status: "Low Stock",
    points: 900,
    stock: "12 left",
    lowStock: true,
    icon: ShoppingBasket,
    iconBg: "#EFECFF",
    iconColor: "#7C3AED",
  },
];

export default function ManageRewards() {
  const [search, setSearch] = useState("");
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Airtime");
  const [newPoints, setNewPoints] = useState("");
  const [newStock, setNewStock] = useState("");

  useEffect(() => {
    async function loadRewards() {
      try {
        const data = await rewardsService.getRewards();
        const list = Array.isArray(data) ? data : data.rewards || DEFAULT_REWARDS;
        const formatted = list.map((r, i) => ({
          id: r.id || `rew-${i}`,
          name: r.title || r.name,
          category: r.category || "Vouchers",
          status: r.isActive !== false ? (r.stock <= 5 && r.stock > 0 ? "Low Stock" : "Active") : "Inactive",
          points: r.pointsRequired ?? r.points ?? 500,
          stock: r.stock !== undefined ? (r.stock > 0 ? `${r.stock} left` : "Unlimited") : "Unlimited",
          lowStock: r.stock <= 5 && r.stock > 0,
          icon: (r.category || "").includes("Airtime") ? Smartphone : ShoppingBasket,
          iconBg: (r.category || "").includes("Airtime") ? "#FEF3C7" : "#EFECFF",
          iconColor: (r.category || "").includes("Airtime") ? "#B45309" : "#7C3AED",
        }));
        setRewards(formatted);
      } catch (err) {
        setRewards(DEFAULT_REWARDS);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, []);

  const handleCreateReward = async (e) => {
    e.preventDefault();
    const payload = {
      title: newTitle,
      category: newCategory,
      pointsRequired: parseInt(newPoints, 10),
      stock: parseInt(newStock, 10) || 100,
      partnerName: newCategory === "Airtime" ? "Telecom Partner" : "Retail Partner",
    };

    try {
      await rewardsService.createReward(payload);
    } catch (err) {
      console.warn("Backend add reward fallback:", err.message);
    }

    const created = {
      id: `rew-${Date.now()}`,
      name: newTitle,
      category: newCategory,
      status: "Active",
      points: parseInt(newPoints, 10),
      stock: `${newStock || 100} left`,
      lowStock: false,
      icon: newCategory === "Airtime" ? Smartphone : ShoppingBasket,
      iconBg: newCategory === "Airtime" ? "#FEF3C7" : "#EFECFF",
      iconColor: newCategory === "Airtime" ? "#B45309" : "#7C3AED",
    };

    setRewards((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewTitle("");
    setNewPoints("");
    setNewStock("");
  };

  const handleDelete = async (id) => {
    try {
      await rewardsService.deleteReward(id);
    } catch (err) {
      console.warn("Delete fallback:", err.message);
    }
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = rewards.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { icon: Tag, label: "TOTAL REWARDS", value: rewards.length.toString(), color: "#3B82F6", bg: "#DBEAFE" },
    { icon: CheckCircle2, label: "ACTIVE CATALOG", value: rewards.filter((r) => r.status === "Active").length.toString(), color: "#16A34A", bg: "#DCFCE7" },
    { icon: Gift, label: "REDEEMED THIS MONTH", value: "348", color: "#7C3AED", bg: "#EFECFF" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 font-sans">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Reward Inventory & Catalog</h1>
          <p className="text-sm text-[#6B7280]">Manage, add, and track redeemable citizen rewards.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Reward
        </button>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4 font-sans">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-[#6B7280] font-medium">{stat.label}</p>
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

      <div className="mt-6 relative max-w-sm font-sans">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rewards catalog..."
          className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
        />
      </div>

      {loading ? (
        <div className="py-16 flex flex-col justify-center items-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D631B]" />
          <p className="text-sm font-medium">Loading rewards inventory...</p>
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
          {filtered.map((reward) => {
            const Icon = reward.icon;
            return (
              <div key={reward.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: reward.iconBg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: reward.iconColor }} />
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        reward.lowStock ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#E7F7EC] text-[#0D631B]"
                      }`}
                    >
                      {reward.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-bold text-[#1A1A2E]">{reward.name}</p>
                  <p className="text-xs text-[#6B7280]">{reward.category}</p>

                  <div className="mt-4 space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Points Required</span>
                      <span className="font-bold text-[#0D631B]">
                        {reward.points.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Stock Status</span>
                      <span className={`font-semibold ${reward.lowStock ? "text-[#DC2626]" : "text-[#374151]"}`}>
                        {reward.stock}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-[#E5E7EB] text-[#374151] py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-[#FECACA] text-[#DC2626] py-2 rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1A1A2E]">Add New Reward to Catalog</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#6B7280] hover:text-[#374151]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReward} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Reward Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. ₦1,000 Airtime or Grocery Voucher"
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm bg-white focus:outline-none"
                >
                  <option value="Airtime">Airtime</option>
                  <option value="Vouchers">Vouchers</option>
                  <option value="Discounts">Discounts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Eco-Points Required</label>
                <input
                  type="number"
                  min="10"
                  required
                  value={newPoints}
                  onChange={(e) => setNewPoints(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Stock Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-sm bg-[#0D631B] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15]"
                >
                  Create Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}