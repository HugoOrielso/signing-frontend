"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function LogoutButton() {
  const handleLogout = async () => {
    toast.loading("Signing out...");
    await signOut({ callbackUrl: "/login" });
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