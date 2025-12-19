import {Stack} from "expo-router";
import {ClerkProvider} from "@clerk/clerk-expo";
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "@/providers/ThemeProvider";
import {CurrencyProvider} from "@/providers/CurrencyProvider";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import {GestureHandlerRootView} from "react-native-gesture-handler";

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
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider tokenCache={tokenCache}>
          <ThemeProvider>
            <CurrencyProvider>
              <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(auth)" options={{headerShown: false}} />
                <Stack.Screen name="(home)" options={{headerShown: false}} />
                <Stack.Screen
                  name="edit-subscription"
                  options={{
                    presentation: "modal",
                    headerShown: false,
                  }}
                />
              </Stack>
            </CurrencyProvider>
          </ThemeProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
