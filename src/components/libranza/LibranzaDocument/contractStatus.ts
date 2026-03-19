import { CREAM, MUTED } from "@/lib/constanst";

export function getStatusMeta(status: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    DRAFT: { label: "Borrador", color: MUTED, bg: CREAM },
    SENT: { label: "Enviado", color: "#1d4ed8", bg: "#eff6ff" },
    VIEWED: { label: "Visto", color: "#92400e", bg: "#fef3c7" },
    PARTIALLY_SIGNED: { label: "Pend. Firma", color: "#5b21b6", bg: "#f5f3ff" },
    SIGNED: { label: "Firmado", color: "#2d6a4f", bg: "#e8f5ee" },
    EXPIRED: { label: "Expirado", color: "#8b3a3a", bg: "#fff5f5" },
    CANCELLED: { label: "Cancelado", color: "#8b3a3a", bg: "#fff5f5" },
  };

  return map[status] ?? { label: status, color: MUTED, bg: CREAM };
}