import { BORDER, GOLD_D, INK, MUTED } from "@/lib/constanst";
import { getStatusMeta } from "./contractStatus";

interface Props {
  isAdmin: boolean;
  clientEmail: string | null;
  status: string;
}

export function PublicContractTopBar({ isAdmin, clientEmail, status }: Props) {
  const st = getStatusMeta(status);

  return (
    <div
      style={{
        background: "white",
        borderBottom: `1px solid ${BORDER}`,
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: 17,
          color: INK,
          fontWeight: 700,
        }}
      >
        Dimcultura <em style={{ color: GOLD_D }}>S.A.S</em>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isAdmin && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: 999,
              background: "#1e1b4b",
              color: "#a5b4fc",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Vista admin
          </span>
        )}

        {!isAdmin && clientEmail && (
          <span style={{ fontSize: 11, color: MUTED }}>✓ {clientEmail}</span>
        )}

        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "5px 12px",
            borderRadius: 999,
            background: st.bg,
            color: st.color,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {st.label}
        </span>
      </div>
    </div>
  );
}