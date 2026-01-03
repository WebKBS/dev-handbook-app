import { db } from "@/db";
import { createBookmarks, deleteBookmark } from "@/db/queries/bookmark";
import { bookmarkTable } from "@/db/schema/bookmark.table";
import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Haptics from "expo-haptics";
import { startTransition, useOptimistic } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface BookmarkButtonProps {
  // 실제 앱에서는 아래 3개도 props로 받는 걸 추천
  slug: string;
  title: string;
  description?: string;
  domain: string;
}

const BookmarkButton = ({
  slug,
  title,
  description,
  domain,
}: BookmarkButtonProps) => {
  const { theme } = useTheme();

  const bookmarkQuery = db
    .select()
    .from(bookmarkTable)
    .where(eq(bookmarkTable.slug, slug));

  const { data } = useLiveQuery(bookmarkQuery);

  const isBookmark = (data?.length || 0) > 0;

  const [optimisticBookmark, setOptimisticBookmark] = useOptimistic(
    isBookmark,
    (_current, next: boolean) => next,
  );

  const handlePress = async () => {
    const next = !optimisticBookmark;

    startTransition(() => {
      // UI 즉시 반영
      setOptimisticBookmark(next);
    });

    try {
      if (next) {
        // 없으면 추가
        await createBookmarks({
          slug,
          title,
          domain,
          description,
        });
      } else {
        //  있으면 삭제
        await deleteBookmark(slug);
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  return (
    <TouchableOpacity
      style={styles.bookmarkButton}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={optimisticBookmark ? "bookmark" : "bookmark-outline"}
        size={24}
        color={optimisticBookmark ? "#FFD60A" : theme.colors.text}
      />
    </TouchableOpacity>
  );
};

export default BookmarkButton;

const styles = StyleSheet.create({
  bookmarkButton: {
    padding: 6,
  },
});
