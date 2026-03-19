import { GOLD, GOLD_D, INK } from "@/lib/constanst";
import { LibranzaData, LibranzaSignature, LibranzaSigner } from "@/types/libranza";

interface Props {
  data: LibranzaData;
  signatures?: LibranzaSignature[];
  signers?: LibranzaSigner[];
  showSignatureZone: boolean;
}

export function LibranzaSignatureSection({
  signatures = [],
  signers = [],
  showSignatureZone,
}: Props) {
  const contractedSigner = signers.find((s) => s.partyRole === "CONTRACTED");
  const contractedSig = signatures.find((sig) => sig.signerId === contractedSigner?.id);
  const alreadySigned = !!contractedSig;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        marginBottom: 5,
      }}
    >
      <div style={{ fontSize: 7.5, border: "1px solid #ccc", padding: 5 }}>
        <p style={{ margin: "0 0 5px", fontSize: 7, lineHeight: 1.4 }}>
          <strong>
            He recibo en perfecto estado y a mi entera conformidad, los libros que describe y
            manifestado tener conocimiento que la empresa DIMCULTURA S.A.S., por ningún motivo
            permitirá la anulación o devolución después de firmada esta LIBRANZA, sin embargo torna
            la responsabilidad de que toda devolución que gote una devolución una indemnización
            del 37% del valor de la misma.
          </strong>
        </p>
        <strong>Acepto el Descuento y Recibo en Conformidad</strong>
        <div style={{ borderBottom: "1px solid #000", marginTop: 22, marginBottom: 3 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
        <div style={{ border: "1px solid #ccc", padding: 5, fontSize: 7.5 }}>
          <strong>Índice Derecho</strong>
          <div
            style={{
              height: 44,
              border: "1px dashed #bbb",
              marginTop: 4,
              borderRadius: 2,
            }}
          />
        </div>

        <div
          style={{
            border: alreadySigned
              ? "2px solid #2d6a4f"
              : `2px solid ${showSignatureZone ? GOLD : "#ccc"}`,
            padding: 5,
            borderRadius: 4,
            fontSize: 7.5,
          }}
        >
          <strong style={{ fontSize: 7 }}>
            Aprobada la Autorización
            <br />
            para Descuento Respectivo
          </strong>
          <br />
          <strong style={{ color: GOLD_D }}>Firma</strong>

          <div
            style={{
              height: 48,
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {alreadySigned ? (
              contractedSig!.type === "DRAWN" && contractedSig!.imageUrl ? (
                <img
                  src={contractedSig!.imageUrl}
                  alt="firma"
                  style={{ maxHeight: 44, maxWidth: "100%", objectFit: "contain" }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "Dancing Script, cursive",
                    fontSize: 22,
                    color: INK,
                  }}
                >
                  {contractedSig!.typedValue}
                </span>
              )
            ) : showSignatureZone ? (
              <span
                style={{
                  fontSize: 6.5,
                  color: GOLD,
                  letterSpacing: 1,
                  border: `1px dashed ${GOLD}`,
                  padding: "4px 8px",
                  borderRadius: 3,
                }}
              >
                PENDIENTE DE FIRMA
              </span>
            ) : (
              <span style={{ fontSize: 6.5, color: "#bbb", letterSpacing: 1 }}>
                FIRMA DEL CLIENTE
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}