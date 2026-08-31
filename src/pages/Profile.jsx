import { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Lock,
  Bell,
  LogOut,
  Camera,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
} from "lucide-react";
import PlainLayout from "../layouts/Plainlayout";

const MENU = [
  { key: "edit-profile", label: "Edit Profile", icon: Pencil },
  { key: "change-password", label: "Change Password", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("edit-profile");
  const [showSuccess, setShowSuccess] = useState(true);

  const [firstName, setFirstName] = useState("Hameedat");
  const [email, setEmail] = useState("hameeda@email.com");
  const [phone, setPhone] = useState("800 000 0000");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Real-time validation — each requirement is just a regex test against
  // whatever's currently typed, re-checked on every keystroke.
  const requirements = [
    { label: "Minimum 8 characters", met: newPassword.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "At least one number", met: /[0-9]/.test(newPassword) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(newPassword) },
  ];
  const metCount = requirements.filter((r) => r.met).length;
  const strengthLabel = metCount <= 1 ? "Weak" : metCount <= 3 ? "Medium" : "Strong";
  const strengthColor = metCount <= 1 ? "#DC2626" : metCount <= 3 ? "#F59E0B" : "#27AE60";

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log({ firstName, email, phone });
    setShowSuccess(true);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    console.log({ currentPassword, newPassword });
  };

  const handleLogout = () => {
    // TODO: clear real auth/session once you have one
    console.log("Logging out");
    window.location.href = "/login";
  };

  return (
    <PlainLayout>
      <a
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151]"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </a>
      <p className="mt-1 text-sm text-[#6B7280]">
        Manage your personal information and settings
      </p>

      <div className="mt-6 grid md:grid-cols-[280px_1fr] gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 text-center">
            <div className="relative inline-block">
              <span className="w-16 h-16 rounded-full bg-[#0D631B] text-white text-xl font-semibold flex items-center justify-center">
                HO
              </span>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center">
                <Camera className="w-3 h-3 text-[#6B7280]" />
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">{firstName}</p>
            <p className="text-xs text-[#6B7280]">{email}</p>
            <p className="mt-1 text-xs text-[#9CA3AF]">Member since January 2025</p>

            <div className="mt-4 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 text-center">
              <div>
                <p className="text-lg font-bold text-[#0D631B]">1,250</p>
                <p className="text-[10px] text-[#6B7280] tracking-wide">POINTS</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#0D631B]">25.5</p>
                <p className="text-[10px] text-[#6B7280] tracking-wide">KG RECYCLED</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            {MENU.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-2 text-sm px-4 py-3 border-b border-[#F3F4F6] last:border-b-0 ${
                    isActive
                      ? "bg-[#E7F7EC] text-[#0D631B] font-medium"
                      : "text-[#374151] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-sm px-4 py-3 text-[#DC2626] hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          {activeTab === "edit-profile" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1A2E]">Edit Profile</h2>
                <button
                  onClick={handleSaveProfile}
                  className="text-sm bg-[#0D631B] text-white px-4 py-2 rounded-lg hover:bg-[#0a4f15]"
                >
                  Save Changes
                </button>
              </div>

              {showSuccess && (
                <div className="mt-4 flex items-center justify-between bg-[#E7F7EC] text-[#0D631B] text-sm px-4 py-2.5 rounded-lg">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                  </span>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="text-[#0D631B]/70 hover:text-[#0D631B]"
                  >
                    ×
                  </button>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="mt-5 space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
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
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                  />
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    We'll never share your email with anyone else.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">
                    Phone Number
                  </label>
                  <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden focus-within:ring-2 focus-within:ring-[#0D631B]/40">
                    <span className="flex items-center px-3 bg-gray-50 text-sm text-[#374151] font-medium">
                      +234
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">
                    Account Type
                  </label>
                  <select
                    disabled
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm bg-gray-50 text-[#9CA3AF]"
                  >
                    <option>Individual</option>
                  </select>
                </div>
              </form>
            </>
          )}

          {activeTab === "change-password" && (
            <>
              <h2 className="text-lg font-bold text-[#1A1A2E]">Change Password</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Ensure your account is using a long, random password to stay secure.
              </p>

              <div className="mt-5 grid md:grid-cols-[1fr_240px] gap-6">
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPassword.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(metCount / 4) * 100}%`,
                              backgroundColor: strengthColor,
                            }}
                          />
                        </div>
                        <span className="text-xs text-[#6B7280]">{strengthLabel}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showNew ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="text-sm bg-[#0D631B] text-white px-4 py-2 rounded-lg hover:bg-[#0a4f15]"
                  >
                    Update Password
                  </button>
                </form>

                <div className="bg-gray-50 rounded-xl p-4 h-fit">
                  <p className="text-xs font-semibold text-[#374151]">
                    Password Requirements
                  </p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Ensure your password meets the following criteria:
                  </p>
                  <ul className="mt-3 space-y-2">
                    {requirements.map((req) => (
                      <li
                        key={req.label}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: req.met ? "#27AE60" : "#9CA3AF" }}
                      >
                        {req.met ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5" />
                        )}
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <div className="text-sm text-[#6B7280]">
              Notification preferences — send a screenshot of this tab's
              design and we'll build it next.
            </div>
          )}
        </div>
      </div>
    </PlainLayout>
  );
}