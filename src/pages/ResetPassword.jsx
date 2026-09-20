import { useState, useEffect } from "react";
import { Lock, ArrowLeft, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import { authService } from "../services";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { refreshUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Please provide a valid reset token.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authService.resetPassword(token.trim(), { newPassword });
      await refreshUserData();
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password. The token may be expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
        <Logo />

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="mt-6 flex flex-col items-center text-center">
          <span className="w-12 h-12 rounded-full bg-[#CBFFC2] flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#0D631B]" />
          </span>
          <h1 className="mt-3 text-lg font-bold text-[#1A1A2E]">Set New Password</h1>
          <p className="mt-1 text-sm text-[#6B7280] max-w-xs">
            Enter your reset token and your new account password.
          </p>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 bg-[#E7F7EC] border border-[#0D631B]/30 text-[#0D631B] text-xs p-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password reset successful! Logging you in...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Reset Token
            </label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste 15-minute reset token"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="mt-2 w-full bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              <span>Reset Password & Log In</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#0D631B] font-medium hover:underline">
            Sign up
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 EcoBridge. Empowering Nigerian communities.
        </p>
      </div>
    </div>
  );
}