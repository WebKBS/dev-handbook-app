import { useTheme } from "@/providers/ThemeProvider";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      labelStyle={{
        color: theme.colors.tabInactive,
      }}
      tintColor={theme.colors.accent}
      // 안드로이드 스타일
      backgroundColor={theme.colors.background}
    >
      <NativeTabs.Trigger name="home">
        <Label
          selectedStyle={{
            color: theme.colors.accent,
          }}
        >
          학습
        </Label>
        <Icon sf="book" drawable="custom_settings_drawable" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bookmark/index">
        <Label
          selectedStyle={{
            color: theme.colors.accent,
          }}
        >
          북마크
        </Label>
        <Icon sf="bookmark" drawable="custom_settings_drawable" />
      </NativeTabs.Trigger>
      {/* 설정 */}
      <NativeTabs.Trigger name="settings/index">
        <Label
          selectedStyle={{
            color: theme.colors.accent,
          }}
        >
          설정
        </Label>
        <Icon sf="gearshape" drawable="custom_settings_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search/index" role={"search"}>
        <Label>검색</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
