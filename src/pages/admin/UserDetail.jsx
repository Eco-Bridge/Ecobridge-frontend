import { useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Coins, Recycle, Gift, MapPinned } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { USERS } from "../../data/mockUsers";

const MATERIAL_STYLES = {
  "PET Plastics": { bg: "#DBEAFE", text: "#3B82F6" },
  Aluminum: { bg: "#DCFCE7", text: "#16A34A" },
  Cardboard: { bg: "#FEF3C7", text: "#B45309" },
  Glass: { bg: "#CCFBF1", text: "#0D9488" },
};

export default function UserDetail() {
  const { userId } = useParams();
  const user = USERS.find((u) => u.id === userId);

  if (!user) {
    return (
      <AdminLayout>
        <p className="text-sm text-[#6B7280]">
          No user found with ID "{userId}".{" "}
          <a href="/admin/manage-users" className="text-[#0D631B] hover:underline">
            Back to all users
          </a>
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <a
        href="/admin/manage-users"
        className="inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Users
      </a>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button className="text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50">
          Edit Profile
        </button>
        <button className="text-sm border border-[#FECACA] text-[#DC2626] px-4 py-2 rounded-lg hover:bg-red-50">
          Disable Account
        </button>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 text-center">
          <span className="mx-auto w-16 h-16 rounded-full bg-[#0D631B] text-white text-xl font-semibold flex items-center justify-center">
            {user.avatarInitials}
          </span>
          <p className="mt-3 text-base font-semibold text-[#1A1A2E]">{user.name}</p>
          <p className="text-xs text-[#9CA3AF]">Member since {user.joined}</p>

          <div className="mt-4 space-y-2 text-center text-sm flex flex-col items-center text-[#374151]">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#9CA3AF]" /> {user.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#9CA3AF]" /> {user.phone}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9CA3AF]" /> Lagos, Nigeria
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <StatCard icon={Coins} label="Total Points" value={user.points.toLocaleString()} />
          <StatCard icon={Recycle} label="Total Recycled" value={`${user.totalRecycled} kg`} />
          <StatCard icon={Gift} label="Rewards Redeemed" value={user.rewardsRedeemedCount} />
          <StatCard icon={MapPinned} label="Center Visits" value={user.centerVisits} />
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recycling History */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Recycling History</p>
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
                {user.recyclingHistory.map((row) => {
                  const style = MATERIAL_STYLES[row.material];
                  return (
                    <tr key={row.date + row.material} className="border-b border-[#F3F4F6]">
                      <td className="py-2.5 text-[#6B7280]">{row.date}</td>
                      <td className="py-2.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {row.material}
                        </span>
                      </td>
                      <td className="py-2.5 text-[#374151]">{row.weight}</td>
                      <td className="py-2.5 font-medium text-[#0D631B]">{row.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Rewards Redeemed */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Rewards Redeemed</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Reward</th>
                  <th className="pb-2 font-medium">Points Used</th>
                </tr>
              </thead>
              <tbody>
                {user.rewardsRedeemed.map((row) => (
                  <tr key={row.date + row.reward} className="border-b border-[#F3F4F6]">
                    <td className="py-2.5 text-[#6B7280]">{row.date}</td>
                    <td className="py-2.5 text-[#374151]">{row.reward}</td>
                    <td className="py-2.5 font-medium text-[#DC2626]">{row.pointsUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Account Activity timeline */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-4">Account Activity</p>
          <div className="relative pl-4">
            <div className="absolute left-1 top-1 bottom-1 w-px bg-[#E5E7EB]" />
            <div className="space-y-4">
              {user.activity.map((item, i) => (
                <div key={item.time + item.text} className="relative">
                  <span
                    className={`absolute -left-4 top-1 w-2 h-2 rounded-full ${
                      i === 0 ? "bg-[#0D631B]" : "bg-[#D1D5DB]"
                    }`}
                  />
                  <p className="text-xs text-[#9CA3AF]">{item.time}</p>
                  <p className="text-sm text-[#374151]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
        <Icon className="w-4 h-4 text-[#0D631B]" />
        {label}
      </div>
      <p className="mt-2 text-xl font-bold text-[#1A1A2E]">{value}</p>
    </div>
  );
}