import { useState, useEffect } from "react";
import { Search, Plus, Tag, CheckCircle2, Gift, Smartphone, ShoppingBasket, Pencil, Trash2, X, Loader2 } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { rewardsService } from "../../services";

const REWARD_CATEGORIES = [
  { value: "AIRTIME", label: "Airtime" },
  { value: "VOUCHER", label: "Voucher" },
  { value: "CASH", label: "Cash" },
  { value: "MERCHANDISE", label: "Merchandise" },
  { value: "DISCOUNT", label: "Discount" },
];

function normalizeCategory(category) {
  const value = String(category || "").toUpperCase();
  return REWARD_CATEGORIES.some((item) => item.value === value) ? value : "VOUCHER";
}

function getCategoryLabel(category) {
  return REWARD_CATEGORIES.find((item) => item.value === normalizeCategory(category))?.label || "Voucher";
}

function getErrorMessage(error, fallback) {
  return error?.data?.message || error?.data?.error || error?.message || fallback;
}

function formatReward(reward, index = 0) {
  const category = normalizeCategory(reward.category);
  const stockValue = Number(reward.stock);
  const hasStock = Number.isFinite(stockValue);
  const lowStock = hasStock && stockValue <= 5 && stockValue > 0;

  return {
    id: reward.id || `rew-${index}`,
    name: reward.title || reward.name || "Untitled Reward",
    category,
    categoryLabel: getCategoryLabel(category),
    status: reward.isActive === false ? "Inactive" : lowStock ? "Low Stock" : "Active",
    points: Number(reward.pointsRequired ?? reward.points ?? 0),
    stockValue: hasStock ? stockValue : 0,
    stock: hasStock ? (stockValue > 0 ? `${stockValue} left` : "Out of stock") : "Unlimited",
    lowStock,
    icon: category === "AIRTIME" ? Smartphone : ShoppingBasket,
    iconBg: category === "AIRTIME" ? "#FEF3C7" : "#EFECFF",
    iconColor: category === "AIRTIME" ? "#B45309" : "#7C3AED",
  };
}

export default function ManageRewards() {
  const [search, setSearch] = useState("");
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("AIRTIME");
  const [newPoints, setNewPoints] = useState("");
  const [newStock, setNewStock] = useState("");
  const [summary, setSummary] = useState({ totalRewardsGivenOut: 0, activeCatalog: 0, redeemedThis: 0 });
  const [editingReward, setEditingReward] = useState(null);
  const [savingReward, setSavingReward] = useState(false);
  const [deletingRewardId, setDeletingRewardId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function loadRewards() {
      try {
        const data = await rewardsService.getRewards(search ? { search } : {});
        const list = Array.isArray(data.rewards) ? data.rewards : [];
        setSummary({
          totalRewardsGivenOut: data.totalRewardsGivenOut,
          activeCatalog: data.activeCatalog,
          redeemedThis: data.redeemedThis,
        });
        const formatted = list.map(formatReward);
        setRewards(formatted);
      } catch (err) {
        setRewards([]);
        setSummary({ totalRewardsGivenOut: 0, activeCatalog: 0, redeemedThis: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, [search]);

  const handleCreateReward = async (e) => {
    e.preventDefault();
    if (savingReward) return;
    setActionError("");
    setSavingReward(true);
    const payload = {
      title: newTitle,
      category: normalizeCategory(newCategory),
      pointsRequired: parseInt(newPoints, 10),
      stock: parseInt(newStock, 10) || 100,
      partnerName: newCategory === "Airtime" ? "Telecom Partner" : "Retail Partner",
    };

    try {
      await rewardsService.createReward(payload);
      setShowAddModal(false);
      setNewTitle("");
      setNewPoints("");
      setNewStock("");
      setLoading(true);
      const data = await rewardsService.getRewards(search ? { search } : {});
      setSummary({
        totalRewardsGivenOut: data.totalRewardsGivenOut,
        activeCatalog: data.activeCatalog,
        redeemedThis: data.redeemedThis,
      });
      setRewards((data.rewards || []).map(formatReward));
    } catch (err) {
      setActionError(getErrorMessage(err, "Unable to create this reward. Please check the details and try again."));
    } finally {
      setSavingReward(false);
      setLoading(false);
    }
  };

  const openEditModal = (reward) => {
    setEditingReward(reward);
    setNewTitle(reward.name);
    setNewCategory(normalizeCategory(reward.category));
    setNewPoints(String(reward.points));
    setNewStock(String(reward.stockValue));
  };

  const handleUpdateReward = async (e) => {
    e.preventDefault();
    if (!editingReward || savingReward) return;
    setActionError("");
    setSavingReward(true);

    try {
      const payload = {
        title: newTitle,
        category: normalizeCategory(newCategory),
        pointsRequired: parseInt(newPoints, 10),
        stock: parseInt(newStock, 10) || 0,
      };
      await rewardsService.updateReward(editingReward.id, payload);
      setRewards((current) => current.map((reward) => (
        reward.id === editingReward.id
          ? formatReward({ ...reward, ...payload, id: editingReward.id })
          : reward
      )));
      setEditingReward(null);
      setNewTitle("");
      setNewPoints("");
      setNewStock("");
    } catch (err) {
      setActionError(getErrorMessage(err, "Unable to update this reward. Please try again."));
    } finally {
      setSavingReward(false);
    }
  };

  const handleDelete = async (id) => {
    if (deletingRewardId) return;
    setActionError("");
    setDeletingRewardId(id);
    try {
      await rewardsService.deleteReward(id);
      setLoading(true);
      const data = await rewardsService.getRewards(search ? { search } : {});
      setSummary({
        totalRewardsGivenOut: data.totalRewardsGivenOut,
        activeCatalog: data.activeCatalog,
        redeemedThis: data.redeemedThis,
      });
      setRewards((data.rewards || []).map(formatReward));
    } catch (err) {
      setActionError(getErrorMessage(err, "Unable to remove this reward. Please try again."));
    } finally {
      setDeletingRewardId(null);
      setLoading(false);
    }
  };

  const filtered = rewards;

  const stats = [
    { icon: Tag, label: "TOTAL REWARDS GIVEN OUT", value: summary.totalRewardsGivenOut.toLocaleString(), color: "#3B82F6", bg: "#DBEAFE" },
    { icon: CheckCircle2, label: "ACTIVE CATALOG", value: summary.activeCatalog.toLocaleString(), color: "#16A34A", bg: "#DCFCE7" },
    { icon: Gift, label: "REDEEMED THIS MONTH", value: summary.redeemedThis.toLocaleString(), color: "#7C3AED", bg: "#EFECFF" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 font-sans">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Reward Inventory & Catalog</h1>
          <p className="text-sm text-[#6B7280]">Manage, add, and track redeemable citizen rewards.</p>
        </div>
        <button
          onClick={() => {
            setActionError("");
            setEditingReward(null);
            setNewCategory("AIRTIME");
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Reward
        </button>
      </div>

      {actionError && !showAddModal && !editingReward && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </div>
      )}

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
                  <p className="text-xs text-[#6B7280]">{reward.categoryLabel}</p>

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
                  <button
                    onClick={() => openEditModal(reward)}
                    disabled={Boolean(deletingRewardId) || savingReward}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-[#E5E7EB] text-[#374151] py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    disabled={Boolean(deletingRewardId) || savingReward}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-[#FECACA] text-[#DC2626] py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deletingRewardId === reward.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    {deletingRewardId === reward.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Reward Modal */}
      {(showAddModal || editingReward) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1A1A2E]">
                {editingReward ? "Edit Reward" : "Add New Reward to Catalog"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingReward(null);
                }}
                disabled={savingReward}
                className="text-[#6B7280] hover:text-[#374151] disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {actionError}
              </div>
            )}

            <form onSubmit={editingReward ? handleUpdateReward : handleCreateReward} className="mt-4 space-y-3.5">
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
                  {REWARD_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
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
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingReward(null);
                  }}
                  disabled={savingReward}
                  className="text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReward}
                  className="flex items-center gap-1.5 text-sm bg-[#0D631B] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingReward && <Loader2 className="w-4 h-4 animate-spin" />}
                  {savingReward ? (editingReward ? "Saving..." : "Creating...") : (editingReward ? "Save Changes" : "Create Reward")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}