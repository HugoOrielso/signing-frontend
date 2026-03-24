"use client"

import OtpComponent from "@/components/otp/OtpComponent";
import publicApi from "@/lib/axiosPublicClient";
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

      setSession(token, {
        email:        data.email,
        sessionToken: data.sessionToken,
        verified:     true,
      });

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

  const otpComplete = otp.replace(/\s/g, "").length === 6;

  return (
    <div className="min-h-dvh flex items-center justify-center bg-cream px-4 py-6">
      <div className="w-full max-w-105">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="font-serif text-[22px] text-ink font-bold">
            Dimcultura <em className="text-gold-dark">S.A.S</em>
          </div>
          <p className="text-[12px] mt-1 italic">
            &ldquo;Un mundo en el que debes estar&rdquo;
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[20px] border border-border-soft shadow-[0_8px_40px_rgba(26,26,46,0.1)] overflow-hidden">

          {/* Top gradient bar */}
          <div className="h-1 bg-linear-to-r from-gold via-gold-dark to-ink" />

          <div className="px-8 py-9">

            {authStep === "email" ? (
              <form onSubmit={handleRequestOtp}>
                <h1 className="font-serif text-[21px] text-ink text-center mb-2">
                  Verificar Identidad
                </h1>
                <p className="text-[13px]  text-center leading-relaxed mb-7">
                  Ingresa el correo al que te enviamos el enlace para recibir tu código de acceso.
                </p>

                <label className="text-[11px] font-semibold uppercase tracking-widest  block mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  disabled={loading}
                  autoFocus
                  className={`w-full border rounded-[10px] px-3.5 py-3 text-sm text-ink outline-none bg-white box-border transition-colors
                    ${error ? "border-red-300" : "border-border-soft"}`}
                />
                {error && (
                  <p className="text-xs text-red-600 mt-2">⚠ {error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-5 py-3.25 rounded-[10px] border-none text-gold text-sm font-semibold transition-all duration-200
                    ${loading ? "bg-[#2d2d4e] cursor-not-allowed" : "bg-ink cursor-pointer"}`}
                >
                  {loading ? "Enviando código…" : "Enviar código →"}
                </button>
              </form>

            ) : (
              <>
                <button
                  onClick={() => { setAuthStep("email"); setOtp(""); setError(""); }}
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-xs mb-5 p-0"
                >
                  ← Cambiar correo
                </button>

                <h1 className="font-serif text-[21px] text-ink text-center mb-2">
                  Código de Verificación
                </h1>
                <p className="text-[13px] text-center leading-relaxed mb-1">
                  Enviamos un código a
                </p>
                <p className="text-sm font-semibold text-ink text-center mb-7">
                  {email}
                </p>

                <OtpComponent
                  value={otp}
                  onChange={v => { setOtp(v); setError(""); }}
                  disabled={loading}
                />

                {error && (
                  <p className="text-xs text-red-600 text-center mt-3">⚠ {error}</p>
                )}

                <button
                  onClick={handleVerify}
                  disabled={!otpComplete || loading}
                  className={`w-full mt-6 py-3.25 rounded-[10px] border-none text-sm font-semibold transition-all duration-200
                    ${otpComplete && !loading
                      ? "bg-ink text-gold cursor-pointer"
                      : "bg-[#e8e4da] cursor-not-allowed"
                    }`}
                >
                  {loading ? "Verificando…" : "Verificar y acceder →"}
                </button>

                <div className="text-center mt-5">
                  {countdown > 0 ? (
                    <p className="text-xs text-border-soft m-0">
                      Reenviar en {countdown}s
                    </p>
                  ) : (
                    <button
                      onClick={() => handleRequestOtp()}
                      className="bg-transparent border-none cursor-pointer text-gold-dark text-xs font-semibold"
                    >
                      ¿No recibiste el código? Reenviar →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-border-soft mt-5">
          Acceso exclusivo para el firmante designado
        </p>
      </div>
    </div>
  );
}