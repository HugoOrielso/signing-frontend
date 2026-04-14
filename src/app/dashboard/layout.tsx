// DashboardLayout.tsx
import SessionInitializer from "@/components/dashboard/SessionInitializer";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/common/sidebar";
import { TooltipProvider } from "@/components/ui/common/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SessionInitializer/>
      <TooltipProvider>
        <DashboardSidebar />

        <SidebarInset>
          {/* Header dentro del main — visible en desktop y mobile */}
          <header className="flex p-2.5 shrink-0 items-center gap-3 border-b bg-white dark:bg-[#0A0A0A] ">
            {/* ✅ SidebarTrigger aquí, fuera del Sidebar, controla el collapse */}
            <SidebarTrigger className="cursor-pointer border-none shadow-none bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}