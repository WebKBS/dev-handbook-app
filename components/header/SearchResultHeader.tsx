import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, View } from "react-native";

const SearchResultHeader = ({ count }: { count: number }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <AppText
        weight="semibold"
        style={[styles.sectionTitle, { color: theme.colors.text }]}
      >
        검색 결과
      </AppText>
      <AppText style={{ color: theme.colors.muted }}>{count}건</AppText>
    </View>
  );
};

export default SearchResultHeader;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
  },
});
