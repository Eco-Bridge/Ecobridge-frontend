import { useState, useEffect } from "react";
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services";
import { toNumber } from "../utils/formatters";

const MENU = [
  { key: "edit-profile", label: "Edit Profile", icon: Pencil },
  { key: "change-password", label: "Change Password", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
];

export default function Profile() {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const isStaffUser = ['ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY'].includes((user?.role || '').toUpperCase());
  const Layout = isStaffUser ? AdminLayout : DashboardLayout;
  const dashboardPath = isStaffUser ? "/admin/dashboard" : "/dashboard";

  const [activeTab, setActiveTab] = useState("edit-profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const AUTO_DISMISS_MS = 30000;

  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  // Profile form state
  const [name, setName] = useState(user?.name || "Hameedat Oyewopo");
  const [email, setEmail] = useState(user?.email || "hameeda@email.com");
  const [phone, setPhone] = useState(user?.phone?.replace("+234", "") || "8000000000");
  const [address, setAddress] = useState(user?.address || "Lagos, Nigeria");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone((user.phone || "").replace("+234", "").trim());
      setAddress(user.address || "Lagos, Nigeria");
    }
  }, [user]);

  // Real-time password validation
  const requirements = [
    { label: "Minimum 8 characters", met: newPassword.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "At least one number", met: /[0-9]/.test(newPassword) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(newPassword) },
  ];
  const metCount = requirements.filter((r) => r.met).length;
  const strengthLabel = metCount <= 1 ? "Weak" : metCount <= 3 ? "Medium" : "Strong";
  const strengthColor = metCount <= 1 ? "#DC2626" : metCount <= 3 ? "#F59E0B" : "#27AE60";

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const formattedPhone = phone.startsWith("+234") ? phone : `+234${phone}`;
      await updateUserProfile({
        name,
        phone: formattedPhone,
        address,
      });
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(err.message || "Failed to change password. Please verify current password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(isStaffUser ? "/admin-login" : "/login");
  };

  const initials = (name || "Eco User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalPoints = toNumber(
    user?.points ?? user?.pointsBalance ?? user?.balance ?? user?.available ?? 0
  );
  const totalKg = toNumber(
    user?.totalRecycled ?? user?.totalRecycledKg ?? user?.kgRecycled ?? user?.totalWasteKg ?? user?.recycledKg ?? 0
  );

  return (
    <Layout>
      <Link
        to={dashboardPath}
        className="inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <p className="mt-1 text-sm text-[#6B7280]">
        Manage your personal information, security, and account preferences
      </p>

      {successMessage && (
        <div className="mt-4 flex items-center justify-between bg-[#E7F7EC] text-[#0D631B] text-sm px-4 py-2.5 rounded-xl border border-[#CDEED3]">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMessage}
          </span>
          <button onClick={() => setSuccessMessage("")} className="text-[#0D631B]/70 hover:text-[#0D631B]">
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 flex items-center justify-between bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-xl border border-red-200">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
          </span>
          <button onClick={() => setErrorMessage("")} className="text-red-700/70 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-[280px_1fr] gap-6 font-sans">
        {/* Left column */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-xs">
            <div className="relative inline-block">
              <span className="w-16 h-16 rounded-full bg-[#0D631B] text-white text-xl font-bold flex items-center justify-center">
                {initials}
              </span>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-xs">
                <Camera className="w-3 h-3 text-[#6B7280]" />
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">{name}</p>
            <p className="text-xs text-[#6B7280]">{email}</p>
            <p className="mt-1 text-xs text-[#9CA3AF]">
              Role: <span className="font-semibold text-[#0D631B]">{user?.role || "Citizen"}</span>
            </p>

            <div className="mt-4 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 text-center">
              <div>
                <p className="text-lg font-bold text-[#0D631B]">{totalPoints.toLocaleString()}</p>
                <p className="text-[10px] text-[#6B7280] tracking-wide uppercase font-semibold">Points</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#0D631B]">{totalKg} kg</p>
                <p className="text-[10px] text-[#6B7280] tracking-wide uppercase font-semibold">Recycled</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
            {MENU.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setSuccessMessage("");
                    setErrorMessage("");
                  }}
                  className={`w-full flex items-center gap-2.5 text-sm px-4 py-3 border-b border-[#F3F4F6] last:border-b-0 cursor-pointer transition-colors ${
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
              className="w-full flex items-center gap-2.5 text-sm px-4 py-3 text-[#DC2626] hover:bg-red-50 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
          {activeTab === "edit-profile" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A2E]">Edit Profile</h2>
                  <p className="text-xs text-[#6B7280]">Update your personal and contact details</p>
                </div>
                <button
                  type="submit"
                  form="profile-form"
                  disabled={loading}
                  className="text-sm bg-[#0D631B] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>

              <form id="profile-form" onSubmit={handleSaveProfile} className="mt-5 space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm bg-gray-50 text-[#6B7280] cursor-not-allowed"
                  />
                  <p className="mt-1 text-[11px] text-[#9CA3AF]">
                    Email address is tied to your account identity.
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
                    Location / Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Ikeja, Lagos"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">
                    Account Role
                  </label>
                  <input
                    disabled
                    value={user?.role || "USER"}
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm bg-gray-50 text-[#6B7280]"
                  />
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
                        required
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
                        required
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
                      Confirm New Password
                    </label>
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="text-sm bg-[#0D631B] text-white font-medium px-4 py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Updating Password..." : "Update Password"}
                  </button>
                </form>

                <div className="bg-gray-50 rounded-xl p-4 h-fit border border-gray-100">
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
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1A1A2E]">Notification Preferences</h2>
              <p className="text-xs text-[#6B7280]">Choose how you receive updates about points and redemptions</p>
              
              <div className="space-y-3 pt-2">
                {[
                  { title: "Email Notifications", desc: "Receive email confirmation upon waste drop-off and voucher generation." },
                  { title: "SMS Alerts", desc: "Get SMS updates on balance changes and urgent point expiration reminders." },
                  { title: "Promotional & Community News", desc: "Get notified about double points weekends and new Lagos collection centers." },
                ].map((pref, i) => (
                  <label key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" defaultChecked={i < 2} className="mt-0.5 rounded text-[#0D631B] accent-[#0D631B]" />
                    <div>
                      <p className="text-sm font-medium text-[#1A1A2E]">{pref.title}</p>
                      <p className="text-xs text-[#6B7280]">{pref.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}