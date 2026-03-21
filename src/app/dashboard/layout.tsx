import DashboardSidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/common/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen  flex w-full">
        <DashboardSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}