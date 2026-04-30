// DashboardLayout.tsx
import BackButton from "@/components/common/RotuerBack";
import SessionInitializer from "@/components/dashboard/SessionInitializer";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/common/sidebar";
import { TooltipProvider } from "@/components/ui/common/tooltip";

import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-cyan/theme.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PrimeReactProvider>
        <SessionInitializer />
        <TooltipProvider>
          <DashboardSidebar />

          <SidebarInset className="min-w-0 overflow-hidden bg-slate-50/60">
            <header
              className="
                sticky top-0 z-40
                flex shrink-0 items-center justify-between
                border-b border-white/20
                bg-white/70 px-4 py-2.5
                backdrop-blur-xl
                supports-backdrop-filter:bg-white/60
                md:px-6
              "
            >
              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/80 via-white/60 to-white/80" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

              <div className="relative z-10 flex items-center gap-3">
                <SidebarTrigger className="cursor-pointer rounded-xl border border-transparent bg-white/40 p-2 transition hover:bg-white/70" />

                <BackButton />
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-white/40 bg-white/50 px-3 py-1.5 text-xs text-slate-600 shadow-sm backdrop-blur md:flex">
                  Sistema activo
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-3 py-1.5 text-sm shadow-sm backdrop-blur">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    A
                  </span>
                  Admin
                </div>
              </div>
            </header>

            <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </TooltipProvider>
      </PrimeReactProvider>
    </SidebarProvider>
  );
}