import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { replaceDomainText } from "@/utils/replaceDomainText";
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

export const SearchResultCard = ({ doc }: { doc: SearchResult }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.resultCard,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <View style={styles.resultHeader}>
        <View
          style={[
            styles.resultIcon,
            {
              backgroundColor: theme.colors.accentSubtle,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Feather
            name={doc.icon as any}
            size={14}
            color={theme.colors.accentStrong}
          />
        </View>
        <AppText
          weight="semibold"
          style={[styles.resultCategory, { color: theme.colors.muted }]}
        >
          {replaceDomainText(doc.domain)}
        </AppText>
      </View>

      <AppText
        weight="bold"
        style={[styles.resultTitle, { color: theme.colors.text }]}
        numberOfLines={2}
      >
        {doc.title}
      </AppText>
      <AppText
        style={[styles.resultDesc, { color: theme.colors.muted }]}
        numberOfLines={2}
      >
        {doc.desc}
      </AppText>

      <View style={styles.tagRow}>
        {doc.tags.map((tag) => (
          <View
            key={tag}
            style={[
              styles.tagChip,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.cardBg,
              },
            ]}
          >
            <AppText style={[styles.tagText, { color: theme.colors.text }]}>
              #{tag}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.resultFooter}>
        <AppText
          weight="semibold"
          style={[styles.resultLink, { color: theme.colors.accentStrong }]}
        >
          문서로 이동
        </AppText>
        <Feather
          name="arrow-up-right"
          size={16}
          color={theme.colors.accentStrong}
        />
      </View>
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
  resultCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    gap: 8,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resultIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  resultCategory: {
    fontSize: 12,
  },
  resultTitle: {
    fontSize: 17,
    lineHeight: 24,
  },
  resultDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
  },
  resultFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  resultLink: {
    fontSize: 13,
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
