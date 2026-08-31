export function maskPhone(digits) {
  const clean = (digits || "").replace(/\D/g, "");
  if (clean.length < 7) return clean;
  return `${clean.slice(0, 4)}****${clean.slice(-3)}`;
}