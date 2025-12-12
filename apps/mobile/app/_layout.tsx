import {Slot} from "expo-router";
import {ClerkProvider} from "@clerk/clerk-expo";
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "@/providers/ThemeProvider";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";

export const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    delius: require("../assets/fonts/delius.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache}>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
