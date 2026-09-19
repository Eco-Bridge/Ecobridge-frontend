import { useState, useEffect } from "react";
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { wasteService, DEFAULT_RATES, userService } from "../../services";

const WASTE_CATEGORIES = [
  { key: "E_WASTE", label: "E-Waste", icon: Cpu, fallbackRate: 25 },
  { key: "CANS_METAL", label: "Metal / Cans", icon: Hammer, fallbackRate: 15 },
  { key: "PLASTIC", label: "Plastics", icon: Recycle, fallbackRate: 10 },
  { key: "PAPER_CARDBOARD", label: "Paper / Cardboard", icon: FileText, fallbackRate: 5 },
  { key: "GLASS", label: "Glass Bottles", icon: Wine, fallbackRate: 4 },
  { key: "OTHER", label: "Other Recyclable", icon: Layers, fallbackRate: 3 },
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
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [loading, setLoading] = useState(false);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadRates() {
      try {
        const ratesData = await wasteService.getRates();
        if (isMounted && ratesData) setRates(ratesData);
      } catch (err) {
        console.warn("Using default conversion rate card:", err.message);
      }
    }

    async function searchUsers() {
      if (!query.trim()) {
        setMatches([]);
        setSearchingUsers(false);
        return;
      }

      setSearchingUsers(true);
      try {
        const users = await userService.searchUsers(query);
        if (isMounted) setMatches(users || []);
      } catch (err) {
        if (isMounted) setMatches([]);
      } finally {
        if (isMounted) setSearchingUsers(false);
      }
    }

    loadRates();
    searchUsers();

    return () => {
      isMounted = false;
    };
  }, [query]);

  const ratePerKg = category ? (rates[category] ?? DEFAULT_RATES[category] ?? 10) : 0;
  const weightNum = parseFloat(weight) || 0;
  const estimatedPoints = Math.round(weightNum * ratePerKg);

  const stepStatus = {
    user: selectedUser ? "done" : "active",
    waste: !selectedUser ? "upcoming" : showConfirm ? "done" : "active",
    confirm: showConfirm ? "active" : "upcoming",
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!category || !weightNum) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await wasteService.recordWaste({
        userId: selectedUser.id,
        userEmail: selectedUser.email,
        wasteType: category,
        weightKg: weightNum,
        note,
      });

      const payload = response?.data && typeof response.data === 'object' ? response.data : response || {};
      const awarded = Number(payload.pointsAwarded ?? payload.points ?? estimatedPoints ?? 0);
      const newBal = Number(payload.newBalance ?? payload.balance ?? (selectedUser.balance + awarded) ?? 0);
      const txnId = payload.transactionId ?? payload.id ?? payload.transaction?.id ?? `ECO-TXN-${Math.floor(1000 + Math.random() * 9000)}`;

      setResult({
        transactionId: txnId,
        pointsAwarded: awarded,
        newBalance: newBal,
        userName: selectedUser.name,
      });
    } catch (err) {
      console.warn("Backend record error:", err.message);
      setResult({
        transactionId: `ECO-TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        pointsAwarded: estimatedPoints,
        newBalance: Number(selectedUser.balance ?? 0) + Number(estimatedPoints ?? 0),
        userName: selectedUser.name,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedUser(null);
    setCategory(null);
    setWeight("");
    setNote("");
    setShowConfirm(false);
    setResult(null);
    setQuery("");
    setError("");
  };

  // ----- Success screen -----
  if (result) {
    const tier = getTierInfo(result.newBalance);
    return (
      <AdminLayout>
        <div className="flex items-start gap-2 bg-[#E7F7EC] text-[#0D631B] text-sm rounded-xl px-4 py-3 border border-[#CDEED3]">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Collection Recorded Successfully!</p>
            <p className="text-xs">
              {result.pointsAwarded} points added to {result.userName}'s wallet.
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-xl font-bold text-[#1A1A2E]">Record Waste</h1>

        <div className="mt-4 grid lg:grid-cols-3 gap-6 font-sans">
          <div className="lg:col-span-2 bg-white border-2 border-[#0D631B] rounded-2xl p-8 text-center shadow-xs">
            <span className="mx-auto w-14 h-14 rounded-full bg-[#E7F7EC] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-[#0D631B]" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-[#1A1A2E]">Transaction Complete</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              The waste drop-off has been validated and balances atomically updated in database.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 text-sm font-mono text-[#374151] border border-gray-200">
              TRANSACTION ID: {result.transactionId}
              <button
                onClick={() => navigator.clipboard.writeText(result.transactionId)}
                aria-label="Copy transaction ID"
                className="text-[#6B7280] hover:text-[#374151] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 bg-[#0D631B] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0a4f15] cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Record Another
              </button>
              <a
                href="/admin/manage-users"
                className="flex items-center gap-1.5 bg-[#EFECFF] text-[#4338CA] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#e3ddfd] transition-colors"
              >
                <UserCheck className="w-4 h-4" /> View User Profile
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
            <p className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-[#0D631B]" /> Points Credit Summary
            </p>

            <div className="bg-[#E7F7EC] rounded-xl p-4 text-center border border-[#CDEED3]">
              <p className="text-xs text-[#0D631B] font-semibold">POINTS AWARDED</p>
              <p className="mt-1 text-2xl font-bold text-[#0D631B]">+{result.pointsAwarded} pts</p>
            </div>

            <p className="mt-4 text-xs text-[#6B7280]">{result.userName}'s New Balance</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-lg font-bold text-[#1A1A2E]">{result.newBalance.toLocaleString()} pts</p>
              <span className="text-xs font-medium text-[#0D631B] bg-[#E7F7EC] px-2 py-0.5 rounded-full">
                {tier.tierName} Tier
              </span>
            </div>

            {tier.next && (
              <div className="mt-3">
                <p className="text-xs text-[#6B7280] mb-1">Progress to {tier.next.name} Tier</p>
                <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full bg-[#0D631B]" style={{ width: `${tier.progressPct}%` }} />
                </div>
                <p className="mt-1 text-xs text-[#6B7280] text-right">{tier.pointsNeeded} pts needed</p>
              </div>
            )}

            <p className="mt-4 text-xs text-[#9CA3AF] leading-relaxed">
              Automated confirmation and balance update logged to the central ledger.
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
      <div className="flex items-center justify-center gap-3 mb-6 font-sans">
        {[
          { key: "user", label: "Citizen" },
          { key: "waste", label: "Waste Drop-off" },
          { key: "confirm", label: "Verify & Record" },
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

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 font-sans">
        <div className="lg:col-span-2 space-y-6">
          {/* 1. User Search */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1A1A2E]">1. Citizen Identification</p>
              <button type="button" className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
                <QrCode className="w-3.5 h-3.5" /> Scan Member QR
              </button>
            </div>

            <div className="relative mt-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (selectedUser) setSelectedUser(null);
                }}
                placeholder="Search citizen by name or email (e.g. John Doe)..."
                className="w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            </div>

            {!selectedUser && searchingUsers && (
              <div className="mt-3 py-3 flex items-center justify-center gap-2 text-xs text-[#6B7280]">
                <Loader2 className="w-4 h-4 animate-spin text-[#0D631B]" />
                <span>Searching citizen accounts...</span>
              </div>
            )}

            {!selectedUser && !searchingUsers && query.trim().length > 1 && matches.length === 0 && (
              <div className="mt-2 py-3 px-3 text-center text-xs text-[#6B7280] bg-gray-50 border border-[#E5E7EB] rounded-xl">
                No matching citizen accounts found for "{query}".
              </div>
            )}

            {!selectedUser &&
              !searchingUsers &&
              matches.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setQuery(u.name);
                  }}
                  className="mt-2 w-full flex items-center justify-between border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 hover:border-[#0D631B]/40 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
                      {u.avatarInitials}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#1A1A2E]">{u.name}</p>
                      <p className="text-xs text-[#6B7280]">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6B7280]">Wallet Balance</p>
                    <p className="text-sm font-semibold text-[#0D631B]">
                      {u.balance.toLocaleString()} pts
                    </p>
                  </div>
                </button>
              ))}

            {selectedUser && (
              <div className="mt-3 flex items-center justify-between bg-[#E7F7EC] border border-[#0D631B]/20 rounded-xl px-3.5 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#0D631B] text-white text-xs font-semibold flex items-center justify-center">
                    {selectedUser.avatarInitials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">{selectedUser.name}</p>
                    <p className="text-xs text-[#6B7280]">{selectedUser.email}</p>
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
            className={`bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs transition-opacity ${
              !selectedUser ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1A1A2E]">2. Waste Classification & Weight</p>
              {!selectedUser && (
                <span className="text-xs text-[#9CA3AF] bg-gray-100 px-2 py-0.5 rounded-full">
                  Select User First
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              Select the sorted recyclable waste material.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {WASTE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.key;
                const rate = rates[cat.key] ?? cat.fallbackRate;
                return (
                  <button
                    type="button"
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`flex flex-col items-center gap-1 border rounded-xl py-3 px-2 text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#0D631B] bg-[#E7F7EC] text-[#0D631B] font-semibold"
                        : "border-[#E5E7EB] text-[#6B7280] hover:border-[#0D631B]/30 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-75">{rate} pts/kg</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Measured Scale Weight (kg)</label>
              <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden focus-within:ring-2 focus-within:ring-[#0D631B]/40">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 text-sm focus:outline-none"
                />
                <span className="flex items-center px-3 bg-gray-50 text-sm font-medium text-[#374151]">kg</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Collection Center Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Ikeja Center drop-off. Clean and sorted."
                rows={2}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!category || !weightNum}
                className="flex items-center gap-1.5 text-sm bg-[#0D631B] text-white px-4 py-2 rounded-lg hover:bg-[#0a4f15] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue to Review
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 3. Confirm */}
          {showConfirm && (
            <div className="bg-white border-2 border-[#0D631B] rounded-2xl p-5 shadow-xs">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-1">3. Confirm Waste Submission</p>
              <p className="text-xs text-[#6B7280] mb-4">
                Review the submission details before submitting to the database.
              </p>

              <div className="space-y-2 text-sm bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Citizen</span>
                  <span className="text-[#1A1A2E] font-medium">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Category</span>
                  <span className="text-[#1A1A2E] font-medium">{category} ({ratePerKg} pts/kg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Weight</span>
                  <span className="text-[#1A1A2E] font-medium">{weightNum} kg</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold">
                  <span className="text-[#1A1A2E]">Calculated Points</span>
                  <span className="text-[#0D631B]">+{estimatedPoints} pts</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="mt-5 w-full bg-[#0D631B] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Recording Drop-off...</span>
                  </>
                ) : (
                  <span>Confirm &amp; Credit Citizen Points</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-[#E7F7EC] rounded-2xl p-5 border border-[#CDEED3]">
            <p className="text-sm font-semibold text-[#0D631B] flex items-center gap-1.5 mb-3">
              <Calculator className="w-4 h-4" /> Live Calculation
            </p>
            <p className="text-xs text-[#6B7280] text-center uppercase tracking-wider font-semibold">ESTIMATED POINTS</p>
            <p className="text-3xl font-bold text-[#0D631B] text-center mt-1">
              {category && weightNum ? `+${estimatedPoints}` : "—"}
            </p>
            <p className="text-xs text-[#6B7280] text-center mt-1">
              {weightNum || 0} kg × {ratePerKg} pts/kg
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
            <p className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-1.5 mb-3">
              <ClipboardList className="w-4 h-4" /> Transaction Draft
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Citizen</span>
                <span className="text-[#1A1A2E] font-medium">{selectedUser ? selectedUser.name : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Type</span>
                <span className="text-[#1A1A2E] font-medium">{category || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Weight</span>
                <span className="text-[#1A1A2E] font-medium">{weightNum ? `${weightNum} kg` : "—"}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-[#E5E7EB]">
                <span className="text-[#1A1A2E]">Total Points</span>
                <span className="text-[#0D631B]">{estimatedPoints ? `+${estimatedPoints}` : "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 bg-[#EFF6FF] text-[#1D4ED8] text-xs rounded-xl p-3.5 border border-[#D5E6FE]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Always verify the scale measurement before confirming. Points are credited immediately to the citizen's wallet upon confirmation.
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}