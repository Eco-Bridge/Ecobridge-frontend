import { useState } from "react";
import {
  Mail,
  DollarSign,
  Gift,
  AlertTriangle,
  Sparkles,
  Megaphone,
  CheckCheck,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const STATS = [
  { icon: Mail, label: "Total Notifications", value: "12", color: "#3B82F6", bg: "#DBEAFE" },
  { icon: Mail, label: "Unread", value: "3", color: "#DC2626", bg: "#FEE2E2" },
  { icon: Mail, label: "Read", value: "9", color: "#0D631B", bg: "#E7F7EC" },
];

const FILTERS = ["All", "Unread", "Points", "Rewards", "Announcements"];

// type controls card styling (colored border+tint for the important/unread ones).
// category is what the filter tabs match against. read controls the "Unread" filter.
const NOTIFICATION_GROUPS = [
  {
    heading: "Today",
    items: [
      {
        type: "points",
        category: "points",
        read: false,
        icon: DollarSign,
        title: "Points Added to Your Account",
        time: "2 hours ago",
        body: "You've earned 100 pts for your recent plastic bottle recycling at Ikeja Center.",
        actions: [{ label: "View Dashboard", href: "/dashboard", style: "outline" }],
      },
      {
        type: "reward",
        category: "rewards",
        read: false,
        icon: Gift,
        title: "Reward Redeemed Successfully",
        time: "5 hours ago",
        body: "You have successfully redeemed ₦500 MTN Airtime. Enjoy your reward!",
        actions: [
          { label: "View Voucher Code", href: "/reward-history", style: "solid" },
          { label: "View Reward History", href: "/reward-history", style: "outline" },
        ],
      },
      {
        type: "urgent",
        category: "points",
        read: false,
        icon: AlertTriangle,
        title: "Urgent: Your Points Are Expiring Soon!",
        time: "8 hours ago",
        body: "You have 250 points that will expire in 3 days. Redeem them now before they're gone.",
        tip: "Tip: Check out our new discounted rewards in the catalog!",
        actions: [{ label: "Redeem Now", href: "/reward", style: "solid" }],
      },
    ],
  },
  {
    heading: "Yesterday",
    items: [
      {
        type: "info",
        category: "rewards",
        read: true,
        icon: Sparkles,
        title: "New Reward Available!",
        time: "Yesterday, 14:30",
        body: "A new 10% discount voucher for Shoprite has been added to the rewards catalog.",
      },
      {
        type: "points",
        category: "points",
        read: true,
        icon: DollarSign,
        title: "Points Added to Your Account",
        time: "Yesterday, 09:15",
        body: "You've earned 180 pts for glass recycling at Yaba Center.",
      },
    ],
  },
  {
    heading: "This Week",
    items: [
      {
        type: "announcement",
        category: "announcements",
        read: true,
        icon: Megaphone,
        title: "Announcement: New Collection Center Opening",
        time: "Mon, 10:00",
        body: "We are thrilled to announce a new EcoBridge collection center opening in Surulere this weekend. Drop by for double points!",
      },
    ],
  },
];

const TYPE_STYLES = {
  points: { border: "#0D631B", cardBg: "#F0FBF2", iconBg: "#E7F7EC", iconColor: "#0D631B" },
  reward: { border: "#7C3AED", cardBg: "#F8F5FF", iconBg: "#EFECFF", iconColor: "#7C3AED" },
  urgent: { border: "#DC2626", cardBg: "#FEF2F2", iconBg: "#FEE2E2", iconColor: "#DC2626" },
  info: { border: "#E5E7EB", cardBg: "#FFFFFF", iconBg: "#FEF3C7", iconColor: "#F59E0B" },
  announcement: { border: "#E5E7EB", cardBg: "#FFFFFF", iconBg: "#DBEAFE", iconColor: "#3B82F6" },
};

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");

  const matchesFilter = (item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !item.read;
    return item.category === activeFilter.toLowerCase();
  };

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
            Notifications
            <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] flex items-center justify-center">
              3
            </span>
          </h1>
          <p className="text-sm text-[#6B7280]">
            Stay updated on your recycling and rewards activity
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-sm text-[#2563EB] bg-[#DBEAFE] px-4 py-2 rounded-lg hover:bg-[#c7ddfc]">
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
          <button className="flex items-center gap-1.5 text-sm text-[#DC2626] bg-[#FEE2E2] px-4 py-2 rounded-lg hover:bg-[#fbcfcf]">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
              </div>
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: stat.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid md:grid-cols-[220px_1fr] gap-6">
        {/* Filter column */}
        <div>
          <button
            onClick={() => setActiveFilter("All")}
            className={`w-full flex items-center justify-between text-sm px-4 py-2 rounded-lg mb-3 ${
              activeFilter === "All"
                ? "bg-[#0D631B] text-white"
                : "bg-white border border-[#E5E7EB] text-[#374151]"
            }`}
          >
            All <span>12</span>
          </button>

          <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
            {FILTERS.slice(1).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`w-full flex items-center justify-between text-sm px-4 py-2.5 border-b border-[#F3F4F6] last:border-b-0 ${
                  activeFilter === f ? "text-[#0D631B] font-medium" : "text-[#374151]"
                } hover:bg-gray-50`}
              >
                {f}
                {f === "Unread" && (
                  <span className="text-xs bg-[#FEE2E2] text-[#DC2626] px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification feed */}
        <div className="space-y-6">
          {NOTIFICATION_GROUPS.map((group) => {
            const items = group.items.filter(matchesFilter);
            if (items.length === 0) return null;

            return (
              <div key={group.heading}>
                <p className="text-sm font-semibold text-[#1A1A2E] mb-3">
                  {group.heading}
                </p>
                <div className="space-y-3">
                  {items.map((item) => {
                    const style = TYPE_STYLES[item.type];
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title + item.time}
                        className="rounded-xl p-4 border-l-4"
                        style={{
                          borderLeftColor: style.border,
                          backgroundColor: style.cardBg,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                              style={{ backgroundColor: style.iconBg }}
                            >
                              <Icon className="w-4 h-4" style={{ color: style.iconColor }} />
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-[#1A1A2E]">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs text-[#6B7280]">{item.body}</p>
                            </div>
                          </div>
                          <span className="text-xs text-[#9CA3AF] whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>

                        {item.tip && (
                          <div className="mt-2 ml-11 text-xs text-[#DC2626] bg-white/60 rounded-lg px-3 py-2">
                            {item.tip}
                          </div>
                        )}

                        {item.actions && (
                          <div className="mt-3 ml-11 flex flex-wrap gap-2">
                            {item.actions.map((action) => (
                              <a
                                key={action.label}
                                href={action.href}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                                  action.style === "solid"
                                    ? "text-white"
                                    : "border"
                                }`}
                                style={
                                  action.style === "solid"
                                    ? { backgroundColor: style.border }
                                    : { borderColor: style.border, color: style.border }
                                }
                              >
                                {action.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}