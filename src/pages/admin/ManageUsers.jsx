import { useState } from "react";
import { Search, Plus, Users as UsersIcon, CheckCircle2, Ban, Eye, Pencil } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { USERS } from "../../data/mockUsers";

const PAGE_SIZE = 2; // small on purpose so pagination is actually visible with only 4 mock users

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    const matchesType = typeFilter === "All" || u.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Any change to the filters should reset back to page 1, otherwise you
  // could land on a page that no longer has any results on it.
  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  const updateStatus = (value) => {
    setStatusFilter(value);
    setPage(1);
  };
  const updateType = (value) => {
    setTypeFilter(value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-[#1A1A2E]">Manage Users</h1>
        <button className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15]">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 overflow-hidden">
          <p className="text-xs text-[#6B7280]">TOTAL USERS</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1A1A2E]">12,450</p>
            <UsersIcon className="w-5 h-5 text-[#9CA3AF]" />
          </div>
        </div>
        <div className="bg-white border-l-4 border-[#16A34A] border-y border-r rounded-xl p-4 overflow-hidden">
          <p className="text-xs text-[#6B7280]">ACTIVE</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1A1A2E]">11,892</p>
            <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
          </div>
        </div>
        <div className="bg-white border-l-4 border-[#DC2626] border-y border-r rounded-xl p-4 overflow-hidden">
          <p className="text-xs text-[#6B7280]">DISABLED</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1A1A2E]">558</p>
            <Ban className="w-5 h-5 text-[#DC2626]" />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-sm flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search users by name, ID or phone..."
              className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => updateStatus(e.target.value)}
            className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => updateType(e.target.value)}
            className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white focus:outline-none"
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
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Contact</th>
                <th className="pb-2 font-medium">Points</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Joined</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageUsers.map((u) => (
                <tr key={u.id} className="border-b border-[#F3F4F6]">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
                        {u.avatarInitials}
                      </span>
                      <div>
                        <p className="text-[#1A1A2E] font-medium">{u.name}</p>
                        <p className="text-xs text-[#9CA3AF]">#{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-[#6B7280]">
                    <p>{u.email}</p>
                    <p>{u.phone}</p>
                  </td>
                  <td className="py-3 text-[#374151]">{u.points.toLocaleString()}</td>
                  <td className="py-3 text-[#374151]">{u.type}</td>
                  <td className="py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        u.status === "Active"
                          ? "bg-[#E7F7EC] text-[#0D631B]"
                          : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 text-[#6B7280]">{u.joined}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/manage-users/${u.id}`}
                        aria-label="View user"
                        className="text-[#6B7280] hover:text-[#0D631B]"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button aria-label="Edit user" className="text-[#6B7280] hover:text-[#0D631B]">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button aria-label="Disable user" className="text-[#6B7280] hover:text-[#DC2626]">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-[#9CA3AF]">
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
              className="text-xs border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-[#374151] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`text-xs w-7 h-7 rounded-lg ${
                  n === currentPage
                    ? "bg-[#0D631B] text-white"
                    : "border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-xs border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-[#374151] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}