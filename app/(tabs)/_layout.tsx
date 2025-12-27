import { useTheme } from "@/providers/ThemeProvider";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      backgroundColor={theme.colors.background}
      tintColor={theme.colors.accent}
      labelStyle={{
        default: { color: theme.colors.tabInactive },
        selected: { color: theme.colors.accent },
      }}
      iconColor={{
        default: theme.colors.tabInactive,
        selected: theme.colors.accent,
      }}
      // 안드로이드 active 배경(알약 모양) 색
      indicatorColor={theme.colors.border ?? theme.colors.tabInactive}
      // 눌렀을 때 퍼지는 물결 색도 조절하고 싶으면
    >
      <NativeTabs.Trigger name="home">
        <Label>학습</Label>
        <Icon
          sf={{ default: "book", selected: "book.fill" }}
          androidSrc={{
            default: require("@/assets/tabs/book.png"),
            selected: require("@/assets/tabs/book.png"),
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search/index" role="search">
        <Label>검색</Label>
        <Icon
          sf={{ default: "magnifyingglass", selected: "magnifyingglass" }}
          androidSrc={{
            default: require("@/assets/tabs/search.png"),
            selected: require("@/assets/tabs/search.png"),
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bookmark/index">
        <Label>북마크</Label>
        <Icon
          sf={{ default: "bookmark", selected: "bookmark.fill" }}
          androidSrc={{
            default: require("@/assets/tabs/bookmark.png"),
            selected: require("@/assets/tabs/bookmark.png"),
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings/index">
        <Label>설정</Label>
        <Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          androidSrc={{
            default: require("@/assets/tabs/settings.png"),
            selected: require("@/assets/tabs/settings.png"),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
