import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@clerk/clerk-react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {

    if (!isLoaded) return;

    if (!isSignedIn) {
      router.navigate({ to: "/auth" });
      return;
    }

    if (user.publicMetadata.role !== "ADMIN") {
      router.navigate({ to: "/unauthorized" });
      return;
    }

    router.navigate({ to: "/dashboard" });
  }, [isSignedIn, isLoaded, user, router]);

  if (!isLoaded) {
    return <Spinner />;
  }

  return null;
}
