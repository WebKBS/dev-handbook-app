import { db } from "@/db";
import { favoriteTable } from "@/db/schema/favorite.table";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

const FavoriteButton = () => {
  const handlePress = async () => {
    try {
      await db.insert(favoriteTable).values({
        slug: "test-slug",
        title: "Test Favorite",
        description: "테스트 즐겨찾기 항목입니다.",
        id: "test-id",
      });
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <TouchableOpacity style={styles.favoriteButton} onPress={handlePress}>
      <Ionicons name={"heart"} size={24} color={"#FF3B30"} />
    </TouchableOpacity>
  );
};

export default FavoriteButton;

const styles = StyleSheet.create({
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 6,
  },
});
