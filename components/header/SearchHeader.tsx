import SearchResultHeader from "@/components/header/SearchResultHeader";
import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { startTransition } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

interface SearchHeaderProps {
  query: string;
  setQuery: (query: string) => void;
  searchResults: any[];
  trimmedQuery: string;
}

const SearchHeader = ({
  query,
  setQuery,
  searchResults,
  trimmedQuery,
}: SearchHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.headerContainer}>
      {(Platform.OS === "android" || trimmedQuery.length === 0) && (
        <View
          style={[
            styles.hero,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <View
            style={[
              styles.heroBadge,
              {
                backgroundColor: theme.colors.accentSubtle,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Feather
              name="search"
              size={14}
              color={theme.colors.accentStrong}
            />
            <AppText
              weight="semibold"
              style={[styles.badgeText, { color: theme.colors.accentStrong }]}
            >
              SEARCH
            </AppText>
          </View>

          <AppText
            weight="extrabold"
            style={[styles.heroTitle, { color: theme.colors.text }]}
          >
            원하는 가이드를 바로 찾으세요
          </AppText>
          <AppText style={[styles.heroDesc, { color: theme.colors.muted }]}>
            키워드, 도메인, 문제 상황을 입력하면 연관된 핸드북을 추천합니다.
          </AppText>

          {Platform.OS === "android" && (
            <View
              style={[
                styles.searchInput,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              <Feather name="search" size={18} color={theme.colors.muted} />
              <TextInput
                placeholder="예: 상태관리 비교, 배포 파이프라인"
                placeholderTextColor={theme.colors.muted}
                style={[styles.inputField, { color: theme.colors.text }]}
                value={query}
                onChangeText={(text) =>
                  startTransition(() => {
                    setQuery(text);
                  })
                }
                returnKeyType="search"
              />
              {query.length > 0 && (
                <Pressable onPress={() => startTransition(() => setQuery(""))}>
                  <Feather name="x" size={16} color={theme.colors.muted} />
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}

      <SearchResultHeader count={searchResults.length} />
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  headerContainer: {
    gap: 20,
  },
  hero: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    gap: 12,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 30,
  },
  heroDesc: {
    fontSize: 15,
    lineHeight: 22,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
  },
});
