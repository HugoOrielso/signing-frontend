import { CREAM, INK, MUTED } from "@/lib/constanst";

export function PublicContractError() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: CREAM,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 360, padding: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: 22,
            color: INK,
            marginBottom: 8,
          }}
        >
          Enlace no válido
        </h2>
        <p style={{ fontSize: 14, color: MUTED }}>Contrato no encontrado</p>
      </div>
    </div>
  );
}