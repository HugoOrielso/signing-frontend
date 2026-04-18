"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import api from "@/lib/axiosClient";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      setIsLoading(true);

      await api.post("/auth/login", {
        email,
        password,
      });

      router.replace("/dashboard");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { error?: string } } }).response
          ?.data?.error === "string"
          ? (error as { response?: { data?: { error?: string } } }).response!
              .data!.error!
          : "Correo o contraseña inválidos";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Correo</label>
        <div className="group relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type="email"
            name="email"
            placeholder="admin@dimcultura.com"
            autoComplete="email"
            required
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <div className="group relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-700 to-blue-500 px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition-all hover:scale-[1.01] hover:shadow-[0_18px_36px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogIn className="h-4 w-4" />
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        Acceso exclusivo para personal autorizado.
      </p>
    </form>
  );
}