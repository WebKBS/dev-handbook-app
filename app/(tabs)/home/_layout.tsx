import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,

        // iOS 네이티브 느낌 (큰 타이틀)
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,

        // 헤더 그림자/구분선 조절 (플랫폼마다 다름)
        headerShadowVisible: false,

        // 가운데 타이틀(iOS는 largeTitle과 함께 쓰면 기본적으로 자연스러움)
        headerTitleAlign: "center",

        // 뒤로가기 아이콘/제스처는 기본이 네이티브스러움
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="html/index" options={{ title: "HTML" }} />
    </Stack>
  );
}
