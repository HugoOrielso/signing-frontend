import { GOLD, INK } from "@/lib/constanst";

interface Props {
  message: string;
}

export function Toast({ message }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 50,
        padding: "14px 24px",
        borderRadius: 12,
        fontSize: 14,
        borderLeft: `4px solid ${GOLD}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        background: INK,
        color: "white",
        transform: message ? "translateY(0)" : "translateY(80px)",
        opacity: message ? 1 : 0,
        pointerEvents: message ? "auto" : "none",
        transition: "all 0.3s",
      }}
    >
      {message}
    </div>
  );
}