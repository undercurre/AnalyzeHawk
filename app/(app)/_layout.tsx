import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/components/auth/ctx";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { session } = useSession();

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "home",
};
