import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

const HomeLayout = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        // iOS 네이티브 느낌 (큰 타이틀)
        headerLargeTitle: true,

        headerTitleStyle: {
          color: theme.colors.text,
          fontFamily: "Pretendard-Bold",
        },
        headerTintColor: theme.colors.accent,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="html/index"
        options={{
          title: "HTML",
          headerLeft: () => (
            <Pressable
              onPress={() => {
                router.back();
              }}
              hitSlop={10}
            >
              {/*hitSlop은 터치 영역을 확장해주는 속성입니다. */}
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
