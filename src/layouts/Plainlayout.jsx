import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function PlainLayout({ children }) {
  const { user } = useAuth();
  const isStaff = ['ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY'].includes((user?.role || '').toUpperCase());

  return (
    <div className="min-h-screen bg-[#F8F7FB] flex flex-col">
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-[#0D631B]">EcoBridge</span>
        <div className="flex items-center gap-4">
          <Link
            to={isStaff ? "/admin/notifications" : "/notifications"}
            aria-label="Notifications"
            className="text-[#6B7280] hover:text-[#374151]"
          >
            <Bell className="w-5 h-5" />
          </Link>
          <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
            {user?.name ? user.name[0] : "H"}
          </span>
        </div>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <Footer variant="compact" />
    </div>
  );
}