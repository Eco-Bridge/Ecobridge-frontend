import { useState, useEffect } from "react";
import { Gift, Coins, CreditCard, Search, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import TransactionDetailsModal from "../components/Transactiondetailsmodal";
import { rewardsService } from "../services";
import { toNumber } from "../utils/formatters";

const STATUS_STYLES = {
  Completed: { bg: "#E7F7EC", text: "#0D631B", icon: CheckCircle2, label: "Completed" },
  Pending: { bg: "#FEF3C7", text: "#B45309", icon: Clock, label: "Pending" },
  Expired: { bg: "#FEE2E2", text: "#DC2626", icon: XCircle, label: "Expired" },
};

function normalizeStatus(status) {
  const normalized = String(status || "COMPLETED").toUpperCase();
  if (normalized === "PENDING") return "Pending";
  if (normalized === "EXPIRED") return "Expired";
  return "Completed";
}

export default function RewardHistory() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadVouchers() {
      setLoading(true);
      setError(null);
      try {
        const params = statusFilter === "ALL" ? {} : { status: statusFilter };
        const response = await rewardsService.getMyVouchers(params);
        const list = Array.isArray(response) ? response : response?.vouchers || response?.redemptions || response?.data?.vouchers || response?.data?.redemptions || response?.data || [];
        if (isMounted) {
          setVouchers(list.map((voucher, index) => {
            const rewardName = voucher.reward?.title || voucher.reward?.name || voucher.name || "Eco Reward";
            const code = voucher.voucherCode || voucher.code || null;
            return {
              id: voucher.id || voucher._id || `redemption-${index}`,
              badge: rewardName[0],
              color: rewardName.toLowerCase().includes("mtn") ? "#F59E0B" : rewardName.toLowerCase().includes("shoprite") ? "#EF4444" : "#0D631B",
              name: rewardName,
              status: normalizeStatus(voucher.status),
              date: voucher.createdAt ? new Date(voucher.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : voucher.date || "Unknown date",
              code,
              copy: Boolean(code),
              points: toNumber(voucher.pointsUsed ?? voucher.points ?? voucher.reward?.pointsRequired),
              previousBalance: toNumber(voucher.previousBalance ?? voucher.balanceBefore ?? voucher.previousPoints),
              remainingBalance: toNumber(voucher.remainingBalance ?? voucher.balanceAfter ?? voucher.remainingPoints),
              phone: voucher.phone || null,
              transactionId: voucher.transactionId || voucher.reference || voucher.id || `redemption-${index + 1}`,
              value: toNumber(voucher.value ?? voucher.reward?.value),
            };
          }));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load reward history.");
          setVouchers([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadVouchers();
    return () => { isMounted = false; };
  }, [statusFilter]);

  const filtered = vouchers.filter((voucher) => voucher.name.toLowerCase().includes(search.toLowerCase()) || (voucher.code && voucher.code.toLowerCase().includes(search.toLowerCase())) || (voucher.transactionId && voucher.transactionId.toLowerCase().includes(search.toLowerCase())));
  const totalPointsSpent = vouchers.reduce((total, voucher) => total + voucher.points, 0);
  const totalValue = vouchers.reduce((total, voucher) => total + voucher.value, 0);
  const stats = [
    { icon: Gift, label: "Total Redeemed", value: `${vouchers.length} Rewards` },
    { icon: Coins, label: "Total Points Spent", value: `${totalPointsSpent.toLocaleString()} pts` },
    { icon: CreditCard, label: "Total Value", value: `₦${totalValue.toLocaleString()}` },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-[#1A1A2E]">Reward History</h1>
      <p className="text-sm text-[#6B7280]">Track all your redeemed rewards and voucher codes.</p>
      {error && <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
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
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-md flex-1 min-w-[240px]"><Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search rewards or voucher codes..." className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]" /></div>
        <div className="flex items-center gap-2">{["ALL", "ACTIVE", "USED", "EXPIRED"].map((status) => <button key={status} onClick={() => setStatusFilter(status)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${statusFilter === status ? "bg-[#0D631B] text-white border-[#0D631B] font-medium" : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-gray-50"}`}>{status}</button>)}</div>
      </div>
      {loading ? <div className="py-16 flex flex-col justify-center items-center text-slate-400 gap-3"><Loader2 className="w-8 h-8 animate-spin text-[#0D631B]" /><p className="text-sm font-medium">Loading redemption history...</p></div> : <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((voucher) => { const statusStyle = STATUS_STYLES[voucher.status] || STATUS_STYLES.Completed; const StatusIcon = statusStyle.icon; const isExpired = voucher.status === "Expired"; return <div key={voucher.id} onClick={() => setSelectedTransaction(voucher)} className="bg-white border border-[#E5E7EB] rounded-xl p-4 cursor-pointer hover:border-[#0D631B]/40 shadow-xs hover:shadow-sm transition-all"><div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2"><span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: voucher.color }}>{voucher.badge}</span><div><p className="text-sm font-semibold text-[#1A1A2E]">{voucher.name}</p><p className="text-xs text-[#0D631B] font-medium">-{voucher.points} pts</p></div></div><span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}><StatusIcon className="w-3 h-3" /> {statusStyle.label}</span></div><p className="mt-2 text-xs text-[#6B7280]">Redeemed: {voucher.date}</p>{voucher.code && <div className={`mt-3 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-mono ${isExpired ? "bg-[#FEE2E2] text-[#DC2626] line-through" : "bg-[#E7F7EC] text-[#0D631B]"}`}><span>{voucher.code}</span>{voucher.copy && !isExpired && <button onClick={(event) => { event.stopPropagation(); navigator.clipboard.writeText(voucher.code); }} className="font-sans font-semibold text-[11px] underline ml-2 hover:opacity-80">Copy</button>}</div>}<div className="mt-3 flex items-center justify-between text-[11px] text-[#9CA3AF] border-t border-[#F3F4F6] pt-2"><span>ID: {voucher.transactionId}</span><span className="text-[#0D631B] font-medium">View Details →</span></div></div>; })}
        {filtered.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-[#E5E7EB] rounded-xl p-8"><Gift className="w-8 h-8 mx-auto text-slate-300 mb-2" /><p className="text-sm font-medium text-slate-600">No redemptions found.</p><p className="text-xs text-slate-400 mt-1">Start redeeming rewards using your accumulated eco-points!</p></div>}
      </div>}
      {selectedTransaction && <TransactionDetailsModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </DashboardLayout>
  );
}