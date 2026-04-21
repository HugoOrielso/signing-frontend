import {
  LayoutDashboard,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";


export type SidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: Omit<SidebarLink, "children">[];
};


export const linksUser: SidebarLink[] = [
  {
    href: "/users",
    label: "Inicio",
    icon: LayoutDashboard,
  },
  {
    href: "/users/contracts",
    label: "Mis solicitudes",
    icon: ClipboardList,
  }
];