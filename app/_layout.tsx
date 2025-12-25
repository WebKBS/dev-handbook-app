import { queryClient } from "@/libs/tanstack/tanstack-query";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync().then().catch(console.error);

function RootLayoutNav() {
  const { mode, theme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
      {Platform.OS === "ios" ? (
        <StatusBar
          backgroundColor={theme.colors.background}
          showHideTransition={"fade"}
          animated={true}
          barStyle={mode === "dark" ? "light-content" : "dark-content"}
          translucent={true}
        />
      ) : (
        <StatusBar
          backgroundColor={theme.colors.background}
          showHideTransition={"fade"}
          animated={true}
          barStyle={mode === "dark" ? "light-content" : "dark-content"}
        />
      )}
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Pretendard-ExtraBold": require("../assets/fonts/Pretendard-ExtraBold.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().then().catch(console.error);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
