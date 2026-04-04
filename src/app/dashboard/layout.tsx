import DashboardMobileHeader from "@/components/common/DashboardMobileHeader";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/common/sidebar";
import { TooltipProvider } from "@/components/ui/common/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <DashboardSidebar />

          <SidebarInset className="flex min-h-screen flex-1 flex-col">
            <DashboardMobileHeader />

            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}