import { useState, useEffect } from "react";
import { Search, Plus, Users as UsersIcon, CheckCircle2, Ban, Eye, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { userService } from "../../services";

const PAGE_SIZE = 4;

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const users = await userService.getUsers(search);
        setUserList(Array.isArray(users) ? users : []);
      } catch (err) {
        setUserList([]);
      }
    }

    loadUsers();
  }, [search]);

  const filtered = userList.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").includes(search) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    const matchesType = typeFilter === "All" || u.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCount = userList.filter((u) => u.status === "Active").length;
  const disabledCount = userList.filter((u) => u.status === "Disabled").length;

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "Active" ? "Disabled" : "Active";
    try {
      await userService.updateUserStatus(user.id, nextStatus);
      setUserList((list) =>
        list.map((item) =>
          item.id === user.id
            ? { ...item, status: nextStatus, isActive: nextStatus === "Active" }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update user status:", err);
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
            <p className="text-xl font-bold text-[#1A1A2E]">{userList.length.toLocaleString()}</p>
            <UsersIcon className="w-5 h-5 text-[#9CA3AF]" />
          </div>
        </div>
        <div className="bg-white border-l-4 border-[#16A34A] border-y border-r rounded-xl p-4 shadow-xs">
          <p className="text-xs text-[#6B7280]">ACTIVE ACCOUNTS</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1A1A2E]">{activeCount || 12}</p>
            <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
          </div>
        </div>
        <div className="bg-white border-l-4 border-[#DC2626] border-y border-r rounded-xl p-4 shadow-xs">
          <p className="text-xs text-[#6B7280]">FLAGGED / DISABLED</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1A1A2E]">{disabledCount || 1}</p>
            <Ban className="w-5 h-5 text-[#DC2626]" />
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
              {pageUsers.map((u) => (
                <tr key={u.id} className="border-b border-[#F3F4F6] hover:bg-slate-50/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
                        {u.avatarInitials || (u.name || "U")[0]}
                      </span>
                      <div>
                        <p className="text-[#1A1A2E] font-medium leading-tight">{u.name}</p>
                        <p className="text-xs text-[#9CA3AF]">#{u.id}</p>
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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/manage-users/${u.id}`}
                        aria-label="View user profile"
                        className="text-[#6B7280] hover:text-[#0D631B] p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button aria-label="Edit user" className="text-[#6B7280] hover:text-[#0D631B] p-1 cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        aria-label={u.status === "Active" ? "Disable user" : "Activate user"}
                        onClick={() => handleToggleStatus(u)}
                        className="text-[#6B7280] hover:text-[#DC2626] p-1 cursor-pointer"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        aria-label="Delete user"
                        onClick={() => handleDeleteUser(u)}
                        className="text-[#6B7280] hover:text-[#DC2626] p-1 cursor-pointer"
                        title="Delete user"
                      >
                        <span className="text-xs font-bold">X</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-[#9CA3AF]">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-[#6B7280]">
            Showing {pageUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} results
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
    </AdminLayout>
  );
}