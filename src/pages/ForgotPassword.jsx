import { useState } from "react";
import { Lock, Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { authService } from "../services";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      setSent(true);
      // Backend returns reset token directly or in token property
      const token = response.token || response.resetToken || (typeof response === 'string' ? response : '');
      if (token) {
        setResetToken(token);
      }
    } catch (err) {
      setError(err.message || 'Unable to request password reset. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Logo />
        </div>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {error && (
          <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!sent ? (
          <>
            <div className="mt-6 flex flex-col items-center text-center">
              <span className="w-12 h-12 rounded-full bg-[#CBFFC2] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#0D631B]" />
              </span>
              <h1 className="mt-3 text-lg font-bold text-[#1A1A2E]">
                Forgot password
              </h1>
              <p className="mt-1 text-sm text-[#6B7280] max-w-xs">
                Enter your registered email address and we'll generate a secure 15-minute reset token.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. hameeda@example.com"
                    required
                    className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Request...</span>
                  </>
                ) : (
                  <span>Send Reset Token</span>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center text-center">
            <span className="w-12 h-12 rounded-full bg-[#CBFFC2] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#0D631B]" />
            </span>
            <h1 className="mt-3 text-lg font-bold text-[#1A1A2E]">
              Reset Token Generated
            </h1>
            <p className="mt-1 text-sm text-[#6B7280] max-w-xs">
              A 15-minute password reset token has been issued for <span className="font-medium text-slate-900">{email}</span>.
            </p>

            {resetToken && (
              <div className="mt-4 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Reset Token</p>
                <p className="font-mono text-xs text-[#0D631B] break-all select-all mt-1">{resetToken}</p>
              </div>
            )}

            <button
              onClick={() => navigate(`/reset-password${resetToken ? `?token=${encodeURIComponent(resetToken)}` : ''}`)}
              className="mt-5 w-full bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Continue to Set New Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

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