import { useUser } from "@clerk/clerk-react";
import { useRouter } from "@tanstack/react-router";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    if (!isLoaded) return null;


    if (!isSignedIn) {
        router.navigate({ to: "/auth" });
        return null;
    }

    const role = user?.publicMetadata?.role;
    if (role !== "ADMIN") {
        router.navigate({ to: "/unauthorized" });
        return null;
    }

    return <>{children}</>;
}
