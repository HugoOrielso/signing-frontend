import {
  LayoutDashboard,
  FileText,
  Users,
  UserPlus,
  FilePlus,
  FileCheck,
  FolderOpen,
} from "lucide-react";

export type UserRole = "ADMIN" | "OPERATOR" | "CREDIT_ANALYST";

export type SidebarLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  children?: Omit<SidebarLink, "children">[];
};

export const links: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "OPERATOR"],
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