"use client";

import Link from "next/link";
import LogoutButton from "@/components/common/LogoutButton";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/common/sidebar";
import Image from "next/image";
import { Separator } from "../ui/common/separator";
import { links } from "@/lib/utils/sidebarInfo";

export default function DashboardSidebar() {

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="dark:bg-[#0A0A0A] bg-white">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">

          <div className="group-data-[collapsible=icon]:hidden flex items-center gap-2">
            <Image
              src="/assets/logo.webp"
              width={37}
              height={37}
              alt="Logo"
            />
          </div>

          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:ml-0 cursor-pointer border-none shadow-none bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
        </div>
      </SidebarHeader>

      <Separator/>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map(({ href, label, icon: Icon }) => {

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    className=" border-none shadow-none hover:bg-gray-100 dark:hover:bg-white/10 data-[active=true]:bg-blue-600 data-[active=true]:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 py-3 text-sm font-medium transition"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-white/10">
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}