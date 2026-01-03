import { useTheme } from "@/providers/ThemeProvider";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface SearchFooterProps {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  canSearch: boolean;
}

const SearchFooter = ({
  isLoading,
  isFetchingNextPage,
  canSearch,
}: SearchFooterProps) => {
  const { theme } = useTheme();
  const shouldShowLoader = (isLoading && canSearch) || isFetchingNextPage;
  if (!shouldShowLoader) return null;

  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator color={theme.colors.accentStrong} />
    </View>
  );
};

export default SearchFooter;

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 12,
  },
});
