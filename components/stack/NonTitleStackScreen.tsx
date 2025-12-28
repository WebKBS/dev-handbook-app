import { useTheme } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";

const NonTitleStackScreen = () => {
  const { theme } = useTheme();
  return (
    <Stack.Screen
      options={{
        title: "",
        headerLargeTitle: false,
        headerTintColor: theme.colors.accent,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  );
};

export default NonTitleStackScreen;
