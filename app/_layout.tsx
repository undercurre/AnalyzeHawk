import { Slot, SplashScreen } from "expo-router";
import { SessionProvider } from "@/components/auth/ctx";
import { useEffect } from "react";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
