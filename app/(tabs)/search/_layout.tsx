import { useTheme } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";
import { Platform, View } from "react-native";

const SearchLayout = () => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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

          // 안드로이드 스타일
          headerStyle:
            Platform.OS === "android"
              ? { backgroundColor: theme.colors.background }
              : undefined,
          // 텍스트 위치
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "검색",
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
};

export default SearchLayout;
