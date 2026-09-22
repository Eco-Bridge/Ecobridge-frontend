import { Bell, LayoutDashboard, ClipboardList, Users, Gift, BarChart3 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const ADMIN_LINKS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Record Waste", path: "/admin/record-waste", icon: ClipboardList },
  { label: "Manage Users", path: "/admin/manage-users", icon: Users },
  { label: "Manage Rewards", path: "/admin/manage-rewards", icon: Gift },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const userName = user?.name || "Staff Admin";
  const userRole = (user?.role || "ADMIN").toUpperCase();
  const initials = (userName)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <>
    <ProtectedRoute>
    <div className="min-h-screen bg-[#F8F7FB] flex">
      <Sidebar 
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      links={ADMIN_LINKS} 
      profilePath="/admin/profile" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between gap-4">
         <div className="flex items-center gap-2 pl-10 md:pl-0">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EFECFF] text-[#4338CA]">
              🛡️ {userRole} CONSOLE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/notifications"
              aria-label="Notifications"
              className="text-[#6B7280] hover:text-[#374151] p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 text-slate-700 hover:text-[#0D631B] transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-[#1A1A2E] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                {initials}
              </span>
              <span className="text-sm font-medium hidden md:inline">{userName}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        
      </div>
    </div> 
    <Footer />
    </ProtectedRoute>
    </>
  );
}