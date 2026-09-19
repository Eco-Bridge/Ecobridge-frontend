import { useState, useEffect } from "react";
import { Calendar, Scale, Star, Search, Download, CheckCircle2, Loader2, Filter } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { wasteService } from "../services";
import { useAuth } from "../context/AuthContext";
import { toNumber } from "../utils/formatters";

const WASTE_TYPE_STYLES = {
  PLASTIC: { bg: "#DBEAFE", text: "#1D4ED8", label: "Plastic" },
  Plastic: { bg: "#DBEAFE", text: "#1D4ED8", label: "Plastic" },
  CANS_METAL: { bg: "#F3F4F6", text: "#374151", label: "Metal / Cans" },
  Metal: { bg: "#F3F4F6", text: "#374151", label: "Metal" },
  PAPER_CARDBOARD: { bg: "#FEF3C7", text: "#B45309", label: "Paper / Cardboard" },
  Paper: { bg: "#FEF3C7", text: "#B45309", label: "Paper" },
  GLASS: { bg: "#CCFBF1", text: "#0D9488", label: "Glass" },
  Glass: { bg: "#CCFBF1", text: "#0D9488", label: "Glass" },
  E_WASTE: { bg: "#EFECFF", text: "#6D28D9", label: "E-Waste" },
  OTHER: { bg: "#E7F7EC", text: "#0D631B", label: "Other" },
};

export default function RecycleHistory() {
  const [search, setSearch] = useState("");
  const [wasteTypeFilter, setWasteTypeFilter] = useState("ALL");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      setLoading(true);
      setError(null);
      try {
        const params = wasteTypeFilter === "ALL" ? {} : { wasteType: wasteTypeFilter };
        const response = await wasteService.getMyHistory(params);
        const list = Array.isArray(response)
          ? response
          : response?.history || response?.submissions || response?.records || response?.data?.history || response?.data?.submissions || response?.data?.records || response?.data || [];

        if (isMounted) {
          const formatted = list.map((item, idx) => ({
            id: item.id || item._id || `hist-${idx}`,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : item.date || "Unknown date",
            types: item.wasteType ? [item.wasteType] : item.types || (item.material ? [item.material] : []),
            weightNum: toNumber(item.weightKg ?? item.weight),
            pointsNum: toNumber(item.pointsAwarded ?? item.points),
            status: item.status || "COMPLETED",
          }));
          setHistory(formatted);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load recycling history.");
          setHistory([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [wasteTypeFilter]);

  const filtered = history.filter((r) => {
    const matchesSearch =
      r.date.toLowerCase().includes(search.toLowerCase()) ||
      r.types.join(" ").toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const totalWeight = history.reduce((acc, curr) => acc + curr.weightNum, 0);
  const totalPoints = history.reduce((acc, curr) => acc + curr.pointsNum, 0);

  const stats = [
    { icon: Calendar, label: "Total Drop-offs", value: `${history.length} Visits` },
    { icon: Scale, label: "Total Weight Recycled", value: `${totalWeight.toFixed(1)} kg` },
    { icon: Star, label: "Total Points Earned", value: `${totalPoints.toLocaleString()} pts` },
  ];

  const handleDownload = () => {
    const csvRows = [
      ["Date", "Waste Type", "Weight", "Points Earned", "Status"],
      ...filtered.map((r) => [r.date, r.types.join("; "), r.weight, r.points, "Completed"]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ecobridge_recycling_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Recycling History</h1>
          <p className="text-sm text-[#6B7280]">Track all your past recycling drop-offs and earned points</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export CSV Report
        </button>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
          {error}
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <Icon className="w-4 h-4 text-[#0D631B]" />
                  {stat.label}
                </div>
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />}
              </div>
              <p className="mt-2 text-xl font-bold text-[#1A1A2E]">{loading ? "–" : stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-xs flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history by date or material..."
              className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <select
              value={wasteTypeFilter}
              onChange={(e) => setWasteTypeFilter(e.target.value)}
              className="text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#374151] focus:outline-none"
            >
              <option value="ALL">All Materials</option>
              <option value="PLASTIC">Plastic</option>
              <option value="CANS_METAL">Cans & Metal</option>
              <option value="PAPER_CARDBOARD">Paper & Cardboard</option>
              <option value="GLASS">Glass</option>
              <option value="E_WASTE">E-Waste</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col justify-center items-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0D631B]" />
            <p className="text-sm font-medium">Loading recycling records...</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Material Type</th>
                  <th className="pb-3 font-medium">Weight</th>
                  <th className="pb-3 font-medium">Points Earned</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-[#F3F4F6] hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 text-[#1A1A2E] font-medium">{r.date}</td>
                    <td className="py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {r.types.map((t) => {
                          const style = WASTE_TYPE_STYLES[t] || WASTE_TYPE_STYLES.OTHER;
                          return (
                            <span
                              key={t}
                              className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: style.bg,
                                color: style.text,
                              }}
                            >
                              {style.label || t}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 text-[#374151]">{r.weightNum.toFixed(2)} kg</td>
                    <td className="py-3 font-semibold text-[#0D631B]">+{r.pointsNum.toLocaleString()} pts</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-[#0D631B] bg-[#E7F7EC] px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 className="w-3 h-3" /> {r.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                      No recycling records match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-[#6B7280]">
          Showing {filtered.length} of {history.length} records
        </p>
      </div>
    </DashboardLayout>
  );
}