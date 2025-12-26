import { useTheme } from "@/providers/ThemeProvider";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      labelStyle={{ color: theme.colors.tabInactive }}
      tintColor={theme.colors.accent}
      backgroundColor={theme.colors.background}
      // 안드로이드는 이걸로 "기본/선택" 아이콘 색도 같이 잡아주는 편이 안전합니다.
      iconColor={{
        default: theme.colors.tabInactive,
        selected: theme.colors.accent,
      }}
    >
      <NativeTabs.Trigger name="home">
        <Label selectedStyle={{ color: theme.colors.accent }}>학습</Label>
        <Icon
          sf={{
            default: "book",
            selected: "book.fill",
          }}
          androidSrc={{
            default: require("@/assets/tabs/book.png"),
            selected: require("@/assets/tabs/book.png"),
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search/index" role="search">
        <Label>검색</Label>
        <Icon
          sf={{
            default: "magnifyingglass",
            selected: "magnifyingglass",
          }}
          androidSrc={{
            default: require("@/assets/tabs/search.png"),
            selected: require("@/assets/tabs/search.png"),
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bookmark/index">
        <Label selectedStyle={{ color: theme.colors.accent }}>북마크</Label>
        <Icon
          sf={{
            default: "bookmark",
            selected: "bookmark.fill",
          }}
          androidSrc={{
            default: require("@/assets/tabs/bookmark.png"),
            selected: require("@/assets/tabs/bookmark.png"),
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings/index">
        <Label selectedStyle={{ color: theme.colors.accent }}>설정</Label>
        <Icon
          sf={{
            default: "gearshape",
            selected: "gearshape.fill",
          }}
          androidSrc={{
            default: require("@/assets/tabs/settings.png"),
            selected: require("@/assets/tabs/settings.png"),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
