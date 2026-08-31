import { useState, useRef } from "react";
import { CheckCircle2, X, Download, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

export default function VoucherResultModal({ reward, voucherCode, expiryDate, onClose, onDownloaded }) {
  const [enlarged, setEnlarged] = useState(false);
  const downloadRef = useRef(null);

  const handleDownload = async () => {
    if (!downloadRef.current) return;
    try {
      const dataUrl = await toPng(downloadRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `${voucherCode}.png`;
      link.href = dataUrl;
      link.click();
      onDownloaded(); // let the parent close this modal and show the toast
    } catch (err) {
      console.error("Could not generate coupon image", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center relative">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#374151]"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0D631B] bg-[#E7F7EC] px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Your Coupon Is Ready
          </span>

          <h2 className="mt-3 text-lg font-bold text-[#1A1A2E]">{reward.name}</h2>

          <button
            onClick={() => setEnlarged(true)}
            className="mt-4 w-full aspect-square max-w-[180px] mx-auto rounded-xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-1 text-[#9CA3AF] hover:border-[#0D631B]/40"
          >
            <QrCode className="w-10 h-10" />
            <span className="text-xs">Tap to enlarge</span>
          </button>

          <div className="mt-4 bg-gray-50 rounded-lg px-3 py-2 text-xs text-[#374151] font-mono">
            Voucher Code: {voucherCode}
          </div>

          <p className="mt-3 text-xs text-[#6B7280]">
            Show this QR code at checkout to redeem your coupon.
          </p>
          <p className="mt-1 text-xs text-[#DC2626]">Use before: {expiryDate}</p>

          <button
            onClick={handleDownload}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-[#0D631B] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Coupon
          </button>
        </div>
      </div>

      {/* Enlarged, actually-scannable QR code */}
      {enlarged && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]"
          onClick={() => setEnlarged(false)}
        >
          <div className="bg-white rounded-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <QRCodeSVG value={voucherCode} size={260} />
            <p className="mt-3 text-xs text-[#6B7280] font-mono">{voucherCode}</p>
            <button
              onClick={() => setEnlarged(false)}
              className="mt-4 w-full text-sm text-[#374151] border border-[#E5E7EB] rounded-lg py-2 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hidden off-screen template used only to generate the downloadable image —
          this one has the real QR code baked in, unlike the placeholder shown above */}
      <div className="fixed -left-[9999px] top-0" aria-hidden="true">
        <div ref={downloadRef} className="bg-white rounded-2xl w-[360px] p-6 text-center">
          <p className="text-xs font-semibold text-[#0D631B]">EcoBridge</p>
          <h2 className="mt-2 text-lg font-bold text-[#1A1A2E]">{reward.name}</h2>
          <div className="mt-4 flex justify-center">
            <QRCodeSVG value={voucherCode} size={200} />
          </div>
          <p className="mt-4 text-sm text-[#374151] font-mono">{voucherCode}</p>
          <p className="mt-1 text-xs text-[#DC2626]">Use before: {expiryDate}</p>
        </div>
      </div>
    </>
  );
}