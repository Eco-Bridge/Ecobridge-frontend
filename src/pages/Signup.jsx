import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import Logo from "../components/Logo";
import SignupIllustration from "../assets/signup.jpg";
// import BrandPanel from "../components/Brandpanel";

const BENEFITS = [
  {
    title: "Earn Real Rewards",
    desc: "Convert your recyclables into points redeemable for cash and essentials.",
  },
  {
    title: "Build Community",
    desc: "Connect with local eco-champions and track your collective impact.",
  },
  {
    title: "Cleaner Environment",
    desc: "Directly contribute to a greener, healthier Lagos for future generations.",
  },
];

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return { score: 0, label: "", color: "" };
  if (score <= 1) return { score: 1, label: "Weak", color: "#EA4335" };
  if (score <= 2) return { score: 2, label: "Medium strength", color: "#F59E0B" };
  return { score: 4, label: "Strong", color: "#27AE60" };
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setError("");
    // TODO: wire up to your Node.js signup endpoint
    console.log({ name, email, phone, password });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel */}

      {/* <BrandPanel /> */}

      <div className="w-full md:w-[38%] bg-[#0D631B] text-white p-8 md:p-10 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <Logo variant="light" />
        </div>

        <div className="my-8 md:my-0">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Join Lagos Recyclers
          </h1>
          <p className="mt-3 text-sm text-white/80 max-w-sm">
            Be part of the movement transforming waste into wealth across
            Lagos State. Your sustainable journey starts here.
          </p>

          <ul className="mt-8 space-y-5">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{b.title}</p>
                  <p className="text-xs text-white/75 mt-0.5">{b.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <img src={SignupIllustration} alt="People sorting recyclables in Lagos" className="rounded-xl w-full h-60 object-cover" />
      </div>

      {/* Right panel */}
      <div className="w-full md:w-[62%] bg-white flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">
            Create your account
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">
            Already a member?{" "}
            <a href="/login" className="text-[#0D631B] font-medium hover:underline">
              Log in
            </a>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Phone Number
              </label>
              <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden focus-within:ring-2 focus-within:ring-[#0D631B]/40 focus-within:border-[#0D631B]">
                <span className="flex items-center px-3 bg-[#EFECFF] text-sm text-[#374151] font-medium">
                  +234
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="800 000 0000"
                  required
                  className="w-full px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
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

              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(strength.score / 4) * 100}%`,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#6B7280] whitespace-nowrap">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm text-[#374151]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) setError("");
                }}
                className="mt-0.5 rounded border-gray-300 text-[#0D631B] focus:ring-[#0D631B]/40"
              />
              <span>
                I agree to the{" "}
                <a href="/terms" className="text-[#0D631B] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#0D631B] hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {error && <p className="text-sm text-[#EA4335]">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
            >
              Create my account
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-[#E5E7EB] flex-1" />
            <span className="text-xs text-[#6B7280] whitespace-nowrap">
              OR CONTINUE WITH
            </span>
            <div className="h-px bg-[#E5E7EB] flex-1" />
          </div>

          <div className="flex justify-center gap-3">
            <SocialButton label="Google" icon={<GoogleIcon />} />
            <SocialButton label="Apple" icon={<AppleIcon />} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ label, icon }) {
  return (
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E5E7EB] hover:bg-gray-50 transition-colors"
      aria-label={`Continue with ${label}`}
    >
      {icon}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.09-1.81 2.73v2.27h2.92c1.71-1.57 2.69-3.88 2.69-6.64z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.34C2.44 15.98 5.48 18 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.7c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V4.96H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.04l3.01-2.34z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="#111827">
      <path d="M13.14 9.55c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.65 0-1.63-.73-2.68-.71-1.38.02-2.65.8-3.36 2.03-1.43 2.48-.37 6.16 1.03 8.18.68.98 1.5 2.09 2.57 2.05 1.03-.04 1.42-.66 2.67-.66 1.24 0 1.6.66 2.68.64 1.11-.02 1.81-1 2.48-2 .78-1.14 1.1-2.25 1.12-2.31-.02-.01-2.15-.82-2.17-3.25z" />
      <path d="M11.14 3.44c.56-.68.94-1.62.83-2.56-.81.03-1.79.54-2.37 1.21-.52.6-.97 1.56-.85 2.48.9.07 1.83-.46 2.39-1.13z" />
    </svg>
  );
}