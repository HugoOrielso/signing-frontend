import { DownloadButton } from "@/components/contracts/DownloadButton";
import { SignaturePad } from "@/components/contracts/SignaturePad";
import { BORDER, GOLD, INK, MUTED } from "@/lib/constanst";

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
    <div
      style={{
        marginTop: 20,
        background: "white",
        borderRadius: 16,
        border: `1.5px solid ${BORDER}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg,${GOLD},#a07830)` }} />
      <div style={{ padding: "28px 32px" }}>
        {isViewMode || alreadySigned ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#e8f5ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 17, color: INK, margin: 0 }}>
                  {isViewMode ? "Documento firmado" : "¡Libranza firmada correctamente!"}
                </h3>
                <p style={{ fontSize: 13, color: MUTED, marginTop: 4, marginBottom: 0 }}>
                  {isViewMode
                    ? "Esta libranza ya fue firmada y se muestra en modo solo lectura."
                    : "Tu firma ha sido registrada. Recibirás una copia por correo."}
                </p>
              </div>
            </div>

            {token && <DownloadButton token={token} />}
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: showPad ? 20 : 0,
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>✍️</span>
                <div>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 19, color: INK, margin: 0 }}>
                    Firmar Libranza
                  </h2>
                  <p style={{ fontSize: 13, color: MUTED, marginTop: 3, marginBottom: 0 }}>
                    Aprobada la Autorización para Descuento Respectivo
                  </p>
                </div>
              </div>

              {!showPad && (
                <button
                  onClick={() => setShowPad(true)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: INK,
                    color: GOLD,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ✍️ Firmar ahora
                </button>
              )}
            </div>

            {showPad && (
              <div>
                <SignaturePad onSave={onSign} disabled={saving} />

                {error && (
                  <p style={{ marginTop: 12, fontSize: 13, color: "#8b3a3a", fontWeight: 500 }}>
                    ⚠ {error}
                  </p>
                )}

                <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 8 }}>
                  <button
                    onClick={() => setShowPad(false)}
                    style={{
                      padding: "6px 16px",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 8,
                      background: "transparent",
                      color: MUTED,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
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