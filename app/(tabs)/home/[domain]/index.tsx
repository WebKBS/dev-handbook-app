import DomainHeroCard from "@/components/card/DomainHeroCard";
import { AppText } from "@/components/text/AppText";
import { DomainHeroContent, DomainType } from "@/constants/domain";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const dataset = {
  version: 1,
  generatedAt: "2025-12-24T05:58:42.329Z",
  items: [
    {
      id: "css/what-is-css",
      domain: "css",
      slug: "what-is-css",
      title: "CSS란 무엇인가?",
      description:
        "CSS의 기본 개념과 역할, 필요성, 적용 방법, 동작 원리 등을 간략히 설명합니다.",
      tags: ["css", "style"],
      updatedAt: "2025-12-22",
      coverImage: "https://cdn.depos.kr/assets/covers/css.svg",
      order: 1,
    },
    {
      id: "html/what-is-html",
      domain: "html",
      slug: "what-is-html",
      title: "HTML이란 무엇인가",
      description: "HTML의 정의, 역할, 핵심 구성요소를 기초부터 정리합니다.",
      tags: ["html", "markup"],
      updatedAt: "2025-12-21",
      coverImage: "https://cdn.depos.kr/assets/covers/html.svg",
      order: 1,
    },
    {
      id: "html/what-is-markup-language",
      domain: "html",
      slug: "what-is-markup-language",
      title: "Markup Language란 무엇인가",
      description:
        "마크업 언어의 정의와 HTML에서 마크업이 어떤 의미를 가지는지 기초부터 정리합니다.",
      tags: ["html", "markup"],
      updatedAt: "2025-12-21",
      coverImage: "https://cdn.depos.kr/assets/covers/html.svg",
      order: 2,
    },
  ],
};

const HtmlScreen = () => {
  const { theme } = useTheme();
  const { domain } = useLocalSearchParams<{ domain: DomainType }>();
  const { bottom } = useSafeAreaInsets();

  console.log("Slug param:", domain);

  const htmlItems = dataset.items
    .filter((item) => item.domain === "html")
    .sort((a, b) => a.order - b.order);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: 40 + (Platform.OS === "android" ? bottom + 64 : 0),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <DomainHeroCard
        title={DomainHeroContent[domain].title}
        subtitle={DomainHeroContent[domain].subtitle}
      />
      <View style={styles.listHeader}>
        <AppText
          weight="bold"
          style={[styles.sectionTitle, { color: theme.colors.text }]}
        >
          학습 카드
        </AppText>
        <AppText style={[styles.sectionCaption, { color: theme.colors.muted }]}>
          기본 개념부터 순서대로 따라가보세요.
        </AppText>
      </View>

      <View style={styles.cardGrid}>
        {htmlItems.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadow,
              },
            ]}
          >
            <Image
              source={item.coverImage}
              style={[styles.cover, { backgroundColor: theme.colors.card }]}
              contentFit="contain"
            />
            <View style={styles.cardBody}>
              <AppText
                weight="semibold"
                style={[styles.cardTitle, { color: theme.colors.text }]}
              >
                {item.title}
              </AppText>
              <AppText
                style={[styles.cardDescription, { color: theme.colors.muted }]}
                numberOfLines={3}
              >
                {item.description}
              </AppText>
              <View style={styles.metaRow}>
                <View style={styles.tagRow}>
                  {item.tags.map((tag) => (
                    <View
                      key={tag}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: theme.colors.card,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <AppText
                        weight="medium"
                        style={[
                          styles.tagText,
                          { color: theme.colors.accentStrong },
                        ]}
                      >
                        #{tag}
                      </AppText>
                    </View>
                  ))}
                </View>
                <View style={styles.updatedRow}>
                  <Feather name="clock" size={14} color={theme.colors.muted} />
                  <AppText
                    style={[styles.updatedText, { color: theme.colors.muted }]}
                  >
                    {item.updatedAt}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HtmlScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  listHeader: {
    marginTop: 16,
    marginBottom: 8,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
  },
  sectionCaption: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardGrid: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  },
  cover: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    gap: 8,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
  },
  updatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  updatedText: {
    fontSize: 12,
  },
});
