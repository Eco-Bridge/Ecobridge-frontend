import { Leaf } from "lucide-react";

export default function Logo({ variant = "dark" }) {
  const isLight = variant === "light";
  return (
    <div className="flex items-center justify-center gap-2">
      <Leaf className={`w-5 h-5 ${isLight ? "text-white" : "text-[#0D631B]"}`} />
      <span
        className={`font-semibold ${isLight ? "text-white" : "text-[#1A1A2E]"}`}
      >
        EcoBridge
      </span>
    </div>
  );
}