import { useState, useEffect } from "react";
import { Search, Plus, Users as UsersIcon, CheckCircle2, Ban, Eye, Pencil, Loader2, X, Mail, Phone, MapPin, Coins, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { userService } from "../../services";

const PAGE_SIZE = 4;

export default function ManageUsers() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActiveAccounts, setTotalActiveAccounts] = useState(0);
  const [totalFlaggedAccounts, setTotalFlaggedAccounts] = useState(0);

  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "USER",
    status: "Active"
  });
  const [savingUser, setSavingUser] = useState(false);
  const [editError, setEditError] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      setLoading(true);
      try {
        const response = await userService.getUsersWithMeta(search);
        if (!isMounted) return;
        setUserList(response.users);
        setTotalUsers(response.totalUsers || response.users.length);
        setTotalActiveAccounts(response.totalActiveAccounts);
        setTotalFlaggedAccounts(response.totalFlaggedAccounts);
      } catch (err) {
        if (!isMounted) return;
        setUserList([]);
        setTotalUsers(0);
        setTotalActiveAccounts(0);
        setTotalFlaggedAccounts(0);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [search]);

  const filtered = userList.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      String(u.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").includes(search) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    const matchesType = typeFilter === "All" || u.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCount = totalActiveAccounts || userList.filter((u) => u.status === "Active").length;
  const disabledCount = totalFlaggedAccounts || userList.filter((u) => u.status === "Disabled").length;

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditError("");
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone === "n/a" ? "" : (user.phone || ""),
      address: user.address || "",
      role: user.role || "USER",
      status: user.status || "Active"
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser || savingUser) return;
    setSavingUser(true);
    setEditError("");

    try {
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim() || undefined,
        address: editForm.address.trim() || undefined,
        role: editForm.role,
        isActive: editForm.status === "Active",
        isFlagged: editForm.status === "Disabled"
      };

      await userService.updateUser(editingUser.id, payload);

      setUserList((list) =>
        list.map((u) => {
          if (u.id === editingUser.id) {
            return {
              ...u,
              name: editForm.name.trim() || u.name,
              email: editForm.email.trim() || u.email,
              phone: editForm.phone.trim() || u.phone,
              address: editForm.address.trim() || u.address,
              role: editForm.role,
              type: editForm.role === "ADMIN" ? "Business" : "Individual",
              status: editForm.status,
              isActive: editForm.status === "Active",
              isFlagged: editForm.status === "Disabled"
            };
          }
          return u;
        })
      );

      setEditingUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      setEditError(err?.data?.message || err?.message || "Failed to update user details.");
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "Active" ? "Disabled" : "Active";
    setStatusUpdatingId(user.id);
    try {
      await userService.updateUserStatus(user.id, nextStatus);
      setUserList((list) =>
        list.map((item) =>
          item.id === user.id
            ? {
                ...item,
                status: nextStatus,
                isActive: nextStatus === "Active",
                isFlagged: nextStatus === "Disabled"
              }
            : item
        )
      );
      if (nextStatus === "Disabled") {
        setTotalActiveAccounts((prev) => Math.max(0, prev - 1));
        setTotalFlaggedAccounts((prev) => prev + 1);
      } else {
        setTotalActiveAccounts((prev) => prev + 1);
        setTotalFlaggedAccounts((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to update user status:", err);
      alert("Failed to update user status: " + (err?.data?.message || err?.message || "Server error"));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name || user.email || 'this user'}?`)) return;
    try {
      await userService.deleteUser(user.id);
      setUserList((list) => list.filter((item) => item.id !== user.id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3 font-sans">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Manage Citizens & Users</h1>
          <p className="text-sm text-[#6B7280]">Registered accounts across Lagos State</p>
        </div>
        <Link
          to="/signup"
          className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors"
        >
          <Plus className="w-4 h-4" /> Register New Citizen
        </Link>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4 font-sans">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
          <p className="text-xs text-[#6B7280]">TOTAL USERS</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1A1A2E]">{loading ? "–" : totalUsers.toLocaleString()}</p>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
            ) : (
              <UsersIcon className="w-5 h-5 text-[#9CA3AF]" />
            )}
          </div>
        </div>
        <div className="bg-white border-l-4 border-[#16A34A] border-y border-r rounded-xl p-4 shadow-xs">
          <p className="text-xs text-[#6B7280]">ACTIVE ACCOUNTS</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1A1A2E]">{loading ? "–" : activeCount.toLocaleString()}</p>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
            )}
          </div>
        </div>
        <div className="bg-white border-l-4 border-[#DC2626] border-y border-r rounded-xl p-4 shadow-xs">
          <p className="text-xs text-[#6B7280]">FLAGGED / DISABLED</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1A1A2E]">{loading ? "–" : disabledCount.toLocaleString()}</p>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
            ) : (
              <Ban className="w-5 h-5 text-[#DC2626]" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs font-sans">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-sm flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search users by name, email or phone..."
              className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#374151] focus:outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#374151] focus:outline-none"
          >
            <option value="All">Type: All</option>
            <option value="Individual">Individual</option>
            <option value="Business">Business</option>
            <option value="Agent">Agent</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                <th className="pb-3 font-medium">User Profile</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Points</th>
                <th className="pb-3 font-medium">Account Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Joined</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0D631B]" />
                      <span>Loading registered citizens &amp; users...</span>
                    </div>
                  </td>
                </tr>
              ) : pageUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-[#9CA3AF]">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                pageUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#F3F4F6] hover:bg-slate-50/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
                          {u.avatarInitials || (u.name || "U")[0]}
                        </span>
                        <div>
                          <p className="text-[#1A1A2E] font-medium leading-tight">{u.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-[#6B7280]">
                      <p>{u.email}</p>
                      <p className="text-slate-400">{u.phone}</p>
                    </td>
                    <td className="py-3 font-semibold text-[#0D631B]">{(u.points || 0).toLocaleString()} pts</td>
                    <td className="py-3 text-[#374151]">{u.type || "Individual"}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          u.status === "Active"
                            ? "bg-[#E7F7EC] text-[#0D631B]"
                            : "bg-[#FEE2E2] text-[#DC2626]"
                        }`}
                      >
                        {u.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-[#6B7280]">{u.joined || "Oct 2025"}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          aria-label="View user profile"
                          title="View user details & history"
                          onClick={() => setViewingUser(u)}
                          className="text-[#6B7280] hover:text-[#0D631B] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Edit user"
                          title="Edit user profile"
                          onClick={() => handleOpenEdit(u)}
                          className="text-[#6B7280] hover:text-[#0D631B] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={statusUpdatingId === u.id}
                          aria-label={u.status === "Active" ? "Flag / Disable account" : "Activate account"}
                          title={u.status === "Active" ? "Flag / Disable account" : "Activate account"}
                          onClick={() => handleToggleStatus(u)}
                          className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 ${
                            u.status === "Active" ? "text-[#6B7280] hover:text-[#DC2626]" : "text-[#16A34A] hover:text-[#0D631B]"
                          }`}
                        >
                          {statusUpdatingId === u.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                          ) : u.status === "Active" ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          aria-label="Delete user"
                          title="Delete user"
                          onClick={() => handleDeleteUser(u)}
                          className="text-[#6B7280] hover:text-[#DC2626] p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <span className="text-xs font-bold">X</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-[#6B7280]">
            {loading ? (
              "Loading users..."
            ) : (
              `Showing ${pageUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} results`
            )}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-xs border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-[#374151] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`text-xs w-7 h-7 rounded-lg cursor-pointer ${
                  n === currentPage
                    ? "bg-[#0D631B] text-white font-medium"
                    : "border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-xs border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-[#374151] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-base font-bold text-[#1A1A2E]">Edit Citizen Account</h2>
                <p className="text-xs text-[#6B7280]">Update user details and status</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                disabled={savingUser}
                className="text-[#6B7280] hover:text-[#1A1A2E] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="080..."
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B] bg-white"
                  >
                    <option value="USER">Citizen / User</option>
                    <option value="COLLECTOR">Collector</option>
                    <option value="RECYCLING_COMPANY">Recycler</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Street or Area in Lagos"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Account Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B] bg-white"
                >
                  <option value="Active">Active (Account in good standing)</option>
                  <option value="Disabled">Flagged / Disabled (Account suspended)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  disabled={savingUser}
                  className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-4 py-2 bg-[#0D631B] hover:bg-[#0a4f15] text-white rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {savingUser && <Loader2 className="w-4 h-4 animate-spin" />}
                  {savingUser ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View User Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-base font-bold text-[#1A1A2E]">Citizen Account Overview</h2>
                <p className="text-xs text-[#6B7280]">Account #{viewingUser.id} details and credentials</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="text-[#6B7280] hover:text-[#1A1A2E] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <span className="w-14 h-14 rounded-full bg-[#0D631B] text-white text-lg font-bold flex items-center justify-center shrink-0">
                {viewingUser.avatarInitials ||
                  (viewingUser.name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#1A1A2E] truncate">{viewingUser.name}</h3>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      viewingUser.status === "Active"
                        ? "bg-[#E7F7EC] text-[#0D631B]"
                        : "bg-[#FEE2E2] text-[#DC2626]"
                    }`}
                  >
                    {viewingUser.status === "Active" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Ban className="w-3 h-3" />
                    )}
                    {viewingUser.status || "Active"}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Role: <span className="font-medium text-[#374151]">{viewingUser.role || "USER"}</span> • Type:{" "}
                  <span className="font-medium text-[#374151]">{viewingUser.type || "Individual"}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                <p className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" /> ECO POINTS
                </p>
                <p className="text-base font-bold text-[#1A1A2E] mt-1">
                  {(viewingUser.points || 0).toLocaleString()}{" "}
                  <span className="text-xs font-normal text-[#64748B]">pts</span>
                </p>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                <p className="text-[11px] font-semibold text-[#64748B]">TOTAL RECYCLED</p>
                <p className="text-base font-bold text-[#0D631B] mt-1">
                  {viewingUser.totalRecycled ? `${viewingUser.totalRecycled} kg` : "0.0 kg"}
                </p>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 col-span-2 sm:col-span-1">
                <p className="text-[11px] font-semibold text-[#64748B]">JOINED</p>
                <p className="text-sm font-bold text-[#1A1A2E] mt-1 truncate">
                  {viewingUser.joined || "Oct 2025"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 bg-gray-50 border border-[#E5E7EB] rounded-xl p-3.5 text-xs text-[#374151]">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span className="text-[#6B7280] w-14 shrink-0">Email:</span>
                <a
                  href={`mailto:${viewingUser.email}`}
                  className="font-medium text-[#1A1A2E] hover:underline truncate"
                >
                  {viewingUser.email || "N/A"}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span className="text-[#6B7280] w-14 shrink-0">Phone:</span>
                <a
                  href={`tel:${viewingUser.phone}`}
                  className="font-medium text-[#1A1A2E] hover:underline"
                >
                  {viewingUser.phone || "N/A"}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span className="text-[#6B7280] w-14 shrink-0">Address:</span>
                <span className="font-medium text-[#1A1A2E]">
                  {viewingUser.address || "Lagos, Nigeria"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-[#E5E7EB]">
              <Link
                to={`/admin/manage-users/${viewingUser.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D631B] hover:text-[#0a4f15] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Full Activity & History
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingUser;
                    setViewingUser(null);
                    handleOpenEdit(target);
                  }}
                  className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#374151] hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" /> Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => setViewingUser(null)}
                  className="px-4 py-1.5 bg-[#0D631B] hover:bg-[#0a4f15] text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}