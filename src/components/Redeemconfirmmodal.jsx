import { useState } from "react";
import { X, Smartphone, Ticket } from "lucide-react";

export default function RedeemConfirmModal({ reward, availablePoints, onCancel, onConfirm }) {
  const [phone, setPhone] = useState("");
  const remaining = availablePoints - reward.points;
  const isAirtime = reward.category === "Airtime";

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(isAirtime ? phone : null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1A1A2E]">
            {isAirtime ? "Redeem Airtime" : "Redeem Coupon"}
          </h2>
          <button onClick={onCancel} aria-label="Close" className="text-[#6B7280] hover:text-[#374151]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 bg-[#E7F7EC] rounded-lg p-3">
          <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
            {isAirtime ? (
              <Smartphone className="w-4 h-4 text-[#0D631B]" />
            ) : (
              <Ticket className="w-4 h-4 text-[#0D631B]" />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold text-[#1A1A2E]">{reward.name}</p>
            <p className="text-xs text-[#6B7280]">{reward.points.toLocaleString()} Points</p>
          </div>
        </div>

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Available Points</span>
            <span className="text-[#1A1A2E]">{availablePoints.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Points to Deduct</span>
            <span className="text-[#DC2626]">-{reward.points.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold">
            <span className="text-[#1A1A2E]">Remaining Balance</span>
            <span className="text-[#0D631B]">{remaining.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {isAirtime && (
            <>
              <label className="block text-xs font-medium text-[#374151] mb-1">
                Phone number
              </label>
              <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden focus-within:ring-2 focus-within:ring-[#0D631B]/40">
                <span className="flex items-center px-3 bg-gray-50 text-sm text-[#374151] font-medium">
                  +234
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 801 234 5678"
                  required
                  className="w-full px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                The airtime will be sent to this number.
              </p>
            </>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm bg-[#0D631B] text-white px-4 py-2 rounded-lg hover:bg-[#0a4f15]"
            >
              Confirm Redemption
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}