import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/common/sidebar";
import { TooltipProvider } from "@/components/ui/common/tooltip";
import UserSidebar from "@/components/users/userSidebar";
import LogoutButton from "@/components/common/LogoutButton";
import { ShieldCheck } from "lucide-react";

export default async function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <UserSidebar />

        <SidebarInset className="bg-slate-50/60">
          <header
            className="
              sticky top-0 z-40
              flex shrink-0 items-center justify-between
              border-b border-white/20
              bg-white/70 px-4 py-3
              backdrop-blur-xl
              shadow-[0_8px_30px_rgba(15,23,42,0.05)]
              supports-backdrop-filter:bg-white/60
              md:px-6
            "
          >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/80 via-white/60 to-white/80" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

            {/* IZQUIERDA */}
            <div className="relative z-10 flex items-center gap-3">
              <SidebarTrigger className="cursor-pointer rounded-xl border border-transparent bg-white/40 p-2 transition hover:bg-white/70 focus-visible:ring-0 focus-visible:ring-offset-0" />

              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-800">
                  Portal de usuarios
                </p>
                <p className="text-xs text-slate-500">
                  Consulta, firma y seguimiento de documentos
                </p>
              </div>
            </div>

            {/* DERECHA */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-xs text-blue-700 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Acceso seguro
              </div>

              <div className="rounded-full border border-white/40 bg-white/50 p-1 shadow-sm backdrop-blur">
                <LogoutButton />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto ">
            {children}
          </main>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}