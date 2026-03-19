"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FilePlus2, FileText, LayoutDashboard } from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton";

const links = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/create-contract",
    label: "Crear contrato",
    icon: FilePlus2,
  },
  {
    href: "/dashboard/manage-contracts",
    label: "Administrar contratos",
    icon: FileText,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="p-2 rounded-xl bg-blue-100">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
            <p className="text-sm text-gray-500">Gestión de contratos</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <LogoutButton  />
      </div>
    </aside>
  );
}