import { useState } from "react";
import {
  Search,
  QrCode,
  Recycle,
  FileText,
  Hammer,
  Wine,
  Cpu,
  Layers,
  Calculator,
  ClipboardList,
  Info,
  CheckCircle2,
  Copy,
  RotateCcw,
  UserCheck,
  Award,
  ArrowRight,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";

const MOCK_USERS = [
  { id: "ECO-8492", name: "John Doe", balance: 1250, avatarInitials: "JD" },
  { id: "ECO-3311", name: "Ada Obi", balance: 890, avatarInitials: "AO" },
  { id: "ECO-7765", name: "Michael T.", balance: 2040, avatarInitials: "MT" },
];

// Points-per-kg rates. Plastic/Paper/Glass match your consumer "Value of
// Your Waste" table — Electronics and Mixed are placeholder rates since
// those weren't shown there; adjust once you have real figures.
const WASTE_CATEGORIES = [
  { key: "Plastic", icon: Recycle, rate: 50 },
  { key: "Paper", icon: FileText, rate: 30 },
  { key: "Metal", icon: Hammer, rate: 80 },
  { key: "Glass", icon: Wine, rate: 20 },
  { key: "Electronics", icon: Cpu, rate: 100 },
  { key: "Mixed", icon: Layers, rate: 25 },
];

const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 1000 },
  { name: "Gold", min: 2000 },
  { name: "Platinum", min: 5000 },
];

function getTierInfo(balance) {
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (balance >= tier.min) current = tier;
  }
  const next = TIERS[TIERS.indexOf(current) + 1] || null;
  const pointsNeeded = next ? next.min - balance : 0;
  const progressPct = next ? Math.min(100, ((balance - current.min) / (next.min - current.min)) * 100) : 100;
  return { tierName: current.name, next, pointsNeeded, progressPct };
}

export default function RecordWaste() {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [category, setCategory] = useState(null);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState(null);

  const matches = query.trim()
    ? MOCK_USERS.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const selectedCategory = WASTE_CATEGORIES.find((c) => c.key === category);
  const weightNum = parseFloat(weight) || 0;
  const estimatedPoints = selectedCategory ? Math.round(weightNum * selectedCategory.rate) : 0;

  const stepStatus = {
    user: selectedUser ? "done" : "active",
    waste: !selectedUser ? "upcoming" : showConfirm ? "done" : "active",
    confirm: showConfirm ? "active" : "upcoming",
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    // TODO: replace with a real call to your Node.js record-collection endpoint
    const transactionId = `ECO-TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    setResult({
      transactionId,
      pointsAwarded: estimatedPoints,
      newBalance: selectedUser.balance + estimatedPoints,
      userName: selectedUser.name,
    });
  };

  const handleReset = () => {
    setSelectedUser(null);
    setCategory(null);
    setWeight("");
    setNote("");
    setShowConfirm(false);
    setResult(null);
    setQuery("");
  };

  // ----- Success screen -----
  if (result) {
    const tier = getTierInfo(result.newBalance);
    return (
      <AdminLayout>
        <div className="flex items-start gap-2 bg-[#E7F7EC] text-[#0D631B] text-sm rounded-lg px-4 py-3">
          <CheckCircle2 className="w-4 h-4 mt-0.5" />
          <div>
            <p className="font-semibold">Collection Recorded Successfully!</p>
            <p className="text-xs">
              {result.pointsAwarded} points added to {result.userName}.
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-xl font-bold text-[#1A1A2E]">Record Waste</h1>

        <div className="mt-4 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border-2 border-[#0D631B] rounded-xl p-8 text-center">
            <span className="mx-auto w-14 h-14 rounded-full bg-[#E7F7EC] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-[#0D631B]" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-[#1A1A2E]">Transaction Complete</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              The waste collection has been successfully logged.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 text-sm font-mono text-[#374151]">
              TRANSACTION ID {result.transactionId}
              <button
                onClick={() => navigator.clipboard.writeText(result.transactionId)}
                aria-label="Copy transaction ID"
                className="text-[#6B7280] hover:text-[#374151]"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15]"
              >
                <RotateCcw className="w-4 h-4" /> Record Another
              </button>
              <a
                href="/admin/manage-users"
                className="flex items-center gap-1.5 bg-[#EFECFF] text-[#4338CA] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#e3ddfd]"
              >
                <UserCheck className="w-4 h-4" /> View User Profile
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-[#0D631B]" /> Rewards Summary
            </p>

            <div className="bg-[#E7F7EC] rounded-lg p-3 text-center">
              <p className="text-xs text-[#0D631B] font-medium">POINTS AWARDED</p>
              <p className="mt-1 text-2xl font-bold text-[#0D631B]">+{result.pointsAwarded} pts</p>
            </div>

            <p className="mt-4 text-xs text-[#6B7280]">{result.userName}'s New Balance</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-[#1A1A2E]">{result.newBalance.toLocaleString()} pts</p>
              <span className="text-xs font-medium text-[#0D631B] bg-[#E7F7EC] px-2 py-0.5 rounded-full">
                {tier.tierName} Tier
              </span>
            </div>

            {tier.next && (
              <div className="mt-2">
                <p className="text-xs text-[#6B7280] mb-1">Progress to {tier.next.name} Tier</p>
                <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full bg-[#0D631B]" style={{ width: `${tier.progressPct}%` }} />
                </div>
                <p className="mt-1 text-xs text-[#6B7280] text-right">{tier.pointsNeeded} pts needed</p>
              </div>
            )}

            <p className="mt-4 text-xs text-[#9CA3AF]">
              An SMS notification has been sent to the user with their updated balance.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ----- Main form -----
  return (
    <AdminLayout>
      {/* Stepper */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {[
          { key: "user", label: "User" },
          { key: "waste", label: "Waste" },
          { key: "confirm", label: "Confirm" },
        ].map((s, i, arr) => (
          <div key={s.key} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  stepStatus[s.key] === "done"
                    ? "bg-[#0D631B] text-white"
                    : stepStatus[s.key] === "active"
                    ? "border-2 border-[#0D631B] text-[#0D631B]"
                    : "border-2 border-[#E5E7EB] text-[#9CA3AF]"
                }`}
              >
                {stepStatus[s.key] === "done" ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </span>
              <span className="text-xs text-[#6B7280]">{s.label}</span>
            </div>
            {i < arr.length - 1 && (
              <div
                className={`w-16 h-0.5 ${
                  stepStatus[s.key] === "done" ? "bg-[#0D631B]" : "bg-[#E5E7EB]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 1. User Search */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1A1A2E]">1. User Search</p>
              <button type="button" className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
                <QrCode className="w-3.5 h-3.5" /> Scan QR Code
              </button>
            </div>

            <div className="relative mt-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedUser(null);
                }}
                placeholder="Search by name or ID..."
                className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            </div>

            {!selectedUser &&
              matches.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className="mt-2 w-full flex items-center justify-between border border-[#E5E7EB] rounded-lg px-3 py-2.5 hover:border-[#0D631B]/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
                      {u.avatarInitials}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#1A1A2E]">{u.name}</p>
                      <p className="text-xs text-[#6B7280]">ID: {u.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6B7280]">Current Balance</p>
                    <p className="text-sm font-semibold text-[#0D631B]">
                      {u.balance.toLocaleString()} pts
                    </p>
                  </div>
                </button>
              ))}

            {selectedUser && (
              <div className="mt-2 flex items-center justify-between bg-[#E7F7EC] border border-[#0D631B]/20 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
                    {selectedUser.avatarInitials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">{selectedUser.name}</p>
                    <p className="text-xs text-[#6B7280]">ID: {selectedUser.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-[#6B7280]">Current Balance</p>
                    <p className="text-sm font-semibold text-[#0D631B]">
                      {selectedUser.balance.toLocaleString()} pts
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#0D631B]" />
                </div>
              </div>
            )}
          </div>

          {/* 2. Waste Details */}
          <form
            onSubmit={handleContinue}
            className={`bg-white border border-[#E5E7EB] rounded-xl p-5 ${
              !selectedUser ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1A1A2E]">2. Waste Details</p>
              {!selectedUser && (
                <span className="text-xs text-[#9CA3AF] bg-gray-100 px-2 py-0.5 rounded-full">
                  Step Locked
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              Select the primary waste category being submitted.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {WASTE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.key;
                return (
                  <button
                    type="button"
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`flex flex-col items-center gap-1.5 border rounded-lg py-3 text-xs ${
                      isSelected
                        ? "border-[#0D631B] bg-[#E7F7EC] text-[#0D631B]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:border-[#0D631B]/30"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {cat.key}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Weight (kg)</label>
              <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden focus-within:ring-2 focus-within:ring-[#0D631B]/40">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 text-sm focus:outline-none"
                />
                <span className="flex items-center px-3 bg-gray-50 text-sm text-[#374151]">kg</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Staff Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any observational notes about the collection..."
                rows={2}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!category || !weightNum}
                className="flex items-center gap-1.5 text-sm bg-[#0D631B] text-white px-4 py-2 rounded-lg hover:bg-[#0a4f15] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 3. Confirm — appears once Continue to Details is clicked */}
          {showConfirm && (
            <div className="bg-white border-2 border-[#0D631B] rounded-xl p-5">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-1">3. Confirm Collection</p>
              <p className="text-xs text-[#6B7280] mb-4">
                Review the details below before recording this transaction.
              </p>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">User</span>
                  <span className="text-[#1A1A2E] font-medium">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Category</span>
                  <span className="text-[#1A1A2E] font-medium">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Weight</span>
                  <span className="text-[#1A1A2E] font-medium">{weightNum} kg</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold">
                  <span className="text-[#1A1A2E]">Points to Award</span>
                  <span className="text-[#0D631B]">+{estimatedPoints} pts</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="mt-5 w-full bg-[#0D631B] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#0a4f15]"
              >
                Confirm &amp; Record Collection
              </button>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-[#E7F7EC] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#0D631B] flex items-center gap-1.5 mb-3">
              <Calculator className="w-4 h-4" /> Live Calculation
            </p>
            <p className="text-xs text-[#6B7280] text-center">ESTIMATED POINTS</p>
            <p className="text-3xl font-bold text-[#0D631B] text-center">
              {selectedCategory && weightNum ? `+${estimatedPoints}` : "—"}
            </p>
            <p className="text-xs text-[#6B7280] text-center mt-1">
              {weightNum || 0}kg × {selectedCategory ? selectedCategory.rate : 0}pts
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-1.5 mb-3">
              <ClipboardList className="w-4 h-4" /> Transaction Draft
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">User</span>
                <span className="text-[#1A1A2E]">{selectedUser ? selectedUser.name : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Type</span>
                <span className="text-[#1A1A2E]">{category || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Weight</span>
                <span className="text-[#1A1A2E]">{weightNum ? `${weightNum} kg` : "—"}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1.5 border-t border-[#E5E7EB]">
                <span className="text-[#1A1A2E]">Total Points</span>
                <span className="text-[#0D631B]">{estimatedPoints ? `+${estimatedPoints}` : "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 bg-[#EFF6FF] text-[#1D4ED8] text-xs rounded-lg px-3 py-3">
            <Info className="w-4 h-4 shrink-0" />
            Ensure the user ID matches the physical ID presented before confirming the transaction
            weight.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}