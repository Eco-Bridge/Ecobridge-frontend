import { Bell } from "lucide-react";
import Footer from "../components/Footer";

export default function PlainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F7FB] flex flex-col">
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-[#0D631B]">EcoBridge</span>
        <div className="flex items-center gap-4">
          <a href="/notifications" aria-label="Notifications" className="text-[#6B7280] hover:text-[#374151]">
            <Bell className="w-5 h-5" />
          </a>
          <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
            HO
          </span>
        </div>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <Footer variant="compact" />
    </div>
  );
}