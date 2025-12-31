import { AppText } from "@/components/text/AppText";
import { Bookmark } from "@/db/schema/bookmark.table";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, View } from "react-native";

interface BookmarkScreenHeaderProps {
  bookmarks: Bookmark[];
  isEmpty: boolean;
}

const BookmarkScreenHeader = ({
  bookmarks,
  isEmpty,
}: BookmarkScreenHeaderProps) => {
  const { theme } = useTheme();

  return (
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
  );
};

export default BookmarkScreenHeader;

export const styles = StyleSheet.create({
  pageHeader: {
    marginTop: 20,
  },
  pageTitle: {
    fontSize: 28,
  },
});
