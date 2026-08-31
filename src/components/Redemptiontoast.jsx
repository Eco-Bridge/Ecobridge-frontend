import { RefreshCw, CheckCircle2, X } from "lucide-react";
import { maskPhone } from "../utils/formatters";

const STATUS_STYLES = {
  processing: {
    icon: RefreshCw,
    iconBg: "#FFEDD5",
    iconColor: "#EA580C",
    border: "#EA580C",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
    border: "#16A34A",
  },
};

export default function RedemptionToast({ status, reward, phone, onClose }) {
  const style = STATUS_STYLES[status];
  const Icon = style.icon;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-xl shadow-lg border-l-4 p-4"
      style={{ borderLeftColor: style.border }}
    >
      <div className="flex items-start gap-3">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: style.iconBg }}
        >
          <Icon
            className={`w-4 h-4 ${status === "processing" ? "animate-spin" : ""}`}
            style={{ color: style.iconColor }}
          />
        </span>

        <div className="flex-1">
          <p className="text-sm font-semibold text-[#1A1A2E]">
            {status === "processing"
              ? `${reward.name} redemption processing`
              : "Airtime sent successfully"}
          </p>
          <p className="mt-1 text-xs text-[#6B7280]">
            {status === "processing"
              ? `Your ${reward.name} redemption is being processed.`
              : `${reward.name} has been sent to ${maskPhone(phone)}.`}
          </p>
          <a
            href="/reward-history"
            className="mt-2 inline-block text-xs font-medium hover:underline"
            style={{ color: style.iconColor }}
          >
            View Details
          </a>
        </div>

        <button onClick={onClose} aria-label="Close" className="text-[#9CA3AF] hover:text-[#374151]">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}