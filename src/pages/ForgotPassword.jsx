import { useState } from "react";
import { Lock, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Logo from "../components/Logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your Node.js "send OTP" endpoint
    console.log({ email });
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-[#E5E7EB] rounded-xl p-8">
        <div className="flex items-center justify-center gap-2">
          <Logo />
        </div>

        <a
          href="/login"
          className="mt-6 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </a>

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
                Enter your email address and we'll send you a link to reset
                your password.
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
                    placeholder="e.g.hameeda@example.com"
                    required
                    className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
              >
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center text-center">
            <span className="w-12 h-12 rounded-full bg-[#CBFFC2] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#0D631B]" />
            </span>
            <h1 className="mt-3 text-lg font-bold text-[#1A1A2E]">
              Check your email
            </h1>
            <p className="mt-1 text-sm text-[#6B7280] max-w-xs">
              We sent an OTP to <span className="font-medium">{email}</span>.
              Enter it on the next screen to reset your password.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#0D631B] font-medium hover:underline">
            Sign up
          </a>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 EcoBridge. Empowering Nigerian communities.
        </p>
      </div>
    </div>
  );
}