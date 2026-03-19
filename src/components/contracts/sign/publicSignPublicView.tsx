/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import LibranzaPreview from "@/components/libranza/LibranzaPreview";
import publicApi from "@/lib/axiosPublicClient";
import { LibranzaData, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { useEffect, useRef, useState } from "react";

const INK = "#1a1a2e";
const GOLD = "#c9a84c";
const GOLD_D = "#a07830";
const CREAM = "#f5f0e8";
const BORDER = "#d4c9b0";
const MUTED = "#7a6e5f";

// ── Clave de sessionStorage por token (aislada por contrato) ──────────────────
const SESSION_KEY = (token: string) => `otp_verified:${token}`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface ContractData {
  id: string; contractNumber?: string; contractType?: string;
  title: string; status: string;
  signers: LibranzaSigner[];
  signatures: LibranzaSignature[];
  libranzaData?: LibranzaData | null;
}

interface Props { token: string }

type Step = "checking" | "auth" | "loading" | "view" | "error";
type AuthStep = "email" | "otp";

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


function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  function handleChange(index: number, raw: string) {
    const clean = raw.replace(/\D/g, "").slice(-1);
    const arr = value.replace(/\s/g, "").padEnd(6, " ").slice(0, 6).split("");

    arr[index] = clean || " ";
    const next = arr.join("").trimEnd();
    onChange(next);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      const arr = value.replace(/\s/g, "").padEnd(6, " ").slice(0, 6).split("");

      if (arr[index]?.trim()) {
        arr[index] = " ";
        onChange(arr.join("").trimEnd());
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        arr[index - 1] = " ";
        onChange(arr.join("").trimEnd());
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    onChange(pasted);
    const lastIndex = Math.min(pasted.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit.trim()}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 44,
            height: 52,
            border: `1.5px solid ${BORDER}`,
            borderRadius: 10,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 700,
            color: INK,
            outline: "none",
            background: "white",
          }}
        />
      ))}
    </div>
  );
}

 function AuthScreen({
  token,
  onVerified,
}: {
  token: string;
  onVerified: (email: string, nextRoute?: string) => void;
}) {
  const [authStep, setAuthStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const verifyingRef = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function handleVerify() {
    const code = otp.replace(/\s/g, "");

    if (code.length < 6) {
      setError("Ingresa los 6 dígitos");
      return;
    }

    if (verifyingRef.current) return;

    verifyingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const { data } = await publicApi.post(`/contracts/public/${token}/verify-otp`, {
        email: email.trim(),
        code,
      });

      sessionStorage.setItem(
        SESSION_KEY(token),
        JSON.stringify({
          email: data.email,
          sessionToken: data.sessionToken,
        })
      );

      onVerified(data.email, data.nextRoute);
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message ??
        "Código incorrecto";

      setError(message);
      setOtp("");
      verifyingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authStep === "otp" && otp.replace(/\s/g, "").length === 6 && !loading) {
      handleVerify();
    }
  }, [otp, authStep]);

  async function handleRequestOtp(e?: React.FormEvent) {
    e?.preventDefault();

    if (!email.trim()) {
      setError("Ingresa tu correo");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Correo no válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await publicApi.post(`/contracts/public/${token}/request-otp`, {
        email: email.trim(),
      });

      setAuthStep("otp");
      setOtp("");
      setCountdown(60);
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message ??
        "No se pudo enviar el código";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: CREAM,
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: 22,
              color: INK,
              fontWeight: 700,
            }}
          >
            Dimcultura <em style={{ color: GOLD_D }}>S.A.S</em>
          </div>
          <p
            style={{
              fontSize: 12,
              color: MUTED,
              marginTop: 4,
              fontStyle: "italic",
              margin: "4px 0 0",
            }}
          >
            &ldquo;Un mundo en el que debes estar&rdquo;
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: `1.5px solid ${BORDER}`,
            boxShadow: "0 8px 40px rgba(26,26,46,0.1)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 4, background: `linear-gradient(90deg,${GOLD},${GOLD_D},${INK})` }} />
          <div style={{ padding: "36px 32px" }}>
            {authStep === "email" ? (
              <form onSubmit={handleRequestOtp}>
                <h1
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 21,
                    color: INK,
                    margin: "0 0 8px",
                    textAlign: "center",
                  }}
                >
                  Verificar Identidad
                </h1>
                <p
                  style={{
                    fontSize: 13,
                    color: MUTED,
                    textAlign: "center",
                    margin: "0 0 28px",
                    lineHeight: 1.65,
                  }}
                >
                  Ingresa el correo al que te enviamos el enlace de firma para recibir tu código de acceso.
                </p>

                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: MUTED,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Correo electrónico
                </label>

                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  autoFocus
                  style={{
                    width: "100%",
                    border: `1.5px solid ${error ? "#fca5a5" : BORDER}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    fontSize: 14,
                    color: INK,
                    outline: "none",
                    boxSizing: "border-box",
                    background: "white",
                  }}
                />

                {error && (
                  <p style={{ fontSize: 12, color: "#dc2626", margin: "8px 0 0" }}>
                    ⚠ {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    marginTop: 20,
                    padding: "13px",
                    borderRadius: 10,
                    border: "none",
                    background: loading ? "#2d2d4e" : INK,
                    color: GOLD,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? "Enviando código…" : "Enviar código →"}
                </button>
              </form>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthStep("email");
                    setOtp("");
                    setError("");
                    setLoading(false);
                    verifyingRef.current = false;
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: MUTED,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 20,
                    padding: 0,
                  }}
                >
                  ← Cambiar correo
                </button>

                <h1
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 21,
                    color: INK,
                    margin: "0 0 8px",
                    textAlign: "center",
                  }}
                >
                  Código de Verificación
                </h1>

                <p
                  style={{
                    fontSize: 13,
                    color: MUTED,
                    textAlign: "center",
                    margin: "0 0 4px",
                    lineHeight: 1.65,
                  }}
                >
                  Enviamos un código de 6 dígitos a
                </p>

                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: INK,
                    textAlign: "center",
                    margin: "0 0 28px",
                  }}
                >
                  {email}
                </p>

                <OtpInput
                  value={otp}
                  onChange={v => {
                    setOtp(v);
                    setError("");
                  }}
                  disabled={loading}
                />

                {error && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "#dc2626",
                      textAlign: "center",
                      margin: "12px 0 0",
                    }}
                  >
                    ⚠ {error}
                  </p>
                )}

                <button
                  onClick={handleVerify}
                  disabled={otp.replace(/\s/g, "").length < 6 || loading}
                  style={{
                    width: "100%",
                    marginTop: 24,
                    padding: "13px",
                    borderRadius: 10,
                    border: "none",
                    background:
                      otp.replace(/\s/g, "").length === 6 && !loading ? INK : "#e8e4da",
                    color: otp.replace(/\s/g, "").length === 6 ? GOLD : MUTED,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: otp.replace(/\s/g, "").length < 6 || loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? "Verificando…" : "Verificar y acceder →"}
                </button>

                <div style={{ textAlign: "center", marginTop: 20 }}>
                  {countdown > 0 ? (
                    <p style={{ fontSize: 12, color: BORDER, margin: 0 }}>
                      Reenviar código en {countdown}s
                    </p>
                  ) : (
                    <button
                      onClick={() => handleRequestOtp()}
                      disabled={loading}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        color: GOLD_D,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      ¿No recibiste el código? Reenviar →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: BORDER,
            marginTop: 20,
            margin: "20px 0 0",
          }}
        >
          Acceso exclusivo para el firmante designado
        </p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PublicContractSignView({ token }: Props) {
  const [step, setStep] = useState<Step>("checking");
  const [contract, setContract] = useState<ContractData | null>(null);
  const [signatures, setSignatures] = useState<LibranzaSignature[]>([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  async function loadContract() {
    setStep("loading");
    try {
      const { data } = await publicApi.get(`/contracts/public/${token}`);
      setContract(data.contract);
      setSignatures(data.contract.signatures ?? []);
      setStep("view");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "No se pudo cargar el contrato");
      setStep("error");
    }
  }
  // ── Al montar: determinar si hay sesión previa ─────────────────────────────
  useEffect(() => {
    async function checkAuth() {
      // 1. ¿Hay sesión admin de NextAuth?
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (session?.user?.email) {
          setIsAdmin(true);
          loadContract();
          return;
        }
      } catch { /* no session */ }

      // 2. ¿Hay verificación OTP previa en sessionStorage?
      try {
        const saved = sessionStorage.getItem(SESSION_KEY(token));
        if (saved) {
          const parsed = JSON.parse(saved);
          // Válida si tiene email y sessionToken (dura el tab)
          if (parsed?.email && parsed?.sessionToken) {
            setClientEmail(parsed.email);
            loadContract();
            return;
          }
        }
      } catch { /* ignore */ }

      // 3. Mostrar pantalla de auth OTP
      setStep("auth");
    }

    checkAuth();
  }, [token]);



  function handleOtpVerified(email: string) {
    setClientEmail(email);
    loadContract();
  }

  // ── Renders ────────────────────────────────────────────────────────────────
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (step === "auth") {
    return <AuthScreen token={token} onVerified={handleOtpVerified} />;
  }

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
        }}>
          Enlace no válido
        </h2>
        <p style={{ fontSize: 14, color: MUTED }}>{error || "Contrato no encontrado"}</p>
      </div>
    </div>
  );

  const st = statusLabel(contract.status);
  const isLibranza = contract.contractType === "LIBRANZA" && !!contract.libranzaData;

  // Admin → solo lectura; cliente verificado → puede firmar
  const mode =
    isAdmin
      ? "preview"
      : contract.status === "SIGNED"
        ? "view"
        : "sign";

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
            token={mode === "sign" || mode === "view" ? token : undefined}
            onSigned={() =>
              setContract(prev => prev ? { ...prev, status: "SIGNED" } : prev)
            }
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