"use client";

import api from "@/lib/axiosClient";
import { useSessionStore } from "@/store/adminSession";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function LogoutButton() {
  const clearSession = useSessionStore((s) => s.clearSession);

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out...");

    try {
      await api.post("/auth/logout");

      clearSession();

      toast.success("Signed out successfully", { id: toastId });

      window.location.href = "/auth";
    } catch {
      toast.error("Failed to sign out. Try again.", { id: toastId });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-700"
    >
      <LogOut className="h-3 w-3" />
      <span>Cerrar sesión</span>
    </button>
  );
}