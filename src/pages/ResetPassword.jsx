import { useState, useRef } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import Logo from "../components/Logo";

export default function ResetPassword() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // only allow a single digit

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    // TODO: wire up to your Node.js "verify OTP" endpoint
    console.log({ code });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-[#E5E7EB] rounded-xl p-8">
        <Logo />

        <a
          href="/forgot-password"
          className="mt-6 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </a>

        <div className="mt-6 flex flex-col items-center text-center">
          <span className="w-12 h-12 rounded-full bg-[#CBFFC2] flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#0D631B]" />
          </span>
          <h1 className="mt-3 text-lg font-bold text-[#1A1A2E]">Enter OTP</h1>
          <p className="mt-1 text-sm text-[#6B7280] max-w-xs">
            Enter the 4-digit code we sent to your email address to reset
            your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-sm font-medium text-[#374151] mb-2">
            OTP Code
          </label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-14 h-14 text-center text-lg rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
          >
            Verify OTP
          </button>
        </form>

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