import { Smartphone, CheckCircle2, Clock, XCircle } from "lucide-react";
import { maskPhone } from "../utils/formatters";

const STATUS_META = {
  Completed: { label: "Successful", bg: "#E7F7EC", text: "#0D631B", icon: CheckCircle2 },
  Pending: { label: "Pending", bg: "#FEF3C7", text: "#B45309", icon: Clock },
  Expired: { label: "Expired", bg: "#FEE2E2", text: "#DC2626", icon: XCircle },
};

export default function TransactionDetailsModal({ transaction, onClose }) {
  const statusMeta = STATUS_META[transaction.status];
  const StatusIcon = statusMeta.icon;

  const rows = [
    {
      label: "Status",
      value: (
        <span
          className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: statusMeta.bg, color: statusMeta.text }}
        >
          <StatusIcon className="w-3 h-3" /> {statusMeta.label}
        </span>
      ),
    },
    { label: "Reward", value: transaction.name, bold: true },
    { label: "Points Used", value: `- ${transaction.points} points`, red: true, bold: true },
    { label: "Previous Balance", value: `${transaction.previousBalance.toLocaleString()} points` },
    { label: "Remaining Balance", value: `${transaction.remainingBalance.toLocaleString()} points`, bold: true },
    ...(transaction.phone
      ? [{ label: "Phone Number", value: maskPhone(transaction.phone) }]
      : []),
    { label: "Date", value: transaction.date.replace("Redeemed ", "") },
    {
      label: "Transaction ID",
      value: (
        <span className="text-xs font-mono bg-[#EFECFF] text-[#4338CA] px-2 py-0.5 rounded">
          {transaction.transactionId}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6">
        <div className="text-center">
          <span className="mx-auto w-12 h-12 rounded-full bg-[#E7F7EC] flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-[#0D631B]" />
          </span>
          <h2 className="mt-3 text-lg font-bold text-[#1A1A2E]">{transaction.name}</h2>
          <p className="text-xs text-[#6B7280]">Transaction Details</p>
        </div>

        <div className="mt-5 divide-y divide-[#F3F4F6]">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-[#6B7280]">{row.label}</span>
              <span
                className={`${row.bold ? "font-semibold" : ""} ${
                  row.red ? "text-[#DC2626]" : "text-[#1A1A2E]"
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full bg-[#0D631B] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
        >
          Back to Rewards
        </button>
      </div>
    </div>
  );
}