import { useState, useEffect } from "react";
import { DollarSign, Zap, Lock, Loader2, AlertCircle } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import RedeemConfirmModal from "../components/Redeemconfirmmodal";
import ProcessingModal from "../components/Processingmodal";
import VoucherResultModal from "../components/VoucherResultModal";
import RedemptionToast from "../components/Redemptiontoast";
import CouponSavedToast from "../components/Couponsavetoast";
import { useAuth } from "../context/AuthContext";
import { rewardsService } from "../services";
import { toNumber } from "../utils/formatters";

import MTN500 from "../assets/rewards/MTN 500.svg";
import Airtel200 from "../assets/rewards/Airtel200.svg";
import Shoprite from "../assets/rewards/Shoprite.svg";
import MTN100 from "../assets/rewards/MTN 100.svg";
import Discount from "../assets/rewards/Discount.svg";

const CATEGORIES = ["All Rewards", "Airtime", "Vouchers", "Discounts"];

export default function Rewards() {
  const { user, refreshUserData } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All Rewards");
  const [activeReward, setActiveReward] = useState(null);
  const [step, setStep] = useState(null); // "confirm" | "processing" | "voucher-result" | null
  const [toastStatus, setToastStatus] = useState(null);
  const [couponSaved, setCouponSaved] = useState(false);
  const [redeemedPhone, setRedeemedPhone] = useState("");
  const [generatedVoucher, setGeneratedVoucher] = useState(null);
  const [rewardsList, setRewardsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const availablePoints = toNumber(user?.points ?? user?.pointsBalance);

  useEffect(() => {
    let isMounted = true;

    async function fetchRewards() {
      setLoading(true);
      setError(null);
      try {
        const response = await rewardsService.getRewards();
        const list = Array.isArray(response)
          ? response
          : response?.rewards || response?.data?.rewards || response?.data || [];

        if (isMounted) {
          // Format incoming backend rewards
          const formatted = list.map((item) => {
            const pts = toNumber(item.pointsRequired ?? item.points);
            const itemName = item.title || item.name || "Reward";
            return {
              id: item.id || item._id || `rew-${itemName}`,
              name: itemName,
              points: pts,
              category: item.category || "Vouchers",
              badge: item.badge || `₦${pts}`,
              image: item.imageUrl || item.image || (itemName.includes("MTN") ? MTN500 : itemName.includes("Airtel") ? Airtel200 : itemName.includes("Shoprite") ? Shoprite : itemName.includes("Discount") ? Discount : null),
              locked: pts > availablePoints,
              stock: item.stock,
            };
          });
          setRewardsList(formatted);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load rewards.");
          setRewardsList([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRewards();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setRewardsList((currentRewards) =>
      currentRewards.map((reward) => ({
        ...reward,
        locked: reward.points > availablePoints,
      }))
    );
  }, [availablePoints]);

  const openRedeem = (reward) => {
    setActiveReward(reward);
    setStep("confirm");
  };

  const handleConfirm = async (phone) => {
    setStep("processing");
    try {
      const response = await rewardsService.redeemReward({
        rewardId: activeReward.id,
        phone,
      });

      // Update user points in global context
      await refreshUserData();

      const voucherCode = response.voucherCode || response.code || `ECO-${activeReward.name.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const expiryDate = response.expiryDate || "30 Sep 2026";

      setGeneratedVoucher({ voucherCode, expiryDate });

      if (activeReward.category === "Airtime") {
        setRedeemedPhone(phone);
        setStep(null);
        setToastStatus("success");
      } else {
        setStep("voucher-result");
      }
    } catch (err) {
      console.warn("Redeem fallback:", err.message);
      setStep(null);
      setError(err.message || "Unable to redeem this reward.");
    }
  };

  const closeToast = () => {
    setToastStatus(null);
    setActiveReward(null);
  };

  const closeModal = () => {
    setStep(null);
    setActiveReward(null);
  };

  const visibleRewards =
    activeCategory === "All Rewards"
      ? rewardsList
      : rewardsList.filter((r) => r.category.toLowerCase() === activeCategory.toLowerCase());
  const nextReward = rewardsList
    .filter((reward) => reward.points > availablePoints)
    .sort((first, second) => first.points - second.points)[0];
  const nextMilestone = nextReward?.points || availablePoints;

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-[#1A1A2E]">Rewards Catalog</h1>
      <p className="text-sm text-[#6B7280]">Redeem your eco-points for real rewards</p>

      {error && (
        <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#E7F7EC] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#0D631B]" />
            </span>
            <span className="text-xs text-[#6B7280]">Your Points Balance</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-[#1A1A2E]">{availablePoints.toLocaleString()} Points</p>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>Next Reward Milestone</span>
              <span>{nextReward ? `${nextMilestone.toLocaleString()} pts` : "No upcoming reward"}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div
                className="h-full bg-[#0D631B] rounded-full transition-all"
                style={{ width: `${nextReward ? Math.min(100, Math.round((availablePoints / nextMilestone) * 100)) : 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-[#6B7280] text-right">
              {nextReward ? `${nextMilestone - availablePoints} pts to go` : "You can redeem available rewards"}
            </p>
          </div>
        </div>

        <div className="bg-[#E7F7EC] rounded-xl p-5 border border-[#CDEED3]">
          <p className="text-sm font-semibold text-[#0D631B] flex items-center gap-1">
            <Zap className="w-4 h-4" /> How to Earn More
          </p>
          <p className="mt-2 text-xs text-[#374151] leading-relaxed">
            Bring sorted recyclable waste to any collection hub. Electronics (25pts/kg) and Metal (15pts/kg) earn top points!
          </p>
          <span className="mt-3 inline-block text-xs font-semibold text-[#0D631B] bg-white px-2.5 py-1 rounded-full shadow-xs">
            ↑ Metal +15pts/kg
          </span>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-4 py-2 rounded-full transition-colors cursor-pointer ${
              activeCategory === cat
                ? "bg-[#0D631B] text-white font-medium"
                : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reward cards */}
      {loading ? (
        <div className="py-16 flex flex-col justify-center items-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D631B]" />
          <p className="text-sm font-medium">Loading active rewards catalog...</p>
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleRewards.map((reward) => (
            <div
              key={reward.id || reward.name}
              className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs flex flex-col hover:shadow-sm transition-shadow"
            >
              {/* Top half: Image & Locked Overlays */}
              <div className="relative h-32 w-full bg-slate-50 flex items-center justify-center overflow-hidden">
                {reward.image ? (
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className={`w-full h-full object-cover transition-opacity ${
                      reward.locked ? "opacity-30" : "opacity-100"
                    }`}
                  />
                ) : (
                  <span className="text-2xl font-bold text-emerald-800">{reward.badge || reward.name[0]}</span>
                )}
                
                {/* Locked State Styling */}
                {reward.locked && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10">
                      <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[11px] font-medium text-gray-500 whitespace-nowrap z-10">
                      Need {reward.points - availablePoints} more points
                    </div>
                  </>
                )}
              </div>

              {/* Bottom half: Details */}
              <div className="p-4 pt-5 flex-1 flex flex-col justify-between">
                <p className={`font-semibold text-[15px] ${reward.locked ? "text-gray-400" : "text-[#1A1A2E]"}`}>
                  {reward.name}
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      reward.locked
                        ? "bg-gray-50 text-gray-400"
                        : "bg-[#E7F7EC] text-[#0D631B]"
                    }`}
                  >
                    {reward.points} pts
                  </span>

                  {reward.locked ? (
                    <span className="text-sm font-medium text-gray-400">Locked</span>
                  ) : (
                    <button
                      onClick={() => openRedeem(reward)}
                      className="text-sm font-semibold text-[#0D631B] hover:text-[#0a4f15] transition-colors cursor-pointer"
                    >
                      Redeem
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === "confirm" && (
        <RedeemConfirmModal
          reward={activeReward}
          availablePoints={availablePoints}
          onCancel={closeModal}
          onConfirm={handleConfirm}
        />
      )}

      {step === "processing" && <ProcessingModal reward={activeReward} />}

      {step === "voucher-result" && generatedVoucher && (
        <VoucherResultModal
          reward={activeReward}
          voucherCode={generatedVoucher.voucherCode}
          expiryDate={generatedVoucher.expiryDate}
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