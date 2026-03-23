"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axiosClient";

export default function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out...");

    try {
      // 1. Revocar refresh token en BD
      await api.post("/auth/logout", { refreshToken: session?.refreshToken });

      // 2. Destruir sesión de Next-Auth
      await signOut({ callbackUrl: "/" });
      toast.dismiss(toastId);
    } catch {
      toast.error("Failed to sign out. Try again.", { id: toastId });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition font-medium"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}