import BookmarkItemCard from "@/components/card/BookmarkItemCard";
import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import EmptyState from "@/components/state/EmptyState";
import { AppText } from "@/components/text/AppText";
import { getBookmarkBySlug } from "@/db/queries/bookmark";
import type { Bookmark } from "@/db/schema/bookmark.table";
import { useTheme } from "@/providers/ThemeProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { SectionList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookmarkScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  // 오류 방지: data가 undefined일 경우를 대비해 기본값 [] 설정
  const { data } = useLiveQuery(getBookmarkBySlug());
  const bookmarks: Bookmark[] = data ?? [];

  const isEmpty = bookmarks.length === 0;

  const groupToSections = (items: Bookmark[]) => {
    const grouped = items.reduce<Record<string, Bookmark[]>>((acc, item) => {
      const domain = item.domain ?? "기타";
      (acc[domain] ??= []).push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  };

  const sections = groupToSections(bookmarks);

  const isSkeleton = !data;

  return (
    <SafeAreaViewScreen>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.slug}
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
        contentInsetAdjustmentBehavior={"automatic"}
        stickySectionHeadersEnabled
        ListHeaderComponent={
          <View style={styles.pageHeader}>
            <AppText
              weight="extrabold"
              style={[styles.pageTitle, { color: theme.colors.text }]}
            >
              북마크
            </AppText>
            {!isEmpty && (
              <AppText style={{ color: theme.colors.muted }}>
                총 {bookmarks.length}개의 저장됨
              </AppText>
            )}
          </View>
        }
        ListEmptyComponent={<EmptyState />}
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.domainHeader,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <View
              style={[
                styles.domainPill,
                {
                  backgroundColor: theme.colors.accentSubtle,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <AppText
                weight="bold"
                style={[
                  styles.domainText,
                  { color: theme.colors.accentStrong },
                ]}
              >
                {section.title.toUpperCase()}
              </AppText>
            </View>
            <View style={styles.headerLine} />
          </View>
        )}
        renderItem={({ item }) => (
          <BookmarkItemCard
            item={item}
            href={`/bookmark`}
            isSkeleton={isSkeleton}
          />
        )}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaViewScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 12,
  },
  pageHeader: {
    marginTop: 20,
  },
  pageTitle: {
    fontSize: 28,
  },

  // 섹션 헤더 스타일
  domainHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  domainPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  domainText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(150,150,150,0.1)",
  },
});
