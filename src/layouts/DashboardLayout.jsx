import { Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toNumber } from "../utils/formatters";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const userName = user?.name || user?.fullName || user?.firstName || "User";
  const initials = (userName || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <>
    <div className="min-h-screen bg-[#F8F7FB] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E7F7EC] text-[#0D631B]">
              🌿 Citizen Portal
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Wallet: <span className="font-bold text-[#0D631B]">{toNumber(user?.points ?? user?.pointsBalance).toLocaleString()} pts</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="text-[#6B7280] hover:text-[#374151] p-1.5 rounded-lg hover:bg-slate-50 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 text-slate-700 hover:text-[#0D631B] transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
                {initials}
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        
      </div>
    </div>
    <Footer />
    </>
  );
}