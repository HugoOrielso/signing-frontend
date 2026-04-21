"use client";

import { BackgroundDecor } from "@/components/common/backgroudDecor";
import OtpComponent from "@/components/otp/OtpComponent";
import publicApiNew from "@/lib/publicAxios";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type AuthStep = "identifier" | "otp";
type Channel = "EMAIL" | "PHONE" | null;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    digits = `${digits}`;
  }

  return digits;
}

function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function resolveChannel(value: string): Channel {
  if (isEmail(value)) return "EMAIL";
  if (isPhone(value)) return "PHONE";
  return null;
}

export default function AuthScreen() {
  const router = useRouter();

  const [authStep, setAuthStep] = useState<AuthStep>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [channel, setChannel] = useState<Channel>(null);
  const [maskedDestination, setMaskedDestination] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const detectedChannel = useMemo(() => resolveChannel(identifier), [identifier]);

  async function handleRequestOtp(e?: React.FormEvent) {
    e?.preventDefault();

    const raw = identifier.trim();

    if (!raw) {
      setError("Ingresa tu correo o teléfono");
      return;
    }

    const channelType = resolveChannel(raw);

    if (!channelType) {
      setError("Ingresa un correo o teléfono válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payloadIdentifier =
        channelType === "PHONE" ? normalizePhone(raw) : raw.toLowerCase();

      const { data } = await publicApiNew.post("/users/verify/request-otp", {
        identifier: payloadIdentifier,
      });

      setAuthStep("otp");
      setOtp("");
      setCountdown(60);
      setChannel(data?.channel ?? channelType);
      setMaskedDestination(data?.maskedDestination ?? payloadIdentifier);
      toast.success("Código enviado correctamente");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "No se pudo enviar el código");
    } finally {
      setLoading(false);
    }
  }

  const handleVerify = useCallback(async () => {
    const code = otp.replace(/\s/g, "");
    const raw = identifier.trim();

    if (code.length < 6) {
      toast.error("Ingresa los 6 dígitos");
      return;
    }

    const channelType = resolveChannel(raw);

    if (!channelType) {
      setError("Ingresa un correo o teléfono válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payloadIdentifier =
        channelType === "PHONE" ? normalizePhone(raw) : raw.toLowerCase();

      await publicApiNew.post("/users/verify/verify-otp", {
        identifier: payloadIdentifier,
        code,
      });

      toast.success("Código verificado correctamente");
      setTimeout(() => router.replace("/users"), 300);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message ?? "Código incorrecto");
      setOtp("");
      setLoading(false);
      toast.error("No se pudo verificar tu código");
    }
  }, [otp, identifier, router]);

  const otpComplete = otp.replace(/\s/g, "").length === 6;

  const identifierLabel =
    detectedChannel === "PHONE" ? "Teléfono" : "Correo o teléfono";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-white text-slate-900">
      <BackgroundDecor />

      <div className="relative z-10 grid min-h-dvh grid-rows-[auto_1fr]">
        <header className="sticky top-0 z-30 border-b border-white/20 bg-white/70 px-4 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Image src="/assets/logo_dimcultura.png" alt="logo" width={44} height={44} />

              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Dimcultura S.A.S
                </div>
                <p className="text-xs text-slate-500">
                  Acceso seguro de verificación
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-xs text-blue-700">
              Verificación activa
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center p-2">
          <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="h-1.5 bg-linear-to-r from-blue-700 via-blue-500 to-indigo-500" />

              <div className="p-2">
                {authStep === "identifier" ? (
                  <form onSubmit={handleRequestOtp}>
                    <div className="mb-7 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <span className="text-lg font-bold">ID</span>
                      </div>

                      <h1 className="text-[20px] font-semibold tracking-tight text-slate-900">
                        Verificar identidad
                      </h1>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Ingresa tu correo o teléfono para recibir un código de acceso.
                      </p>
                    </div>

                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {identifierLabel}
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="tu@correo.com o 3001234567"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setError("");
                      }}
                      disabled={loading}
                      autoFocus
                      className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${error
                          ? "border-red-300 ring-4 ring-red-50"
                          : "border-slate-200 shadow-sm focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                        }`}
                    />

                    {error && (
                      <p className="mt-2 text-xs text-red-600">⚠ {error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold text-white transition-all ${loading
                          ? "cursor-not-allowed bg-slate-400"
                          : "bg-linear-to-r from-blue-700 to-blue-500 shadow-[0_16px_35px_rgba(37,99,235,0.22)] hover:scale-[1.01]"
                        }`}
                    >
                      {loading ? "Enviando código…" : "Enviar código"}
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthStep("identifier");
                        setOtp("");
                        setError("");
                      }}
                      className="mb-5 text-xs font-medium text-blue-700 transition hover:text-blue-800"
                    >
                      ← Cambiar dato
                    </button>

                    <div className="mb-7 text-center">
                      <div className="mx-auto mb-4 flex  items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <span className="text-lg font-bold">OTP</span>
                      </div>

                      <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
                        Código de verificación
                      </h1>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Enviamos un código a
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {maskedDestination || identifier}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        vía {channel === "PHONE" ? "SMS" : "correo electrónico"}
                      </p>
                    </div>

                    <OtpComponent
                      value={otp}
                      onChange={(v) => {
                        setOtp(v);
                        setError("");
                      }}
                      disabled={loading}
                    />

                    {error && (
                      <p className="mt-3 text-center text-xs text-red-600">
                        ⚠ {error}
                      </p>
                    )}

                    <button
                      onClick={handleVerify}
                      disabled={!otpComplete || loading}
                      className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold text-white transition-all ${otpComplete && !loading
                          ? "bg-linear-to-r from-blue-700 to-blue-500 shadow-[0_16px_35px_rgba(37,99,235,0.22)] hover:scale-[1.01]"
                          : "cursor-not-allowed bg-slate-300"
                        }`}
                    >
                      {loading ? "Verificando…" : "Verificar y acceder"}
                    </button>

                    <div className="mt-5 text-center">
                      {countdown > 0 ? (
                        <p className="text-xs text-slate-500">
                          Reenviar en {countdown}s
                        </p>
                      ) : (
                        <button
                          onClick={() => handleRequestOtp()}
                          className="text-xs font-semibold text-blue-700 transition hover:text-blue-800"
                        >
                          ¿No recibiste el código? Reenviar
                        </button>
                      )}
                    </div>
                  </>
                )}

                <p className="mt-6 text-center text-[11px] text-slate-500">
                  Acceso exclusivo para usuarios autorizados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

