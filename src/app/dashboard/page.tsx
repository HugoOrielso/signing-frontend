import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <LogoutButton />
        </div>

      </div>
    </div>
  );
}