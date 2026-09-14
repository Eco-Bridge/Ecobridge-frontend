import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Coins,
  Recycle,
  Gift,
  MapPinned,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { wasteService, rewardsService, userService } from "../../services";

const MATERIAL_STYLES = {
  "PET Plastics": { bg: "#DBEAFE", text: "#3B82F6" },
  PLASTIC: { bg: "#DBEAFE", text: "#3B82F6" },
  Aluminum: { bg: "#DCFCE7", text: "#16A34A" },
  CANS_METAL: { bg: "#DCFCE7", text: "#16A34A" },
  Cardboard: { bg: "#FEF3C7", text: "#B45309" },
  PAPER_CARDBOARD: { bg: "#FEF3C7", text: "#B45309" },
  Glass: { bg: "#CCFBF1", text: "#0D9488" },
  GLASS: { bg: "#CCFBF1", text: "#0D9488" },
  E_WASTE: { bg: "#EFECFF", text: "#7C3AED" },
  OTHER: { bg: "#E7F7EC", text: "#0D631B" },
};

export default function UserDetail() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [recyclingHistory, setRecyclingHistory] = useState([]);
  const [rewardsRedeemed, setRewardsRedeemed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      try {
        let foundUser = await userService.getUserById(userId);

        const [wasteRes, redemptionsRes] = await Promise.allSettled([
          wasteService.getAllWaste({ userId, limit: 20 }),
          rewardsService.getAllRedemptions({ userId, limit: 20 }),
        ]);

        if (!isMounted) return;

        let wasteHistory = [];

        if (wasteRes.status === "fulfilled") {
          const wasteData = wasteRes.value;
          const records = Array.isArray(wasteData) ? wasteData : wasteData?.records ?? wasteData?.data ?? [];

          if (records.length > 0) {
            const firstRecord = records[0];
            // Build user object from the first record's citizen info
            const citizenInfo = firstRecord.citizen ?? firstRecord.user ?? {};
            foundUser = {
              id: citizenInfo.id ?? citizenInfo._id ?? userId,
              name: citizenInfo.name ?? citizenInfo.fullName ?? "Unknown User",
              email: citizenInfo.email ?? "",
              phone: citizenInfo.phone ?? citizenInfo.phoneNumber ?? "N/A",
              role: citizenInfo.role ?? "USER",
              points: citizenInfo.points ?? citizenInfo.pointsBalance ?? 0,
              totalRecycled: records.reduce((sum, r) => sum + (parseFloat(r.weightKg) || 0), 0).toFixed(1),
              centerVisits: records.length,
              joined: citizenInfo.createdAt
                ? new Date(citizenInfo.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                : "2025",
            };

            wasteHistory = records.map((r) => ({
              date: r.createdAt
                ? new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A",
              material: r.wasteType ?? r.type ?? "OTHER",
              weight: `${r.weightKg ?? r.weight ?? 0} kg`,
              points: `+${r.pointsAwarded ?? r.points ?? 0} pts`,
            }));
          }
        }

        // Extract redeemed rewards
        let rewardsList = [];
        if (redemptionsRes.status === "fulfilled") {
          const redemptionsData = redemptionsRes.value;
          const redemptions = Array.isArray(redemptionsData)
            ? redemptionsData
            : redemptionsData?.redemptions ?? redemptionsData?.data ?? [];

          rewardsList = redemptions.map((r) => ({
            date: r.redeemedAt ?? r.createdAt
              ? new Date(r.redeemedAt ?? r.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",
            reward: r.reward?.title ?? r.rewardName ?? r.name ?? "Unknown Reward",
            pointsUsed: `-${r.pointsUsed ?? r.points ?? 0} pts`,
          }));

          // If we still don't have user info, try to get it from redemptions
          if (!foundUser && redemptions.length > 0) {
            const firstRed = redemptions[0];
            const citizenInfo = firstRed.user ?? firstRed.citizen ?? {};
            foundUser = {
              id: citizenInfo.id ?? citizenInfo._id ?? userId,
              name: citizenInfo.name ?? citizenInfo.fullName ?? "Unknown User",
              email: citizenInfo.email ?? "",
              phone: citizenInfo.phone ?? "N/A",
              points: citizenInfo.points ?? 0,
              totalRecycled: "0",
              centerVisits: 0,
              rewardsRedeemedCount: redemptions.length,
              joined: "2025",
            };
          }
        }

        if (!foundUser && wasteHistory.length === 0 && rewardsList.length === 0) {
          setError("No live user data is available for this profile yet.");
        }

        if (isMounted) {
          setUser(foundUser ?? null);
          setRecyclingHistory(wasteHistory.length > 0 ? wasteHistory : foundUser?.recyclingHistory ?? []);
          setRewardsRedeemed(rewardsList.length > 0 ? rewardsList : foundUser?.rewardsRedeemed ?? []);
        }
      } catch (err) {
        console.error("UserDetail load error:", err);
        if (isMounted) {
          setUser(null);
          setRecyclingHistory([]);
          setRewardsRedeemed([]);
          setError("Could not load live user data from the backend.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-[#0D631B]" />
          <span className="text-sm">Loading user profile...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <p className="text-sm text-[#6B7280]">
          No user found with ID "{userId}".{" "}
          <Link to="/admin/manage-users" className="text-[#0D631B] hover:underline">
            Back to all users
          </Link>
        </p>
      </AdminLayout>
    );
  }

  // Build activity timeline from history
  const activity = [
    ...(recyclingHistory.slice(0, 2).map((r) => ({
      time: r.date,
      text: `Dropped off ${r.weight} of ${r.material.replace(/_/g, " ")} — earned ${r.points}`,
    }))),
    ...(rewardsRedeemed.slice(0, 2).map((r) => ({
      time: r.date,
      text: `Redeemed "${r.reward}" for ${r.pointsUsed}`,
    }))),
    { time: user.joined ? `Since ${user.joined}` : "Account created", text: "Joined EcoBridge platform" },
  ].filter(Boolean);

  const totalRecycled = parseFloat(user.totalRecycled ?? 0) || recyclingHistory.reduce((sum, r) => {
    const kg = parseFloat(r.weight) || 0;
    return sum + kg;
  }, 0);

  return (
    <AdminLayout>
      <Link
        to="/admin/manage-users"
        className="inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Users
      </Link>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-amber-700 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2 font-sans">
        <button className="text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          Edit Citizen Profile
        </button>
        <button className="text-sm border border-[#FECACA] text-[#DC2626] px-4 py-2 rounded-lg hover:bg-red-50 cursor-pointer">
          Disable Account
        </button>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-6 font-sans">
        {/* Profile card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-xs">
          <span className="mx-auto w-16 h-16 rounded-full bg-[#0D631B] text-white text-xl font-bold flex items-center justify-center">
            {user.avatarInitials ||
              (user.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
          </span>
          <p className="mt-3 text-base font-bold text-[#1A1A2E]">{user.name}</p>
          <p className="text-xs text-[#9CA3AF]">Member since {user.joined || "Jan 2025"}</p>

          <div className="mt-4 space-y-2 text-center text-sm flex flex-col items-center text-[#374151]">
            {user.email && (
              <p className="flex items-center gap-2 text-xs">
                <Mail className="w-4 h-4 text-[#9CA3AF]" /> {user.email}
              </p>
            )}
            {user.phone && (
              <p className="flex items-center gap-2 text-xs">
                <Phone className="w-4 h-4 text-[#9CA3AF]" /> {user.phone}
              </p>
            )}
            <p className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-[#9CA3AF]" /> Lagos, Nigeria
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <StatCard icon={Coins} label="Total Points" value={(user.points || 0).toLocaleString()} />
          <StatCard icon={Recycle} label="Total Recycled" value={`${totalRecycled} kg`} />
          <StatCard
            icon={Gift}
            label="Rewards Redeemed"
            value={user.rewardsRedeemedCount ?? rewardsRedeemed.length}
          />
          <StatCard
            icon={MapPinned}
            label="Center Visits"
            value={user.centerVisits ?? recyclingHistory.length}
          />
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6 font-sans">
        <div className="lg:col-span-2 space-y-6">
          {/* Recycling History */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Drop-off History</p>
            {recyclingHistory.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] py-4 text-center">No recycling records found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Material</th>
                    <th className="pb-2 font-medium">Weight</th>
                    <th className="pb-2 font-medium">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {recyclingHistory.map((row, idx) => {
                    const style = MATERIAL_STYLES[row.material] || MATERIAL_STYLES["PET Plastics"];
                    return (
                      <tr key={idx} className="border-b border-[#F3F4F6]">
                        <td className="py-2.5 text-[#6B7280]">{row.date}</td>
                        <td className="py-2.5">
                          <span
                            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: style.bg, color: style.text }}
                          >
                            {row.material.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-2.5 text-[#374151]">{row.weight}</td>
                        <td className="py-2.5 font-semibold text-[#0D631B]">{row.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Rewards Redeemed */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Rewards Redeemed</p>
            {rewardsRedeemed.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] py-4 text-center">No rewards redeemed yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Reward</th>
                    <th className="pb-2 font-medium">Points Used</th>
                  </tr>
                </thead>
                <tbody>
                  {rewardsRedeemed.map((row, idx) => (
                    <tr key={idx} className="border-b border-[#F3F4F6]">
                      <td className="py-2.5 text-[#6B7280]">{row.date}</td>
                      <td className="py-2.5 text-[#374151] font-medium">{row.reward}</td>
                      <td className="py-2.5 font-semibold text-[#DC2626]">{row.pointsUsed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Account Activity timeline */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Account Activity Timeline</p>
          {activity.length === 0 ? (
            <p className="text-xs text-[#9CA3AF] py-4 text-center">No activity yet.</p>
          ) : (
            <div className="relative pl-4">
              <div className="absolute left-1 top-1 bottom-1 w-px bg-[#E5E7EB]" />
              <div className="space-y-4">
                {activity.map((item, i) => (
                  <div key={i} className="relative">
                    <span
                      className={`absolute -left-4 top-1 w-2.5 h-2.5 rounded-full ${
                        i === 0 ? "bg-[#0D631B]" : "bg-[#D1D5DB]"
                      }`}
                    />
                    <p className="text-[11px] text-[#9CA3AF]">{item.time}</p>
                    <p className="text-sm text-[#374151] mt-0.5">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
        <Icon className="w-4 h-4 text-[#0D631B]" />
        {label}
      </div>
      <p className="mt-2 text-xl font-bold text-[#1A1A2E]">{value}</p>
    </div>
  );
}