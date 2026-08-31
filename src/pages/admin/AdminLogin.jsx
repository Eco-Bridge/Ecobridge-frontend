import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import BrandPanel from "../../components/Brandpanel";

// Placeholder credentials so the error state below is actually demonstrable
// before your real backend exists. Replace this whole check with a real
// API call once your Node.js auth endpoint is ready.
const DEMO_ADMIN = { email: "admin@ecobridge.ng", password: "EcoAdmin2026" };

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with a real call to your Node.js admin-auth endpoint
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      setError("");
      console.log("Admin login successful");
      window.location.href = "/admin/dashboard";
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <BrandPanel />

      <div className="w-full md:w-[62%] bg-white flex items-center justify-center p-6 md:p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm border border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#1A1A2E]">Welcome Back</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Please enter your staff credentials to continue.
          </p>

          <div className="mt-6">
            <label className="block text-sm font-medium text-[#374151] mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecobridge.ng"
                required
                className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[#374151] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full rounded-lg border pl-9 pr-10 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  error
                    ? "border-[#DC2626] focus:ring-[#DC2626]/30 focus:border-[#DC2626]"
                    : "border-[#E5E7EB] focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-[#DC2626]">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="mt-2 text-right">
            <a href="/admin/forgot-password" className="text-xs text-[#0D631B] hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-4 w-full flex items-center justify-center gap-1.5 bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
          >
            Login to Admin Portal
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}