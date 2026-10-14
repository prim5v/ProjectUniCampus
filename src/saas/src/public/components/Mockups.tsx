import { QrCode, Radio } from "lucide-react";

/** Conceptual illustration. NOT a real IDEase screenshot. Swap for real screenshots when available. */
export function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="mx-auto w-[220px] rounded-[2rem] border-[7px] bg-white p-3 shadow-sm" style={{ borderColor: "var(--uc-ink)" }}
        role="img" aria-label="Conceptual illustration of a digital university ID on a smartphone">
        <p className="text-xs font-semibold">IDEase</p>
        <div className="uc-dark mt-3 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider opacity-70">University ID</p>
          <p className="mt-3 text-sm font-semibold">Student Name</p>
          <p className="text-[11px] opacity-80">Reg. No. 0000/0000</p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-[10px] opacity-70">Programme · Faculty</span>
            <QrCode className="h-9 w-9" aria-hidden />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[11px] font-medium">
          <span className="uc-tint rounded-md py-2">Tap to present</span>
          <span className="uc-tint rounded-md py-2">Show QR</span>
        </div>
      </div>
      <figcaption className="uc-muted mt-2 text-center text-[11px]">Conceptual illustration</figcaption>
    </figure>
  );
}

export function ReaderMockup({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="mx-auto w-[150px] rounded-2xl border p-4 uc-border uc-warm text-center shadow-sm"
        role="img" aria-label="Conceptual illustration of a campus NFC reader">
        <Radio className="uc-green-text mx-auto h-8 w-8" aria-hidden />
        <p className="mt-3 text-xs font-semibold">UniCampus reader</p>
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] uc-muted">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--uc-green)" }} aria-hidden />Ready
        </p>
      </div>
      <figcaption className="uc-muted mt-2 text-center text-[11px]">Conceptual illustration</figcaption>
    </figure>
  );
}

export function CredentialScene({ className = "" }: { className?: string }) {
  return (
    <div className={`uc-tint flex items-center justify-center gap-4 rounded-2xl p-8 sm:gap-8 ${className}`}>
      <PhoneMockup />
      <div className="hidden flex-col items-center gap-1 sm:flex" aria-hidden>
        <span className="h-px w-14 border-t border-dashed" style={{ borderColor: "var(--uc-green)" }} />
        <span className="text-[10px] uppercase tracking-wider uc-green-text">NFC · QR</span>
      </div>
      <ReaderMockup />
    </div>
  );
}
