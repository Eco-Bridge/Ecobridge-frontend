export function maskPhone(digits) {
  const clean = (digits || "").replace(/\D/g, "");
  if (clean.length < 7) return clean;
  return `${clean.slice(0, 4)}****${clean.slice(-3)}`;
}

export function toNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
    const numericPrefix = parseFloat(value);
    if (Number.isFinite(numericPrefix)) return numericPrefix;
  }

  if (value && typeof value === "object") {
    for (const key of [
      "balance",
      "available",
      "amount",
      "total",
      "value",
      "points",
      "pointsBalance",
      "totalRecycled",
      "totalRecycledKg",
      "kgRecycled",
      "totalWasteKg",
      "recycledKg",
      "wasteKg",
    ]) {
      const result = toNumber(value[key], NaN);
      if (Number.isFinite(result)) return result;
    }
  }

  return fallback;
}