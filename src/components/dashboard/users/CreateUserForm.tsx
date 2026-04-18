"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosClient";
import { Mail, Lock, User } from "lucide-react";

export default function CreateUserForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    const { email, name, password } = Object.fromEntries(formData) as {
      email: string;
      name: string;
      password: string;
    };

    startTransition(async () => {
      try {
        await api.post("/auth/register", { email, name, password });
        toast.success("Usuario creado correctamente");
        router.push("/dashboard/users");
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.error ?? "Error al crear usuario"
          : "Error inesperado";

        toast.error(message);
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Nombre
        </label>

        <div className="group relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Juan Pérez"
            disabled={isPending}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Correo electrónico
        </label>

        <div className="group relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="juan@empresa.com"
            disabled={isPending}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>

        <div className="group relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            disabled={isPending}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <p className="text-xs text-slate-500">
          Usa una contraseña segura de al menos 8 caracteres.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-linear-to-r from-blue-700 to-blue-500 px-4 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(37,99,235,0.22)] transition-all hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  );
}