import ScreenHeroCard from "@/components/card/ScreenHeroCard";
import { Bookmark } from "@/db/schema/bookmark.table";
import { View } from "react-native";

interface BookmarkScreenHeaderProps {
  bookmarks: Bookmark[];
  isEmpty: boolean;
}

const BookmarkListHeader = ({
  bookmarks,
  isEmpty,
}: BookmarkScreenHeaderProps) => {
  if (isEmpty) {
    return null;
  }

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <ScreenHeroCard
        label="북마크"
        title={"북마크 모음"}
        subtitle={`총 ${bookmarks.length}개의 핸드북을 북마크했어요.`}
      />
    </View>
  );
};

export default BookmarkListHeader;
