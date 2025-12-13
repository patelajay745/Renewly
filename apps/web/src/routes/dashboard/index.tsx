// routes/dashboard/index.tsx
import { AppSidebar } from "@/components/app-sidebar";
import DashboardPage from "@/components/DashboardPage";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

export function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.navigate({ to: "/auth" });
      return;
    }

    if (user?.publicMetadata?.role !== "ADMIN") {
      router.navigate({ to: "/unauthorized" });
      return;
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Don't render dashboard if not authorized
  if (!isSignedIn || user?.publicMetadata?.role !== "ADMIN") {
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