import { CheckCircle2, X, BadgeCheck } from "lucide-react";

export default function WaitlistSuccessModal({ email, position, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden">
        {/* Green header */}
        <div className="relative bg-[#0D631B] px-6 py-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-white/70"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-flex w-14 h-14 rounded-full bg-white items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-[#0D631B]" />
          </span>

          <h2 className="mt-3 text-lg font-bold text-white">
            You are on the List! 🎉
          </h2>
        </div>

        {/* White body */}
        <div className="px-6 py-6 text-center">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#4338CA] bg-[#EFECFF] px-3 py-1 rounded-full">
            <BadgeCheck className="w-3.5 h-3.5" />
            Successfully Registered
          </span>

          <p className="mt-3 text-sm text-[#374151]">
            We've secured a spot for{" "}
            <span className="font-semibold">{email}</span>. You'll be
            notified as soon as EcoBridge launches in Lagos.
          </p>

          <div className="mt-5 bg-[#E7F7EC] rounded-xl py-4">
            <p className="text-xs font-semibold text-[#0D631B] tracking-wide">
              YOUR POSITION
            </p>
            <p className="mt-1 text-2xl font-bold text-[#0D631B]">
              #{position}
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-5 text-sm text-[#6B7280] hover:text-[#374151]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}