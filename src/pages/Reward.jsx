import { useState } from "react";
import { DollarSign, Zap, Lock } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import RedeemConfirmModal from "../components/Redeemconfirmmodal";
import ProcessingModal from "../components/Processingmodal";
import VoucherResultModal from "../components/VoucherResultModal";
import RedemptionToast from "../components/Redemptiontoast";
import CouponSavedToast from "../components/Couponsavetoast";
import MTN500 from "../assets/rewards/MTN 500.svg";
import Airtel200 from "../assets/rewards/Airtel200.svg";
import Shoprite from "../assets/rewards/Shoprite.svg";
import MTN100 from "../assets/rewards/MTN 100.svg";
import Discount from "../assets/rewards/Discount.svg";

const CATEGORIES = ["All Rewards", "Airtime", "Vouchers", "Discounts"];

const REWARDS = [
  { name: "MTN Airtime N500", points: 500, category: "Airtime", badge: "N500",  image: MTN500 },
  { name: "Airtel N200", points: 200, category: "Airtime", badge: "N200", image: Airtel200 },
  { name: "Shoprite N5,000", points: 900, category: "Vouchers", badge: "N5,000", image: Shoprite },
  { name: "MTN Airtime N100", points: 100, category: "Airtime", badge: "N100", image: MTN100 },
  { name: "Discount Voucher", points: 300, category: "Discounts", badge: "Voucher", image: Discount },
  { name: "Shoprite N2,000", points: 2000, category: "Vouchers", badge: "N2,000", color: "#9CA3AF", locked: true },
];

export default function Rewards() {
  const [activeCategory, setActiveCategory] = useState("All Rewards");
  const [activeReward, setActiveReward] = useState(null);
  const [step, setStep] = useState(null); // "confirm" | "processing" | null
  const [toastStatus, setToastStatus] = useState(null);
  const [couponSaved, setCouponSaved] = useState(false);
  const [redeemedPhone, setRedeemedPhone] = useState("");
  const availablePoints = 1250;

  const openRedeem = (reward) => {
    setActiveReward(reward);
    setStep("confirm");
  };

  const handleConfirm = (phone) => {
    console.log("Redeeming", activeReward.name, "to", phone);
    setStep("processing");
    // TODO: replace this timeout with a real API call to your Node.js backend
    setTimeout(() => {
      if (activeReward.category === "Airtime") {
        // Airtime has no persistent result screen — just confirms and closes
        setRedeemedPhone(phone);
        setStep(null);
        setToastStatus("processing");
        //TODO: replace with a real API call- flip to success once resolved
        setTimeout(() => setToastStatus("success"), 2000);
      } else {
        // Vouchers/Discounts continue on to the QR code result card
        setStep("processing");
        setTimeout(() => setStep("voucher-result"), 2500);
      }
    }, 2500);
  };

  const closeToast = () => {
    setToastStatus(null);
    setActiveReward(null);
  }

  const closeModal = () => {
    setStep(null);
    setActiveReward(null);
  };

  const visibleRewards =
    activeCategory === "All Rewards"
      ? REWARDS
      : REWARDS.filter((r) => r.category === activeCategory);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-[#1A1A2E]">Rewards Catalog</h1>
      <p className="text-sm text-[#6B7280]">Redeem your eco-points for real rewards</p>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#E7F7EC] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#0D631B]" />
            </span>
            <span className="text-xs text-[#6B7280]">Your Points Balance</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-[#1A1A2E]">1,250 Points</p>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>Next Reward Milestone</span>
              <span>1500 pts</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div className="h-full bg-[#0D631B]" style={{ width: "83%" }} />
            </div>
            <p className="mt-1 text-xs text-[#6B7280] text-right">250 pts to go</p>
          </div>
        </div>

        <div className="bg-[#E7F7EC] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#0D631B] flex items-center gap-1">
            <Zap className="w-4 h-4" /> How to Earn More
          </p>
          <p className="mt-2 text-xs text-[#374151]">
            Bring more recyclable waste. Metal earns the highest points per
            kilogram!
          </p>
          <span className="mt-3 inline-block text-xs font-semibold text-[#0D631B] bg-white px-2 py-1 rounded-full">
            ↑ Metal +60pts/kg
          </span>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-4 py-2 rounded-full transition-colors ${
              activeCategory === cat
                ? "bg-[#0D631B] text-white"
                : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reward cards */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleRewards.map((reward) => (
          <div
            key={reward.name}
            className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm flex flex-col"
          >
            {/* Top half: Image & Locked Overlays */}
            <div className="relative h-32 w-full bg-slate-50">
              <img
                src={reward.image}
                alt={reward.name}
                className={`w-full h-full object-cover transition-opacity ${
                  reward.locked ? "opacity-30" : "opacity-100"
                }`}
              />
              
              {/* Figma's Locked State Styling */}
              {reward.locked && (
                <>
                  {/* Center Lock Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  {/* Floating 'Need X more points' badge */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-xs font-medium text-gray-500 whitespace-nowrap z-10">
                    Need {reward.points - 1250} more points
                  </div>
                </>
              )}
            </div>

            {/* Bottom half: Details */}
            <div className="p-4 pt-5 flex-1 flex flex-col justify-between">
              <p className={`font-semibold text-[15px] ${reward.locked ? "text-gray-300" : "text-[#1A1A2E]"}`}>
                {reward.name}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                {/* Green Points Pill */}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    reward.locked
                      ? "bg-gray-50 text-gray-300"
                      : "bg-[#E7F7EC] text-[#0D631B]"
                  }`}
                >
                  {reward.points} pts
                </span>

                {/* Redeem Button / Locked Text */}
                {reward.locked ? (
                  <span className="text-sm font-medium text-gray-300">Locked</span>
                ) : (
                  <button
                    onClick={() => openRedeem(reward)}
                    className="text-sm font-medium text-[#0D631B] hover:text-[#0a4f15] transition-colors cursor-pointer"
                  >
                    Redeem
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {step === "confirm" && (
        <RedeemConfirmModal
          reward={activeReward}
          availablePoints={availablePoints}
          onCancel={closeModal}
          onConfirm={handleConfirm}
        />
      )}

      {step === "processing" && <ProcessingModal reward={activeReward} />}

      {step === "voucher-result" && (
        <VoucherResultModal
          reward={activeReward}
          voucherCode={`ECO-${activeReward.name.slice(0, 3).toUpperCase()}-${activeReward.points}X`}
          expiryDate="30 Sep 2026"
          onClose={closeModal}
          onDownloaded={() => {
            setStep(null);
            setCouponSaved(true);
          }}
        />
      )}

      {toastStatus && (
        <RedemptionToast
          status={toastStatus}
          reward={activeReward}
          phone={redeemedPhone}
          onClose={closeToast}
        />  
      )}

      {couponSaved && (
        <CouponSavedToast
          reward={activeReward}
          onClose={() => {
            setCouponSaved(false);
            setActiveReward(null);
          }}
          onViewReward={() => (window.location.href = "/reward-history")}
        />  
      )}
      
    </DashboardLayout>
  );
}