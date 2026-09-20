import { useState } from "react";
import { Bell, PanelLeftOpen, LayoutDashboard, ClipboardList, Users, Gift, BarChart3 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const ADMIN_LINKS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Record Waste", path: "/admin/record-waste", icon: ClipboardList },
  { label: "Manage Users", path: "/admin/manage-users", icon: Users },
  { label: "Manage Rewards", path: "/admin/manage-rewards", icon: Gift },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }) {

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F7FB] flex">
      <Sidebar
        links={ADMIN_LINKS}
        userName="John Doe"
        profilePath="/admin/profile"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-8 h-8 rounded-lg bg-[#E7F7EC] text-[#0D631B] flex items-center justify-center"
              aria-label="Open sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <a
                href="/admin/notifications"
                aria-label="Notifications"
                className="text-[#6B7280] hover:text-[#374151]"
              >
                <Bell className="w-5 h-5" />
              </a>
            </div>
          </header>

        <main className="flex-1 p-6">{children}</main>

        <Footer variant="compact" />
      </div>
    </div>
  );
}