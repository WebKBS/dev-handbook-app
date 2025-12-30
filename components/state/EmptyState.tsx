import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const EmptyState = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconCircle,
          { backgroundColor: theme.colors.accentSubtle },
        ]}
      >
        <Feather name="bookmark" size={32} color={theme.colors.accentStrong} />
      </View>
      <AppText
        weight="bold"
        style={[styles.heroTitle, { color: theme.colors.text }]}
      >
        북마크가 비어 있습니다
      </AppText>
      <AppText style={[styles.heroSubtitle, { color: theme.colors.muted }]}>
        마음에 드는 페이지를 담아보세요.
      </AppText>
    </View>
  );
};
export default EmptyState;

const styles = StyleSheet.create({
  // 빈 상태 스타일
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    textAlign: "center",
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  heroTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
