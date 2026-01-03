import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const SearchEmptyResult = () => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.emptyResult,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.cardBg,
        },
      ]}
    >
      <Feather name="search" size={16} color={theme.colors.muted} />
      <AppText style={{ color: theme.colors.muted }}>
        결과가 없습니다. 다른 키워드를 시도해 보세요.
      </AppText>
    </View>
  );
};
export default SearchEmptyResult;

const styles = StyleSheet.create({
  emptyResult: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
