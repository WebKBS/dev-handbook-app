import { useTheme } from "@/providers/ThemeProvider";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      labelStyle={{
        color: theme.colors.tabInactive,
      }}
      tintColor={theme.colors.accent}
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
      <NativeTabs.Trigger name="search/index">
        <Label
          selectedStyle={{
            color: theme.colors.accent,
          }}
        >
          검색
        </Label>
        <Icon sf="magnifyingglass" drawable="custom_settings_drawable" />
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
    </NativeTabs>
  );
}
