import { Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { toNumber } from "../utils/formatters";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F7FB] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-end gap-4">
          <a href="/notifications" aria-label="Notifications" className="text-[#6B7280] hover:text-[#374151]">
            <Bell className="w-5 h-5" />
          </a>
          <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
            HO
          </span>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        
      </div>
    </div>
    <Footer />
    </>
  );
}