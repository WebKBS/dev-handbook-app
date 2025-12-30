import { db } from "@/db";
import { bookmarkTable } from "@/db/schema/bookmark.table";
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
        await db
          .insert(bookmarkTable)
          .values({
            slug: slug,
            title: title,
            domain: domain,
            description: description ?? null,
          })
          .onConflictDoNothing(); // 중복 삽입 방지
      } else {
        //  있으면 삭제
        await db.delete(bookmarkTable).where(eq(bookmarkTable.slug, slug));
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  return (
    <TouchableOpacity style={styles.bookmarkButton} onPress={handlePress}>
      <Ionicons
        name={optimisticBookmark ? "bookmark" : "bookmark-outline"}
        size={24}
        color={optimisticBookmark ? "#FFD60A" : "#FFF"}
      />
    </TouchableOpacity>
  );
};

export default BookmarkButton;

const styles = StyleSheet.create({
  bookmarkButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 6,
  },
});
