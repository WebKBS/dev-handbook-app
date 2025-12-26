import { useDomain } from "@/hooks/services/useDomain";
import { queryClient } from "@/libs/tanstack-query";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Platform, StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync().then().catch(console.error);

function RootLayoutNav() {
  const { mode, theme } = useTheme();
  const hideOnceRef = useRef(false);

  const [fontsLoaded, fontError] = useFonts({
    "Pretendard-ExtraBold": require("../assets/fonts/Pretendard-ExtraBold.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.otf"),
  });

  const { isPending, error: domainError } = useDomain();

  const fontsReady = fontsLoaded || !!fontError;
  const manifestReady = !isPending || !!domainError;

  useEffect(() => {
    if (!hideOnceRef.current && fontsReady && manifestReady) {
      hideOnceRef.current = true;
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsReady, manifestReady]);

  // 둘 다 준비되기 전에는 화면 렌더 자체를 막아서 깜빡임 방지
  // if (!fontsReady || !manifestReady) return <ErrorState />;

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
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
