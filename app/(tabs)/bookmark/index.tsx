import BookmarkItemCard from "@/components/card/BookmarkItemCard";
import BookmarkListHeader from "@/components/header/BookmarkListHeader";
import BookmarkSectionHeader from "@/components/header/BookmarkSectionHeader";
import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import EmptyState from "@/components/state/EmptyState";
import { getBookmarkBySlug } from "@/db/queries/bookmark";
import type { Bookmark } from "@/db/schema/bookmark.table";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { SectionList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookmarkScreen() {
  const insets = useSafeAreaInsets();
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
          <BookmarkListHeader bookmarks={bookmarks} isEmpty={isEmpty} />
        }
        ListEmptyComponent={<EmptyState />}
        renderSectionHeader={({ section }) => (
          <BookmarkSectionHeader section={section} />
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
});
