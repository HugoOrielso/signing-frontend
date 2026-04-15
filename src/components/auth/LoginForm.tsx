"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import api from "@/lib/axiosClient";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");


    try {
      await api.post("/auth/login", {
        email,
        password,
      });

      router.replace("/dashboard")


    } catch (error: unknown) {

      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { error?: string } } }).response?.data?.error === "string"
          ? (error as { response?: { data?: { error?: string } } }).response!.data!.error!
          : "Invalid email or password";

      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="admin@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-9 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
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
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </button>
    </form>
  );
}