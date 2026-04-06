import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/common/sidebar";
import { TooltipProvider } from "@/components/ui/common/tooltip";
import UserSidebar from "@/components/users/userSidebar";
import LogoutButton from "@/components/common/LogoutButton";

export default async function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <UserSidebar />

        <SidebarInset>
          <header className="flex p-3 shrink-0 items-center justify-between border-b bg-white dark:bg-[#0A0A0A] px-4">
            {/* ✅ SidebarTrigger aquí controla el sidebar correctamente */}
            <SidebarTrigger className="cursor-pointer border-none shadow-none bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
            <LogoutButton />
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}