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
      <div className="min-h-screen  flex w-full">
        <TooltipProvider>
          <DashboardSidebar />
        </TooltipProvider>
        <SidebarInset>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}