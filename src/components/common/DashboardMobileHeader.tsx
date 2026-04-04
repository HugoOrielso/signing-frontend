"use client";

import { SidebarTrigger } from "@/components/ui/common/sidebar";

export default function DashboardMobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 dark:border-white/10 dark:bg-[#0A0A0A] lg:hidden">
      <div className="text-main font-semibold">Dimcultura</div>

      <SidebarTrigger className="cursor-pointer border-none bg-transparent shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
    </header>
  );
}