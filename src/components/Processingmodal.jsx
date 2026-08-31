export default function ProcessingModal({ reward }) {
  const isAirtime = reward.category === "Airtime";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full border-4 border-[#E7F7EC] border-t-[#0D631B] animate-spin" />

        <h2 className="mt-4 text-base font-bold text-[#1A1A2E]">
          {isAirtime ? `Redeeming ${reward.name}` : "Generating Your Coupon"}
        </h2>

        <p className="mt-2 text-sm text-[#6B7280]">
          {isAirtime
            ? "We're processing your redemption. This may take a few moments. We'll notify you once it's ready."
            : `We're generating your ${reward.name} coupon.`}
        </p>

        {!isAirtime && (
          <>
            <div className="mt-3 bg-[#EFF6FF] text-[#1D4ED8] text-xs rounded-lg px-3 py-2">
              This may take a few moments. Please don't close the page while
              we secure your reward.
            </div>
            <p className="mt-2 text-xs italic text-[#9CA3AF]">
              [ Validating points balance... ]
            </p>
          </>
        )}
      </div>
    </div>
  );
}