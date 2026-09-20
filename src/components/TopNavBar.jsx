import { useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "About", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

export default function TopNavBar() {
  const location = useLocation();

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[#E5E7EB]">
      <Logo />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-sm">
        {LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={
                isActive
                  ? "text-[#0D631B] font-semibold border-b-2 border-[#0D631B] pb-1"
                  : "text-[#374151] hover:text-[#0D631B] transition-colors"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Login + Sign Up - Always Visible */}

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to={isStaff ? "/admin/dashboard" : "/dashboard"}
              className="bg-[#0D631B] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors flex items-center gap-1.5"
            >
              <span>{isStaff ? "Admin Console" : "My Dashboard"}</span>
              <span className="text-white/80">→</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-[#374151] hover:text-[#0D631B] transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Dropdown Menu */} {menuOpen && ( <div className="absolute left-0 top-full w-full bg-white border-b border-[#E5E7EB] shadow-lg md:hidden"> <nav className="flex flex-col px-6 py-3"> {LINKS.map((link) => { const isActive = location.pathname === link.path; return ( <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} className={`py-3 text-sm border-b border-[#F3F4F6] last:border-b-0 ${ isActive ? "text-[#0D631B] font-medium" : "text-[#374151] hover:text-[#0D631B]" }`} > {link.label} </Link> ); })} </nav> </div>
    )}

    </header>
  );
}