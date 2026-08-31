import { useState } from "react";
import { Gift, Coins, CreditCard, Search, CheckCircle2, Clock, XCircle } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import TransactionDetailsModal from "../components/Transactiondetailsmodal";

const STATS = [
  { icon: Gift, label: "Total Redeemed", value: "5 Rewards" },
  { icon: Coins, label: "Total Points Spent", value: "1,900 pts" },
  { icon: CreditCard, label: "Total Value Earned", value: "₦2,200" },
];

const STATUS_STYLES = {
  Completed: { bg: "#E7F7EC", text: "#0D631B", icon: CheckCircle2 },
  Pending: { bg: "#FEF3C7", text: "#B45309", icon: Clock },
  Expired: { bg: "#FEE2E2", text: "#DC2626", icon: XCircle },
};

const REDEMPTIONS = [
  {
    badge: "M",
    color: "#F59E0B",
    name: "MTN Airtime N500",
    status: "Completed",
    date: "Redeemed Jan 10, 2025",
    code: "ECO-MTN-XX91P",
    note: "Code Used",
    points: 500,
    previousBalance: 1050,
    remainingBalance: 550,
    phone: "08031234123",
    transactionId: "EB-XXXXXX",
  },
  {
    badge: "S",
    color: "#EF4444",
    name: "Shoprite Voucher",
    value: "N1,000",
    status: "Completed",
    date: "Redeemed Jan 05, 2025",
    code: "ECO-SHP-MN82K",
    copy: true,
    points: 900,
    previousBalance: 1950,
    remainingBalance: 1050,
    transactionId: "EB-D4E5F6",
  },
  {
    badge: "A",
    color: "#3B82F6",
    name: "Airtel Airtime",
    value: "N200",
    status: "Completed",
    date: "Redeemed Dec 25, 2024",
    note: "Direct Top-up",
    id: "TRX-89219A",
    points: 200,
    previousBalance: 1450,
    remainingBalance: 1250,
    phone: "08129876543",
    transactionId: "EB-G7H8I9",
  },
  {
    badge: "M",
    color: "#F59E0B",
    name: "MTN Airtime N500",
    status: "Pending",
    date: "Redeemed Jan 10, 2025",
    processing: "Processing... This usually takes up to 24 hours. We'll notify you when ready.",
    points: 500,
    previousBalance: 1250,
    remainingBalance: 750,
    phone: "08031234123",
    transactionId: "EB-J1K2L3",
  },
  {
    badge: null,
    name: "Discount Voucher",
    value: "10%",
    status: "Expired",
    date: "Redeemed Nov 15, 2024",
    code: "ECO-DISC-10#",
    expiredNote: "Expired on Dec 15, 2024",
    points: 300,
    previousBalance: 1550,
    remainingBalance: 1250,
    transactionId: "EB-M4N5O6",
  },
];

export default function RewardHistory() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-[#1A1A2E]">Reward History</h1>
      <p className="text-sm text-[#6B7280]">
        Track all your redeemed rewards and voucher codes.
      </p>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Icon className="w-4 h-4 text-[#0D631B]" />
                {stat.label}
              </div>
              <p className="mt-2 text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search rewards or voucher codes..."
          className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
        />
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REDEMPTIONS.map((r) => {
          const statusStyle = STATUS_STYLES[r.status];
          const StatusIcon = statusStyle.icon;
          const isExpired = r.status === "Expired";

          return (
            <div
              key={r.name + r.date}
              onClick={() => setSelectedTransaction(r)}
              className="bg-white border border-[#E5E7EB] rounded-xl p-4 cursor-pointer hover:border-[#0D631B]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {r.badge && (
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: r.color }}
                    >
                      {r.badge}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">{r.name}</p>
                    {r.value && <p className="text-xs text-[#6B7280]">{r.value}</p>}
                  </div>
                </div>

                <span
                  className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                >
                  <StatusIcon className="w-3 h-3" /> {r.status}
                </span>
              </div>

              <p className="mt-2 text-xs text-[#6B7280]">{r.date}</p>

              {r.code && (
                <div
                  className={`mt-3 flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                    isExpired
                      ? "bg-[#FEE2E2] text-[#DC2626] line-through"
                      : "bg-[#E7F7EC] text-[#0D631B]"
                  }`}
                >
                  <span>{r.code}</span>
                  {r.copy && (
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium no-underline"
                    >
                      Copy
                    </button>
                  )}
                </div>
              )}

              {r.note && <p className="mt-2 text-xs text-[#6B7280]">{r.note}</p>}
              {r.id && <p className="mt-1 text-xs text-[#9CA3AF]">ID: {r.id}</p>}

              {r.processing && (
                <div className="mt-3 bg-[#FEF3C7] text-[#B45309] text-xs rounded-lg px-3 py-2">
                  {r.processing}
                </div>
              )}

              {r.expiredNote && (
                <p className="mt-2 text-xs text-[#DC2626]">{r.expiredNote}</p>
              )}
            </div>
          );
        })}
      </div>

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </DashboardLayout>
  );
}