import { useState } from "react";
import { Calendar, Scale, Star, Search, Download, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const STATS = [
  { icon: Calendar, label: "Total Visits", value: "8" },
  { icon: Scale, label: "Total Weight", value: "25.5 kg" },
  { icon: Star, label: "Total Points", value: "1,250 pts" },
];

const WASTE_TYPE_STYLES = {
  Plastic: { bg: "#DBEAFE", text: "#3B82F6" },
  Paper: { bg: "#FEF3C7", text: "#B45309" },
  Glass: { bg: "#CCFBF1", text: "#0D9488" },
  Metal: { bg: "#F3F4F6", text: "#6B7280" },
};

const RECORDS = [
  { date: "Oct 24, 2024", types: ["Plastic"], weight: "4.2 kg", points: "+210 pts" },
  { date: "Oct 18, 2024", types: ["Paper"], weight: "2.6 kg", points: "+125 pts" },
  { date: "Oct 10, 2024", types: ["Glass", "Metal"], weight: "5.1 kg", points: "+255 pts" },
  { date: "Sep 28, 2024", types: ["Plastic"], weight: "3.0 kg", points: "+150 pts" },
  { date: "Sep 15, 2024", types: ["Paper"], weight: "1.8 kg", points: "+90 pts" },
  { date: "Sep 02, 2024", types: ["Metal"], weight: "0.9 kg", points: "+45 pts" },
  { date: "Aug 20, 2024", types: ["Plastic"], weight: "4.5 kg", points: "+225 pts" },
  { date: "Aug 05, 2024", types: ["Glass"], weight: "2.2 kg", points: "+110 pts" },
  { date: "Jul 22, 2024", types: ["Paper"], weight: "1.3 kg", points: "+65 pts" },
  { date: "Jul 10, 2024", types: ["Plastic", "Metal"], weight: "3.8 kg", points: "+190 pts" },
];

export default function RecycleHistory() {
  const [search, setSearch] = useState("");

  const filtered = RECORDS.filter(
    (r) =>
      r.date.toLowerCase().includes(search.toLowerCase()) ||
      r.types.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Recycling History</h1>
          <p className="text-sm text-[#6B7280]">Track all your past recycling activity</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Icon className="w-4 h-4 text-[#0D631B]" />
                {stat.label}
              </div>
              <p className="mt-2 text-xl font-bold text-[#1A1A2E]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#6B7280] border-b border-[#E5E7EB]">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Waste Type</th>
                <th className="pb-2 font-medium">Weight</th>
                <th className="pb-2 font-medium">Points Earned</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.date + r.weight} className="border-b border-[#F3F4F6]">
                  <td className="py-3 text-[#1A1A2E]">{r.date}</td>
                  <td className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {r.types.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: WASTE_TYPE_STYLES[t].bg,
                            color: WASTE_TYPE_STYLES[t].text,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-[#374151]">{r.weight}</td>
                  <td className="py-3 font-medium text-[#0D631B]">{r.points}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-[#0D631B] bg-[#E7F7EC] px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-[#6B7280]">
          Showing {filtered.length} of 24 records
        </p>
      </div>
    </DashboardLayout>
  );
}