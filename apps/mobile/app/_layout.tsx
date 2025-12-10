import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient} >
      <ClerkProvider tokenCache={tokenCache}>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
