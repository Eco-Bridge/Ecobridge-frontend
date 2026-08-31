import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Recycle, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigates to dashboard view on submit
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      
      {/* LEFT PANEL - GREEN BRANDING BANNER */}
      <div className="hidden lg:flex w-md bg-[#1B6B32] text-white flex-col justify-between p-12 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold text-xl tracking-tight">EcoBridge</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight leading-tight flex items-center gap-3">
            Welcome <br /> Back <span className="text-3xl">👋</span>
          </h1>
          <p className="text-emerald-100/90 text-sm leading-relaxed max-w-xs">
            "The greatest threat to our planet is the belief that someone else will save it."
          </p>
          <p className="text-xs font-semibold tracking-widest text-emerald-200 uppercase">
            — ROBERT SWAN
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-emerald-200">
              <Recycle className="w-3.5 h-3.5" />
              <span>TOTAL RECYCLED</span>
            </div>
            <p className="text-2xl font-extrabold mt-2 tracking-tight">12,450 kg</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-emerald-200">
              <Star className="w-3.5 h-3.5 fill-emerald-200" />
              <span>ECO POINTS</span>
            </div>
            <p className="text-2xl font-extrabold mt-2 tracking-tight">3,800</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - LOGIN FORM CARD */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-120 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Log in</h2>
            <p className="text-slate-500 text-sm mt-1">
              Continue your sustainable journey in Lagos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B6B32] focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Password
                </label>
                <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs font-medium text-[#1B6B32] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B6B32] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-[#1B6B32] focus:ring-[#1B6B32] accent-[#1B6B32]"
              />
              <label htmlFor="remember" className="text-xs text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#1B6B32] hover:bg-[#155427] text-white font-medium text-sm rounded-xl shadow-xs transition duration-150 cursor-pointer"
            >
              Login to My Account
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="flex justify-center gap-3">
            <SocialButton label="Google" icon={<GoogleIcon />} />
            <SocialButton label="Apple" icon={<AppleIcon />} />
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate('/admin-login')}
              className="flex items-center justify-between w-full p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-xs text-emerald-800 hover:bg-emerald-100/50 transition"
            >
              <div className="flex items-center gap-2 font-medium">
                <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px]">✓</span>
                <span>Admin? Log in here</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/signup')} className="font-semibold text-[#1B6B32] hover:underline">
              Create one for free
            </button>
          </p>

        </div>
      </div>

    </div>

  );
}

function SocialButton({ label, icon }) {
  return (
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
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