import {
  LayoutDashboard,
  FileText,
  Users,
  UserPlus,
  FilePlus,
  FileCheck,
  FolderOpen,
  HandCoins,
  Users2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type UserRole = "ADMIN" | "OPERATOR" | "CREDIT_ANALYST";

export type SidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
  children?: Omit<SidebarLink, "children">[];
};

export const links: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "OPERATOR", "CREDIT_ANALYST"],
  },

  {
    href: "/dashboard/reports",
    label: "Reportes",
    icon: HandCoins,
    roles: ["ADMIN"],
    children: [
      {
        href: "/dashboard/reports/financial-summary",
        label: "Ingresos",
        icon: HandCoins,
        roles: ["ADMIN"],
      },
      // {
      //   href: "/dashboard/reports/operational",
      //   label: "Rendimiento",
      //   icon: Users2,
      //   roles: ["ADMIN"],
      // },
    ],
  },
  {
    href: "/dashboard/contracts/create",
    label: "Crear contrato",
    icon: FileText,
    roles: ["ADMIN", "OPERATOR"],
    children: [
      {
        href: "/dashboard/create-contract/dimcultura",
        label: "Dimcultura",
        icon: FilePlus,
        roles: ["ADMIN", "OPERATOR"],
      },
      {
        href: "/dashboard/create-contract/gruculcol",
        label: "Gruculcol",
        icon: FileCheck,
        roles: ["ADMIN", "OPERATOR"],
      },
    ],
  },
  {
    href: "/dashboard/manage-contracts",
    label: "Administrar contratos",
    icon: FolderOpen,
    roles: ["ADMIN", "OPERATOR", "CREDIT_ANALYST"],
  },
  {
    href: "/dashboard/users",
    label: "Usuarios",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    href: "/dashboard/users/create",
    label: "Crear usuario",
    icon: UserPlus,
    roles: ["ADMIN"],
  },
];