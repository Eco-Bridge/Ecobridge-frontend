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

export default function Sidebar({ 
  userName = "Hameeda Oyewopo", 
  links = DEFAULT_LINKS, 
  profilePath = "/profile",
  mobileOpen,
  setMobileOpen,
  }) {
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
  <>
    {mobileOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={() => setMobileOpen(false)}
      />
    )}

    <aside
      className={`
        shrink-0
        bg-white
        border-r border-[#E5E7EB]
        flex flex-col justify-between
        transition-all duration-200
        fixed md:relative
        top-0 left-0
        h-full md:h-auto
        z-50
        w-56
        md:${collapsed ? "w-16" : "w-56"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div>
        <div className="px-4 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          {!collapsed && <Logo />}
          <button
            onClick={() => {
              if (mobileOpen) {
                setMobileOpen(false);
              } else {
                setCollapsed((c) => !c);
              }
            }}
            aria-label={
              mobileOpen
                ? "Close sidebar"
                : collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="w-8 h-8 rounded-lg bg-[#E7F7EC] text-[#0D631B] flex items-center justify-center shrink-0 hover:bg-[#d9f0dd]"
          >
          
            {mobileOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : collapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  collapsed ? "md:justify-center" : ""
                } ${
                  isActive
                    ? "bg-[#E7F7EC] text-[#0D631B] font-semibold"
                    : "text-[#374151] hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className={collapsed ? "md:hidden" : ""}>
                    {link.label}
                  </span>

              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-4 py-4 border-t border-[#E5E7EB] flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center shrink-0">
          {initials}
        </span>

        <div className={`${collapsed ? "md:hidden" : ""}`}>
          <p className="text-sm font-medium text-[#1A1A2E]">
            {userName}
          </p>

          <a
            href={profilePath}
            onClick={() => setMobileOpen(false)}
            className="text-xs text-[#6B7280] hover:text-[#0D631B]"
          >
            View Profile
          </a>
        </div>
    </div>
    </aside>
  </>
  );
}