"use client"
import { BORDER, CREAM, GOLD, GOLD_D, INK, MUTED } from "@/lib/constanst";
import { useState } from "react";

export function ConfirmSignModal({ signerName, onConfirm, onCancel, confirming }: {
  signerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirming: boolean;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(26,26,46,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "white", borderRadius: 20, width: "100%", maxWidth: 520,
        overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
      }}>
        {/* Header */}
        <div style={{ height: 5, background: `linear-gradient(90deg,${GOLD},${GOLD_D},${INK})` }} />
        <div style={{ padding: "28px 32px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: CREAM,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <span style={{ fontSize: 22 }}>✍️</span>
            </div>
            <div>
              <h2 style={{
                fontFamily: "Playfair Display, serif", fontSize: 19,
                color: INK, margin: 0
              }}>
                Confirmar Firma
              </h2>
              <p style={{ fontSize: 12, color: MUTED, margin: "3px 0 0" }}>
                Revisa y acepta los términos antes de firmar
              </p>
            </div>
          </div>

          {/* Nombre firmante */}
          <div style={{
            background: CREAM, borderRadius: 10, padding: "12px 16px",
            marginBottom: 16, border: `1px solid ${BORDER}`
          }}>
            <p style={{
              fontSize: 11, color: MUTED, margin: "0 0 3px",
              textTransform: "uppercase", letterSpacing: 1, fontWeight: 600
            }}>
              Firmante
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: INK, margin: 0 }}>
              {signerName}
            </p>
          </div>

          {/* Texto legal */}
          <div style={{
            background: "#fafafa", borderRadius: 10, padding: "14px 16px",
            marginBottom: 20, border: `1px solid ${BORDER}`,
            maxHeight: 200, overflowY: "auto", fontSize: 11, color: "#4a4a6a",
            lineHeight: 1.7
          }}>
            <p style={{ fontWeight: 700, color: INK, margin: "0 0 8px", fontSize: 12 }}>
              Declaración de Firma Electrónica
            </p>
            <p style={{ margin: "0 0 8px" }}>
              Al firmar este documento, yo <strong>{signerName}</strong>, declaro bajo la gravedad
              de juramento que:
            </p>
            <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>
              <li style={{ marginBottom: 4 }}>He leído y entendido completamente el contenido de
                esta Libranza de Autorización de Descuento.</li>
              <li style={{ marginBottom: 4 }}>Acepto voluntariamente los términos y condiciones
                establecidos en el documento, incluyendo la autorización de descuento por nómina
                a favor de <strong>DIMCULTURA S.A.S.</strong></li>
              <li style={{ marginBottom: 4 }}>Autorizo el descuento de las cuotas pactadas de mi
                salario o cualquier otro concepto laboral.</li>
              <li style={{ marginBottom: 4 }}>Comprendo que esta firma electrónica tiene plena
                validez legal conforme a la <strong>Ley 527 de 1999</strong> (Comercio Electrónico
                en Colombia) y el <strong>Decreto 2364 de 2012</strong> sobre firma electrónica.</li>
              <li style={{ marginBottom: 4 }}>La presente autorización es irrevocable una vez firmada,
                salvo acuerdo escrito entre las partes.</li>
            </ul>
            <p style={{ margin: "0 0 8px", fontSize: 10.5, color: MUTED }}>
              Esta firma electrónica genera los mismos efectos jurídicos que una firma manuscrita,
              de acuerdo con la normatividad colombiana vigente. Se registrará la fecha, hora,
              dirección IP y agente de usuario del dispositivo utilizado para firmar.
            </p>
            <p style={{ margin: 0, fontSize: 10.5, color: MUTED }}>
              Al confirmar, acepta también la <strong>Política de Tratamiento de Datos Personales
              </strong> de DIMCULTURA S.A.S. conforme a la Ley 1581 de 2012.
            </p>
          </div>

          {/* Checkbox de aceptación */}
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            cursor: "pointer", marginBottom: 24, userSelect: "none"
          }}>
            <div onClick={() => setAccepted(a => !a)}
              style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
                border: `2px solid ${accepted ? GOLD : BORDER}`,
                background: accepted ? INK : "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s", cursor: "pointer"
              }}>
              {accepted && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke={GOLD} strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 12, color: INK, lineHeight: 1.5 }}>
              He leído y acepto los términos anteriores. Entiendo que esta firma electrónica
              tiene validez legal y es vinculante para las partes involucradas.
            </span>
          </label>
        </div>

        {/* Botones */}
        <div style={{ padding: "0 32px 28px", display: "flex", gap: 12 }}>
          <button onClick={onCancel} disabled={confirming} style={{
            flex: 1, padding: "12px", borderRadius: 10,
            border: `1.5px solid ${BORDER}`, background: "white",
            color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={!accepted || confirming} style={{
            flex: 2, padding: "12px", borderRadius: 10, border: "none",
            background: accepted && !confirming ? INK : "#e8e4da",
            color: accepted && !confirming ? GOLD : MUTED,
            fontSize: 13, fontWeight: 600,
            cursor: accepted && !confirming ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s",
          }}>
            {confirming ? (
              <>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  border: `2px solid ${GOLD}`, borderTopColor: "transparent",
                  animation: "spin 0.8s linear infinite"
                }} />
                Registrando firma…
              </>
            ) : (
              <>✍️ Confirmar y Firmar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
