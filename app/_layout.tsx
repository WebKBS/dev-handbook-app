import { db, dbName } from "@/db";
import migrations from "@/db/migrations/migrations";
import HeaderBackButton from "@/features/button/HeaderBackButton";
import OpenUrlLinkButton from "@/features/button/OpenUrlLinkButton";
import { useDomain } from "@/hooks/services/useDomain";
import { queryClient } from "@/libs/tanstack-query";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect, useRef } from "react";
import { Platform, StatusBar, View } from "react-native";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://81bd59531404d96ddad216a563fa5c94@o4510555343552512.ingest.us.sentry.io/4510645767372800",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.preventAutoHideAsync().then().catch(console.error);

function RootLayoutNav() {
  const { success, error: dbError } = useMigrations(db, migrations);

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
  const dbReady = success || !!dbError;

  useEffect(() => {
    if (!hideOnceRef.current && fontsReady && manifestReady && dbReady) {
      hideOnceRef.current = true;
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [dbReady, fontsReady, manifestReady]);

  // 둘 다 준비되기 전에는 화면 렌더 자체를 막아서 깜빡임 방지
  // if (!fontsReady || !manifestReady) return <ErrorState />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="detail" />

        <Stack.Screen
          name="reference-modal/index"
          options={({ navigation }) => ({
            presentation: "pageSheet",
            animation: "slide_from_bottom",
            headerShown: true,
            title: "참고 자료",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTitleStyle: { color: theme.colors.text },
            headerTintColor: theme.colors.text,
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerBackVisible: false,

            headerLeft: () => <HeaderBackButton navigation={navigation} />,

            headerRight: () => <OpenUrlLinkButton />,
          })}
        />
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
    </View>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ThemeProvider>
      <SQLiteProvider databaseName={dbName}>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
});
