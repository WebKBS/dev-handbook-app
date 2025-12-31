import { DomainType } from "@/constants/domain";
import BackButton from "@/features/button/BackButton";
import { useTheme } from "@/providers/ThemeProvider";
import { Stack, useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

const DetailLayout = () => {
  const { theme } = useTheme();

  const { domain } = useGlobalSearchParams<{ domain: DomainType }>();

  return (
    // 배경색을 테마에 맞게 설정
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack>
        <Stack.Screen
          name="[domain]/[slug]/index"
          options={{
            // animation: "none",
            title: domain?.toUpperCase(),
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack>
    </View>
  );
};

export default DetailLayout;
