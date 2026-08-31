import { CheckCircle2, X } from "lucide-react";

export default function CouponSavedToast({ reward, onClose, onViewReward }) {
  return (
    <div className="fixed top-6 right-6 z-50 w-80 bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-full bg-[#E7F7EC] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#0D631B]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#1A1A2E]">Coupon saved</p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Your {reward.name} coupon has been saved to My Rewards.
            </p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-[#9CA3AF] hover:text-[#374151] shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onViewReward}
        className="mt-3 ml-11 text-xs font-medium bg-[#0D631B] text-white px-3 py-1.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
      >
        View Reward
      </button>
    </div>
  );
}