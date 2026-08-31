import { useLocation } from "react-router-dom";
import Logo from "./Logo";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "About", path: "/about" },
];

export default function TopNavBar() {
  const location = useLocation();

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[#E5E7EB]">
      <Logo />

      <nav className="hidden md:flex items-center gap-8 text-sm">
        {LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <a
              key={link.path}
              href={link.path}
              className={
                isActive
                  ? "text-[#0D631B] font-medium border-b-2 border-[#0D631B] pb-1"
                  : "text-[#374151] hover:text-[#0D631B]"
              }
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <a href="/login" className="text-sm text-[#374151] hover:text-[#0D631B]">
          Login
        </a>
        <a
          href="/signup"
          className="bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors"
        >
          Sign Up
        </a>
      </div>
    </header>
  );
}