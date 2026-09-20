import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandPanel from "../../components/Brandpanel";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ email, password });
      const userRole = (result.user?.role || result.role || "").toUpperCase();

      if (['ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY'].includes(userRole)) {
        navigate("/admin/dashboard");
        return;
      }

      if (userRole === 'USER' || userRole === 'CITIZEN') {
        setError("This account is for the citizen portal. Please use the Citizen Login page.");
        return;
      }

      setError("Access restricted. This account does not have Staff or Admin privileges.");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify your staff email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <BrandPanel />

      <div className="w-full md:w-[62%] bg-white flex items-center justify-center p-6 md:p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm border border-[#E5E7EB] rounded-2xl p-7 shadow-xs">
          <h2 className="text-xl font-bold text-[#1A1A2E]">Staff & Admin Portal</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Please enter your authorized credentials to continue.
          </p>

          {error && (
            <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-5">
            <label className="block text-xs font-medium text-[#374151] mb-1">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@ecobridge.ng"
                required
                className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-[#374151] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-10 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
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
          </div>

          <div className="mt-2 text-right">
            <a href="/forgot-password" className="text-xs text-[#0D631B] hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-1.5 bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors disabled:opacity-60 cursor-pointer text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Login to Staff Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 mt-5">
            Citizen user?{" "}
            <a href="/login" className="text-[#0D631B] font-medium hover:underline">
              Citizen Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}