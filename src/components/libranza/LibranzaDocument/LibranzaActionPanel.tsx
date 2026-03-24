import { DownloadButton } from "@/components/contracts/DownloadButton";
import { SignaturePad } from "@/components/contracts/SignaturePad";

interface Props {
  mode: "preview" | "sign" | "view";
  alreadySigned: boolean;
  token?: string;
  showPad: boolean;
  setShowPad: (value: boolean) => void;
  saving: boolean;
  error: string;
  onSign: (sigType: "DRAWN" | "TYPED", sigData: string) => Promise<void>;
}

export function LibranzaActionPanel({
  mode,
  alreadySigned,
  token,
  showPad,
  setShowPad,
  saving,
  error,
  onSign,
}: Props) {
  const isSignMode = mode === "sign";
  const isViewMode = mode === "view";

  if (!isSignMode && !isViewMode) return null;

  return (
    <div className="mt-5 bg-white rounded-2xl border border-border-soft shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">

      {/* Top gradient bar */}
      <div className="h-1 bg-linear-to-r from-gold to-gold-dark" />

      <div className="px-8 py-7">
        {isViewMode || alreadySigned ? (

          /* ── Signed / view state ── */
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#e8f5ee] flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#2d6a4f" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-[17px] text-ink m-0">
                  {isViewMode ? "Documento firmado" : "¡Libranza firmada correctamente!"}
                </h3>
                <p className="text-[13px] mt-1 mb-0">
                  {isViewMode
                    ? "Esta libranza ya fue firmada y se muestra en modo solo lectura."
                    : "Tu firma ha sido registrada. Recibirás una copia por correo."}
                </p>
              </div>
            </div>
            {token && <DownloadButton token={token} />}
          </div>

        ) : (

          /* ── Sign state ── */
          <div>
            <div className={`flex items-center justify-between gap-4 flex-wrap ${showPad ? "mb-5" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="text-[22px]">✍️</span>
                <div>
                  <h2 className="font-serif text-[19px] text-ink m-0">
                    Firmar Libranza
                  </h2>
                  <p className="text-[13px] mt-0.75 mb-0">
                    Aprobada la Autorización para Descuento Respectivo
                  </p>
                </div>
              </div>

              {!showPad && (
                <button
                  onClick={() => setShowPad(true)}
                  className="px-6 py-2.5 rounded-lg border-none bg-ink text-gold text-[13px] font-semibold cursor-pointer"
                >
                  ✍️ Firmar ahora
                </button>
              )}
            </div>

            {showPad && (
              <div>
                <SignaturePad onSave={onSign} disabled={saving} />

                {error && (
                  <p className="mt-3 text-[13px] text-[#8b3a3a] font-medium">
                    ⚠ {error}
                  </p>
                )}

                <div className="flex justify-start mt-2">
                  <button
                    onClick={() => setShowPad(false)}
                    className="px-4 py-1.5 border border-border-soft rounded-lg bg-transparent text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}