"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import LogoutButton from "@/components/common/LogoutButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/common/sidebar";
import { Separator } from "../ui/common/separator";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/common/dropDown";
import { linksUser, SidebarLink } from "@/lib/utils/userSidebarInfo";
import Image from "next/image";

export default function UserSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const renderLink = (link: SidebarLink) => {
    const { href, label, icon: Icon, children = [] } = link;

    const hasChildren = children.length > 0;
    const isActive = pathname === href;
    const isChildActive = children.some((child) => pathname === child.href);
    const isOpen = openMenus[href] ?? isChildActive;

    if (hasChildren && state === "expanded") {
      return (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            onClick={() => toggleMenu(href)}
            className={cn(
              "w-full cursor-pointer rounded-xl border border-transparent shadow-none transition-all duration-200",
              "hover:bg-slate-100 hover:text-slate-900",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              (isActive || isChildActive) &&
              "border-blue-100 bg-blue-50 text-blue-700"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
          </SidebarMenuButton>

          {isOpen && (
            <SidebarMenu className="ml-4 mt-2 space-y-1 border-l border-blue-100 pl-3">
              {children.map(
                ({ href: childHref, label: childLabel, icon: ChildIcon }) => (
                  <SidebarMenuItem key={childHref}>
                    <SidebarMenuButton
                      asChild
                      className="rounded-lg border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <Link
                        href={childHref}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                          "hover:bg-slate-100",
                          pathname === childHref && "bg-blue-50 text-blue-700"
                        )}
                      >
                        <ChildIcon className="h-4 w-4 shrink-0" />
                        <span>{childLabel}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          )}
        </SidebarMenuItem>
      );
    }

    if (hasChildren && state === "collapsed") {
      return (
        <SidebarMenuItem key={href} className="p-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={label}
                className={cn(
                  "w-full justify-center rounded-xl border border-transparent shadow-none transition-all",
                  "hover:bg-slate-100",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  (isActive || isChildActive) && "bg-blue-50 text-blue-700"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="right"
              align="start"
              className="w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
            >
              <div className="px-2 py-2 text-sm font-semibold text-slate-900">
                {label}
              </div>

              <div className="mt-1 flex flex-col gap-1">
                {children.map((sub) => {
                  const SubIcon = sub.icon;
                  const subActive = pathname === sub.href;

                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                        "hover:bg-slate-100",
                        subActive && "bg-blue-50 text-blue-700"
                      )}
                    >
                      <SubIcon className="h-4 w-4 shrink-0" />
                      <span>{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={href}>
        <SidebarMenuButton
          asChild
          tooltip={state === "collapsed" ? label : undefined}
          className={cn(
            "rounded-xl border border-transparent shadow-none transition-all duration-200",
            "hover:bg-slate-100 hover:text-slate-900",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            isActive && "border-blue-100 bg-blue-50 text-blue-700"
          )}
        >
          <Link
            href={href}
            className="flex items-center gap-3 py-2.5 text-sm font-medium transition"
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="hidden border-r border-slate-200 bg-white lg:flex"
    >
      <SidebarHeader className="bg-white group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-3 p-1 justify-center">
          <Image src={"/assets/logo_dimcultura.png"} alt="Logo Dimcultura" width={72} height={52} />
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>{linksUser.map(renderLink)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-3">
        <div className="rounded-2xl bg-slate-50 p-2">
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}