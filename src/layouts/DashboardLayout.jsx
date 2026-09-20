import { useState } from "react";
import { Bell, PanelLeftOpen } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function DashboardLayout({ children }) {

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F7FB] flex">
      <Sidebar 
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

          <a href="/notifications" aria-label="Notifications" className="text-[#6B7280] hover:text-[#374151]">
            <Bell className="w-5 h-5" />
          </a>
          <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
            HO
          </span>
        </header>

        <main className="flex-1 p-6">{children}</main>

        <Footer variant="compact" />
      </div>
    </div>
  );
}