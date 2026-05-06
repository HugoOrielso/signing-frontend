import { SignaturePad } from "@/components/contracts/SignaturePad";

interface Props {
  mode: "preview" | "sign" | "view";
  alreadySigned: boolean;
  showPad: boolean;
  setShowPad: (value: boolean) => void;
  saving: boolean;
  error: string;
  onSign: (sigType: "DRAWN" | "TYPED", sigData: string) => Promise<void>;
}

export function ReciboConformidadActionPanel({
  mode,
  alreadySigned,
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
    <div className="mt-5 overflow-hidden rounded-2xl border border-border-soft bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="h-1 bg-linear-to-r from-gold to-gold-dark" />

      <div className="relative p-3">
        {saving && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm">
            <svg className="h-8 w-8 animate-spin text-gold" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-[13px] font-semibold text-ink">Guardando firma...</p>
          </div>
        )}

        {isViewMode || alreadySigned ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <div>
                <h3 className="m-0 font-serif text-[17px] text-ink">
                  {isViewMode
                    ? "Recibo de conformidad firmado"
                    : "¡Recibo de conformidad firmado correctamente!"}
                </h3>
                <p className="mt-1 mb-0 text-[13px]">
                  {isViewMode
                    ? "Este recibo ya fue firmado y se muestra en modo solo lectura."
                    : "Tu firma ha sido registrada correctamente."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={`flex flex-wrap items-center justify-between gap-4 ${showPad ? "mb-5" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="text-[22px]">✍️</span>
                <div>
                  <h2 className="m-0 font-serif text-[19px] text-ink">
                    Firmar Recibo de Conformidad
                  </h2>
                  <p className="mt-0.75 mb-0 text-[13px]">
                    Confirma que recibiste el producto o servicio a conformidad.
                  </p>
                </div>
              </div>

              {!showPad && (
                <button
                  type="button"
                  onClick={() => setShowPad(true)}
                  className="cursor-pointer rounded-lg border-none bg-ink px-6 py-2.5 text-[13px] font-semibold text-gold"
                >
                  ✍️ Firmar ahora
                </button>
              )}
            </div>

            {showPad && (
              <div>
                <SignaturePad onSave={onSign} disabled={saving} />

                {error && (
                  <p className="mt-3 text-[13px] font-medium text-[#8b3a3a]">
                    ⚠ {error}
                  </p>
                )}

                <div className="mt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setShowPad(false)}
                    className="cursor-pointer rounded-lg border border-border-soft bg-red-500 px-4 py-1.5 text-xs text-white"
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