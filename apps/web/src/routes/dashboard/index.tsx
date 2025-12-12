import { AppSidebar } from "@/components/app-sidebar";
import DashboardPage from "@/components/DashboardPage";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@clerk/clerk-react";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

export function Dashboard() {
  const { isSignedIn } = useUser();
  const router = useRouter();


  if (!isSignedIn) {
    router.navigate({ to: "/auth" });
    return null;
  }

  return (
    <SidebarProvider>

      <AppSidebar />

      <main className="flex-1 p-2">
        <SidebarTrigger />
        <DashboardPage />
        <Outlet />
      </main>

    </SidebarProvider>
  );
}
