import {
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";


export type SidebarLink = {
  href: string;
  label: string;
  icon: React.ElementType;
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