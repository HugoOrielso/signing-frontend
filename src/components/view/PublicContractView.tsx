/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import LibranzaPreview from "@/components/libranza/LibranzaPreview";
import publicApi from "@/lib/axiosPublicClient";
import { BORDER, CREAM, GOLD, GOLD_D, INK, MUTED } from "@/lib/constanst";
import { LibranzaData, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SESSION_KEY = (token: string) => `otp_verified:${token}`;

interface ContractData {
  id: string; contractNumber?: string; contractType?: string;
  title: string; status: string;
  signers: LibranzaSigner[];
  signatures: LibranzaSignature[];
  libranzaData?: LibranzaData | null;
}

export type ViewMode = "sign" | "view" | "preview";

interface Props {
  token: string;
  pageMode: "sign" | "view";
}

type Step = "checking" | "loading" | "view" | "error";

function statusLabel(s: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    DRAFT: { label: "Borrador", color: MUTED, bg: CREAM },
    SENT: { label: "Enviado", color: "#1d4ed8", bg: "#eff6ff" },
    VIEWED: { label: "Visto", color: "#92400e", bg: "#fef3c7" },
    PARTIALLY_SIGNED: { label: "Pend. Firma", color: "#5b21b6", bg: "#f5f3ff" },
    SIGNED: { label: "Firmado", color: "#2d6a4f", bg: "#e8f5ee" },
    EXPIRED: { label: "Expirado", color: "#8b3a3a", bg: "#fff5f5" },
    CANCELLED: { label: "Cancelado", color: "#8b3a3a", bg: "#fff5f5" },
  };
  return map[s] ?? { label: s, color: MUTED, bg: CREAM };
}

export default function PublicContractSignView({ token, pageMode }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("checking");
  const [contract, setContract] = useState<ContractData | null>(null);
  const [signatures, setSignatures] = useState<LibranzaSignature[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clientEmail, setClientEmail] = useState<string | null>(null);

  async function loadContract() {
    setStep("loading");
    try {
      const { data } = await publicApi.get(`/contracts/public/${token}`);
      setContract(data.contract);
      setSignatures(data.contract.signatures ?? []);
      setStep("view");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "No se pudo cargar el contrato");
      setStep("error");
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (session?.user?.email) {
          setIsAdmin(true);
          loadContract();
          return;
        }
      } catch { /* no session */ }

      // 2. Sesión OTP válida en sessionStorage
      try {
        const saved = sessionStorage.getItem(SESSION_KEY(token));
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.email && parsed?.sessionToken) {
            setClientEmail(parsed.email);
            loadContract();
            return;
          }
        }
      } catch { /* ignore */ }

      // 3. Sin sesión → ir a auth
      router.replace(`/contracts/auth/${token}`);
    }

    checkAuth();
  }, [token]);

  function resolveMode(): ViewMode {
    if (isAdmin) return "preview"; // admin siempre lectura
    if (pageMode === "view") return "view";    // ruta /view
    if (contract?.status === "SIGNED") return "view";    // ya firmado
    return "sign";                                        // pendiente → firmar
  }

  if (step === "checking" || step === "loading") return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: CREAM
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: `2px solid ${GOLD}`, borderTopColor: "transparent",
          animation: "spin 1s linear infinite", margin: "0 auto 16px"
        }} />
        <p style={{ color: MUTED, fontSize: 14 }}>Cargando contrato…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (step === "error" || !contract) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: CREAM
    }}>
      <div style={{ textAlign: "center", maxWidth: 360, padding: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <h2 style={{
          fontFamily: "Playfair Display, serif", fontSize: 22,
          color: INK, marginBottom: 8
        }}>Enlace no válido</h2>
        <p style={{ fontSize: 14, color: MUTED }}>Contrato no encontrado</p>
      </div>
    </div>
  );

  const st = statusLabel(contract.status);
  const isLibranza = contract.contractType === "LIBRANZA" && !!contract.libranzaData;
  const mode = resolveMode();

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "DM Sans, sans-serif" }}>

      {/* Top bar */}
      <div style={{
        background: "white", borderBottom: `1px solid ${BORDER}`,
        padding: "14px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{
          fontFamily: "Playfair Display, serif",
          fontSize: 17, color: INK, fontWeight: 700
        }}>
          Dimcultura <em style={{ color: GOLD_D }}>S.A.S</em>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAdmin && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "4px 10px",
              borderRadius: 999, background: "#1e1b4b", color: "#a5b4fc",
              textTransform: "uppercase" as const, letterSpacing: 1
            }}>
              Vista admin
            </span>
          )}
          {!isAdmin && clientEmail && (
            <span style={{ fontSize: 11, color: MUTED }}>✓ {clientEmail}</span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "5px 12px",
            borderRadius: 999, background: st.bg, color: st.color,
            textTransform: "uppercase" as const, letterSpacing: 1
          }}>
            {st.label}
          </span>
        </div>
      </div>

      {/* Banner admin */}
      {isAdmin && (
        <div style={{
          background: "#1e1b4b", padding: "10px 24px",
          display: "flex", alignItems: "center", gap: 10
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#a5b4fc" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          <p style={{ fontSize: 12, color: "#a5b4fc", margin: 0 }}>
            Vista de administrador — el panel de firma no está disponible en este modo.
          </p>
        </div>
      )}

      {/* Contenido */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 16px" }}>
        {isLibranza ? (
          <LibranzaPreview
            data={contract.libranzaData!}
            signers={contract.signers}
            signatures={signatures}
            mode={mode}
            token={token}
            onSigned={() => setContract(prev => prev ? { ...prev, status: "SIGNED" } : prev)}
          />
        ) : (
          <div style={{
            background: "white", borderRadius: 16,
            padding: "40px 52px", border: `1.5px solid ${BORDER}`
          }}>
            <p style={{ color: MUTED, fontSize: 14, margin: 0, textAlign: "center" }}>
              Este tipo de contrato no es soportado en la vista pública.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}