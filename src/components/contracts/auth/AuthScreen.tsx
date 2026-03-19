"use client"

import OtpComponent from "@/components/otp/OtpComponent";
import publicApi from "@/lib/axiosPublicClient";
import { BORDER, CREAM, GOLD, GOLD_D, INK, MUTED } from "@/lib/constanst";
import { usePublicContractSignerStore } from "@/store/publicContractSignerStore";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type AuthStep = "email" | "otp";

export default function AuthScreen({ token }: { token: string }) {
  const router     = useRouter();
  const setSession = usePublicContractSignerStore(s => s.setSession);

  const [authStep,  setAuthStep]  = useState<AuthStep>("email");
  const [email,     setEmail]     = useState("");
  const [otp,       setOtp]       = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function handleRequestOtp(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email.trim())                { setError("Ingresa tu correo"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Correo no válido"); return; }
    setLoading(true); setError("");
    try {
      await publicApi.post(`/contracts/public/${token}/request-otp`, { email: email.trim() });
      setAuthStep("otp"); setOtp(""); setCountdown(60);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "No se pudo enviar el código");
    } finally { setLoading(false); }
  }

  const handleVerify = useCallback(async () => {
    const code = otp.replace(/\s/g, "");
    if (code.length < 6) { toast.error("Ingresa los 6 dígitos"); return; }

    setLoading(true); setError("");
    try {
      const { data } = await publicApi.post(`/contracts/public/${token}/verify-otp`, {
        email: email.trim(), code,
      });

      // Guardar en el store de Zustand (persiste en sessionStorage automáticamente)
      setSession(token, {
        email:        data.email,
        sessionToken: data.sessionToken,
        verified:     true,
      });

      // El backend decide la ruta: SIGNED → /view, otros → /sign
      router.replace(data.nextRoute ?? `/contracts/sign/${token}`);

    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message ?? "Código incorrecto");
      setLoading(false); setOtp("");
    }
  }, [otp, email, token, router, setSession]);

  useEffect(() => {
    if (authStep === "otp" && otp.replace(/\s/g, "").length === 6) {
      handleVerify();
    }
  }, [otp, authStep, handleVerify]);

  return (
    <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center",
      justifyContent:"center", background:CREAM, padding:"24px 16px" }}>
      <div style={{ width:"100%", maxWidth:420 }}>

        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontFamily:"Playfair Display, serif", fontSize:22, color:INK, fontWeight:700 }}>
            Dimcultura <em style={{ color:GOLD_D }}>S.A.S</em>
          </div>
          <p style={{ fontSize:12, color:MUTED, margin:"4px 0 0", fontStyle:"italic" }}>
            &ldquo;Un mundo en el que debes estar&rdquo;
          </p>
        </div>

        <div style={{ background:"white", borderRadius:20, border:`1.5px solid ${BORDER}`,
          boxShadow:"0 8px 40px rgba(26,26,46,0.1)", overflow:"hidden" }}>
          <div style={{ height:4, background:`linear-gradient(90deg,${GOLD},${GOLD_D},${INK})` }}/>
          <div style={{ padding:"36px 32px" }}>

            {authStep === "email" ? (
              <form onSubmit={handleRequestOtp}>
                <h1 style={{ fontFamily:"Playfair Display, serif", fontSize:21,
                  color:INK, margin:"0 0 8px", textAlign:"center" }}>
                  Verificar Identidad
                </h1>
                <p style={{ fontSize:13, color:MUTED, textAlign:"center",
                  margin:"0 0 28px", lineHeight:1.65 }}>
                  Ingresa el correo al que te enviamos el enlace para recibir tu código de acceso.
                </p>
                <label style={{ fontSize:11, fontWeight:600,
                  textTransform:"uppercase" as const, letterSpacing:1,
                  color:MUTED, display:"block", marginBottom:8 }}>
                  Correo electrónico
                </label>
                <input type="email" placeholder="tu@correo.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                  disabled={loading} autoFocus
                  style={{ width:"100%", border:`1.5px solid ${error ? "#fca5a5" : BORDER}`,
                    borderRadius:10, padding:"12px 14px", fontSize:14, color:INK,
                    outline:"none", boxSizing:"border-box" as const, background:"white" }}/>
                {error && <p style={{ fontSize:12, color:"#dc2626", margin:"8px 0 0" }}>⚠ {error}</p>}
                <button type="submit" disabled={loading} style={{
                  width:"100%", marginTop:20, padding:"13px", borderRadius:10,
                  border:"none", background:loading?"#2d2d4e":INK, color:GOLD,
                  fontSize:14, fontWeight:600,
                  cursor:loading?"not-allowed":"pointer", transition:"all 0.2s" }}>
                  {loading ? "Enviando código…" : "Enviar código →"}
                </button>
              </form>

            ) : (
              <>
                <button onClick={() => { setAuthStep("email"); setOtp(""); setError(""); }}
                  style={{ background:"none", border:"none", cursor:"pointer",
                    color:MUTED, fontSize:12, display:"flex", alignItems:"center",
                    gap:4, marginBottom:20, padding:0 }}>
                  ← Cambiar correo
                </button>
                <h1 style={{ fontFamily:"Playfair Display, serif", fontSize:21,
                  color:INK, margin:"0 0 8px", textAlign:"center" }}>
                  Código de Verificación
                </h1>
                <p style={{ fontSize:13, color:MUTED, textAlign:"center",
                  margin:"0 0 4px", lineHeight:1.65 }}>
                  Enviamos un código a
                </p>
                <p style={{ fontSize:14, fontWeight:600, color:INK,
                  textAlign:"center", margin:"0 0 28px" }}>
                  {email}
                </p>

                <OtpComponent value={otp}
                  onChange={v => { setOtp(v); setError(""); }}
                  disabled={loading}/>

                {error && (
                  <p style={{ fontSize:12, color:"#dc2626", textAlign:"center", margin:"12px 0 0" }}>
                    ⚠ {error}
                  </p>
                )}

                <button onClick={handleVerify}
                  disabled={otp.replace(/\s/g,"").length < 6 || loading}
                  style={{ width:"100%", marginTop:24, padding:"13px", borderRadius:10,
                    border:"none",
                    background:otp.replace(/\s/g,"").length===6&&!loading?INK:"#e8e4da",
                    color:otp.replace(/\s/g,"").length===6?GOLD:MUTED,
                    fontSize:14, fontWeight:600,
                    cursor:otp.replace(/\s/g,"").length<6?"not-allowed":"pointer",
                    transition:"all 0.2s" }}>
                  {loading ? "Verificando…" : "Verificar y acceder →"}
                </button>

                <div style={{ textAlign:"center", marginTop:20 }}>
                  {countdown > 0 ? (
                    <p style={{ fontSize:12, color:BORDER, margin:0 }}>
                      Reenviar en {countdown}s
                    </p>
                  ) : (
                    <button onClick={() => handleRequestOtp()}
                      style={{ background:"none", border:"none", cursor:"pointer",
                        color:GOLD_D, fontSize:12, fontWeight:600 }}>
                      ¿No recibiste el código? Reenviar →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <p style={{ textAlign:"center", fontSize:11, color:BORDER, margin:"20px 0 0" }}>
          Acceso exclusivo para el firmante designado
        </p>
      </div>
    </div>
  );
}