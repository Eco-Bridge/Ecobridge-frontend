import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Gift, RotateCcw, Clock, PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const DEFAULT_LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Rewards", path: "/reward", icon: Gift },
  { label: "Recycle History", path: "/recycle-history", icon: RotateCcw },
  { label: "Reward History", path: "/reward-history", icon: Clock },
];

export default function Sidebar({ links = DEFAULT_LINKS, profilePath = "/profile" }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const userName = user?.name || "Hameeda Oyewopo";
  const initials = (userName || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={`shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-all duration-200 h-screen sticky top-0 font-sans z-20 flex-shrink-0 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div>
        <div className="px-4 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          {!collapsed && <Logo />}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-8 h-8 rounded-lg bg-[#E7F7EC] text-[#0D631B] flex items-center justify-center shrink-0 hover:bg-[#d9f0dd] cursor-pointer"
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                title={collapsed ? link.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-[#E7F7EC] text-[#0D631B] font-semibold"
                    : "text-[#374151] hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className={`px-4 py-4 border-t border-[#E5E7EB] flex items-center justify-between ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </span>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#1A1A2E] truncate">{userName}</p>
              <Link to={profilePath} className="text-[11px] text-[#6B7280] hover:text-[#0D631B]">
                View Profile
              </Link>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={logout}
            title="Logout"
            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}