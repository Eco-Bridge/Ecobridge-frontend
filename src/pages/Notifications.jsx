import { useState, useEffect } from "react";
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
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services";

const FILTERS = ["All", "Unread", "Points", "Rewards", "Announcements"];

const TYPE_STYLES = {
  points: { border: "#0D631B", cardBg: "#F0FBF2", iconBg: "#E7F7EC", iconColor: "#0D631B" },
  reward: { border: "#7C3AED", cardBg: "#F8F5FF", iconBg: "#EFECFF", iconColor: "#7C3AED" },
  urgent: { border: "#DC2626", cardBg: "#FEF2F2", iconBg: "#FEE2E2", iconColor: "#DC2626" },
  info: { border: "#E5E7EB", cardBg: "#FFFFFF", iconBg: "#FEF3C7", iconColor: "#F59E0B" },
  announcement: { border: "#E5E7EB", cardBg: "#FFFFFF", iconBg: "#DBEAFE", iconColor: "#3B82F6" },
};

function normalizeNotification(item, index) {
  const type = String(item.type || item.category || "info").toLowerCase();
  const category = String(item.category || item.type || "info").toLowerCase();
  const read = Boolean(item.isRead ?? item.read ?? item.readAt ?? false);
  const title = item.title || item.message || "EcoBridge Update";
  const body = item.body || item.message || item.description || "You have a new update.";

  const normalized = {
    id: item.id || item._id || `notification-${index}`,
    type,
    category: category === "rewards" || category === "reward" ? "rewards" : category === "points" ? "points" : category === "announcements" || category === "announcement" ? "announcements" : category,
    read,
    icon: type === "points" ? DollarSign : type === "reward" ? Gift : type === "urgent" ? AlertTriangle : category === "announcements" || category === "announcement" ? Megaphone : Sparkles,
    title,
    body,
    time: item.createdAt ? new Date(item.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently",
    actions: item.actions || [],
    tip: item.tip || null,
  };

  return normalized;
}

export default function Notifications() {
  const { user } = useAuth();
  const isStaffUser = ['ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY'].includes((user?.role || '').toUpperCase());
  const Layout = isStaffUser ? AdminLayout : DashboardLayout;

  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      setLoading(true);
      setError(null);
      try {
        const response = await notificationService.getNotifications();
        const list = Array.isArray(response)
          ? response
          : response?.notifications || response?.data?.notifications || response?.data || [];

        if (isMounted) {
          const normalized = list.map((item, index) => normalizeNotification(item, index));
          normalized.sort((a, b) => new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time));
          setNotifications(normalized);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load notifications.");
          setNotifications([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const matchesFilter = (item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !item.read;
    return item.category === activeFilter.toLowerCase();
  };

  const filtered = notifications.filter(matchesFilter);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const stats = [
    { icon: Mail, label: "Total Notifications", value: `${notifications.length}`, color: "#3B82F6", bg: "#DBEAFE" },
    { icon: Mail, label: "Unread", value: `${unreadCount}`, color: "#DC2626", bg: "#FEE2E2" },
    { icon: Mail, label: "Read", value: `${notifications.length - unreadCount}`, color: "#0D631B", bg: "#E7F7EC" },
  ];

  return (
    <Layout>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
            Notifications
            <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          </h1>
          <p className="text-sm text-[#6B7280]">Stay updated on your recycling and rewards activity</p>
        </div>
        <div className="flex gap-2">
          <button onClick={async () => { try { await notificationService.markAllRead(); setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))); } catch (err) { setError(err.message || "Unable to mark notifications as read."); } }} className="flex items-center gap-1.5 text-sm text-[#2563EB] bg-[#DBEAFE] px-4 py-2 rounded-lg hover:bg-[#c7ddfc]">
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
          <button onClick={async () => { try { await Promise.all(notifications.map((n) => notificationService.deleteNotification(n.id))); setNotifications([]); } catch (err) { setError(err.message || "Unable to clear notifications."); } }} className="flex items-center gap-1.5 text-sm text-[#DC2626] bg-[#FEE2E2] px-4 py-2 rounded-lg hover:bg-[#fbcfcf]">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {error && <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>}

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
              </div>
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid md:grid-cols-[220px_1fr] gap-6">
        <div>
          <button onClick={() => setActiveFilter("All")} className={`w-full flex items-center justify-between text-sm px-4 py-2 rounded-lg mb-3 ${activeFilter === "All" ? "bg-[#0D631B] text-white" : "bg-white border border-[#E5E7EB] text-[#374151]"}`}>
            All <span>{notifications.length}</span>
          </button>

          <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
            {FILTERS.slice(1).map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`w-full flex items-center justify-between text-sm px-4 py-2.5 border-b border-[#F3F4F6] last:border-b-0 ${activeFilter === filter ? "text-[#0D631B] font-medium" : "text-[#374151]"} hover:bg-gray-50`}>
                {filter}
                {filter === "Unread" && <span className="text-xs bg-[#FEE2E2] text-[#DC2626] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {loading ? <div className="py-16 flex flex-col justify-center items-center text-slate-400 gap-3"><Mail className="w-8 h-8 animate-spin text-[#0D631B]" /><p className="text-sm font-medium">Loading notifications...</p></div> : filtered.length === 0 ? <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-slate-400">No notifications available.</div> : <>
            {filtered.map((item) => {
              const style = TYPE_STYLES[item.type] || TYPE_STYLES.info;
              const Icon = item.icon;
              return (
                <div key={item.id} className="rounded-xl p-4 border-l-4" style={{ borderLeftColor: style.border, backgroundColor: style.cardBg }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: style.iconBg }}><Icon className="w-4 h-4" style={{ color: style.iconColor }} /></span>
                      <div>
                        <p className="text-sm font-semibold text-[#1A1A2E]">{item.title}</p>
                        <p className="mt-1 text-xs text-[#6B7280]">{item.body}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#9CA3AF] whitespace-nowrap">{item.time}</span>
                  </div>

                  {item.tip && <div className="mt-2 ml-11 text-xs text-[#DC2626] bg-white/60 rounded-lg px-3 py-2">{item.tip}</div>}

                  {item.actions && item.actions.length > 0 && <div className="mt-3 ml-11 flex flex-wrap gap-2">{item.actions.map((action) => <a key={action.label} href={action.href} className={`text-xs font-medium px-3 py-1.5 rounded-lg ${action.style === "solid" ? "text-white" : "border"}`} style={action.style === "solid" ? { backgroundColor: style.border } : { borderColor: style.border, color: style.border }}>{action.label}</a>)}</div>}
                </div>
              );
            })}
          </>}
        </div>
      </div>
    </Layout>
  );
}