import SearchResultCard from "@/components/card/SearchResultCard";
import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export type SearchResult = {
  id?: string;
  title: string;
  desc: string;
  domain: string;
  icon: string;
  tags: string[];
};

interface SearchListCardProps {
  filteredDocs: SearchResult[];
}

export const SearchResultHeader = ({ count }: { count: number }) => {
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

export const SearchEmptyResult = () => {
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

const SearchListCard = ({ filteredDocs }: SearchListCardProps) => {
  return (
    <>
      <SearchResultHeader count={filteredDocs.length} />

      {filteredDocs.length === 0 ? (
        <SearchEmptyResult />
      ) : (
        <View style={styles.resultList}>
          {filteredDocs.map((doc) => (
            <SearchResultCard
              key={doc.id ?? doc.title}
              doc={{ ...doc, id: doc.id ?? doc.title }}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default SearchListCard;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
  },

  resultList: {
    gap: 12,
  },

  emptyResult: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
