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

interface SearchResultCardProps {
  doc: SearchResult;
}

const SearchResultCard = ({ doc }: SearchResultCardProps) => {
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
          {/*<Image */}
          {/*  source={doc.faviconUrl}*/}
          {/*  style={{ width: 16, height: 16 }}*/}
          {/*  contentFit="contain"*/}
          {/*/>*/}
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
export default SearchResultCard;

export const styles = StyleSheet.create({
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
});
