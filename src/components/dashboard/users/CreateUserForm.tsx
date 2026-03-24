"use client";

import { useTransition, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosClient";

export default function CreateUserForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
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
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre
        </label>
        <input
          id="name" name="name" type="text" required placeholder="Juan Pérez"
          disabled={isPending}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Correo electrónico
        </label>
        <input
          id="email" name="email" type="email" required placeholder="juan@empresa.com"
          disabled={isPending}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Contraseña
        </label>
        <input
          id="password" name="password" type="password" required minLength={8}
          placeholder="Mínimo 8 caracteres"
          disabled={isPending}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
      >
        {isPending ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  );
}