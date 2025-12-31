import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface SearchListCardProps {
  filteredDocs: {
    title: string;
    desc: string;
    category: string;
    icon: string;
    tags: string[];
  }[];
}

const SearchListCard = ({ filteredDocs }: SearchListCardProps) => {
  const { theme, mode } = useTheme();
  return (
    <>
      <View style={styles.sectionHeader}>
        <AppText
          weight="semibold"
          style={[styles.sectionTitle, { color: theme.colors.text }]}
        >
          검색 결과
        </AppText>
        <AppText style={{ color: theme.colors.muted }}>
          {filteredDocs.length}건
        </AppText>
      </View>

      {filteredDocs.length === 0 ? (
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
      ) : (
        <View style={styles.resultList}>
          {filteredDocs.map((doc) => (
            <View
              key={doc.title}
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
                  {doc.category}
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
                        backgroundColor:
                          mode === "dark"
                            ? theme.colors.card
                            : theme.colors.accentSubtle,
                      },
                    ]}
                  >
                    <AppText
                      style={[styles.tagText, { color: theme.colors.text }]}
                    >
                      #{tag}
                    </AppText>
                  </View>
                ))}
              </View>

              <View style={styles.resultFooter}>
                <AppText
                  weight="semibold"
                  style={[
                    styles.resultLink,
                    { color: theme.colors.accentStrong },
                  ]}
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
