import { Bell, LayoutDashboard, ClipboardList, Users, Gift, BarChart3 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const ADMIN_LINKS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Record Waste", path: "/admin/record-waste", icon: ClipboardList },
  { label: "Manage Users", path: "/admin/manage-users", icon: Users },
  { label: "Manage Rewards", path: "/admin/manage-rewards", icon: Gift },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F7FB] flex">
      <Sidebar links={ADMIN_LINKS} userName="John Doe" profilePath="/admin/profile" />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-end gap-4">
          <a href="/admin/notifications" aria-label="Notifications" className="text-[#6B7280] hover:text-[#374151]">
            <Bell className="w-5 h-5" />
          </a>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        
      </div>
    </div> 
    <Footer />
    </>
  );
}