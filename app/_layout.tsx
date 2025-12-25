import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync().then().catch(console.error);

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
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      {Platform.OS === "ios" ? (
        <StatusBar
          backgroundColor={"transparent"}
          showHideTransition={"fade"}
          animated={true}
          barStyle={"default"}
          translucent={true}
        />
      ) : (
        <StatusBar
          backgroundColor={"black"}
          showHideTransition={"fade"}
          animated={true}
          barStyle={"default"}
        />
      )}
    </>
  );
}
