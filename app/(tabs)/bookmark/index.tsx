import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import { AppText } from "@/components/text/AppText";
import { getBookmarkBySlug } from "@/db/queries/bookmark";
import type { Favorite } from "@/db/schema/bookmark.table";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  View,
} from "react-native";

export default function BookmarkScreen() {
  const { theme, mode } = useTheme();
  const { data } = useLiveQuery(getBookmarkBySlug());
  const bookmarks: Favorite[] = data;
  const isEmpty = bookmarks.length === 0;
  const accentTint =
    mode === "dark" ? "rgba(56,189,248,0.14)" : "rgba(14,165,233,0.12)";
  const cardTint =
    mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.88)";

  type BookmarkSection = { title: string; data: Favorite[] };

  const sections: BookmarkSection[] = useMemo(() => {
    const grouped = bookmarks.reduce<Record<string, Favorite[]>>(
      (acc, item) => {
        const domain = item.domain;
        if (!acc[domain]) acc[domain] = [];
        acc[domain].push(item);
        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([domain, items]) => ({ title: domain, data: items }));
  }, [bookmarks]);

  if (isEmpty) {
    return (
      <SafeAreaViewScreen>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior={"automatic"}
        >
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadow,
              },
            ]}
          >
            <View style={styles.heroBadgeRow}>
              <View
                style={[
                  styles.heroBadge,
                  {
                    backgroundColor: accentTint,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Feather
                  name="bookmark"
                  size={14}
                  color={theme.colors.accentStrong}
                />
                <AppText
                  weight="semibold"
                  style={[
                    styles.badgeText,
                    { color: theme.colors.accentStrong },
                  ]}
                >
                  BOOKMARKS
                </AppText>
              </View>
            </View>
            <AppText
              weight={"extrabold"}
              style={[styles.heroTitle, { color: theme.colors.text }]}
            >
              북마크가 비어 있습니다
            </AppText>
            <AppText
              style={[styles.heroSubtitle, { color: theme.colors.muted }]}
            >
              읽는 중 마음에 드는 페이지를 발견하면 우측 상단의 북마크 버튼으로
              바로 담아둘 수 있습니다. 저장한 내용은 오프라인에서도 유지돼요.
            </AppText>
            <View style={styles.tipRow}>
              <View
                style={[
                  styles.tipPill,
                  {
                    backgroundColor: cardTint,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Feather
                  name="zap"
                  size={14}
                  color={theme.colors.accentStrong}
                />
                <AppText
                  weight="semibold"
                  style={[styles.tipText, { color: theme.colors.text }]}
                >
                  빠르게 다시 읽기
                </AppText>
              </View>
              <View
                style={[
                  styles.tipPill,
                  {
                    backgroundColor: cardTint,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Feather
                  name="layers"
                  size={14}
                  color={theme.colors.accentStrong}
                />
                <AppText
                  weight="semibold"
                  style={[styles.tipText, { color: theme.colors.text }]}
                >
                  도메인 별로 정리
                </AppText>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaViewScreen>
    );
  }

  return (
    <SafeAreaViewScreen>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.slug}
        style={styles.container}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  shadowColor: theme.colors.shadow,
                },
              ]}
            >
              <View style={styles.heroBadgeRow}>
                <View
                  style={[
                    styles.heroBadge,
                    {
                      backgroundColor: accentTint,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="bookmark"
                    size={14}
                    color={theme.colors.accentStrong}
                  />
                  <AppText
                    weight="semibold"
                    style={[
                      styles.badgeText,
                      { color: theme.colors.accentStrong },
                    ]}
                  >
                    BOOKMARKS
                  </AppText>
                </View>
                <View
                  style={[
                    styles.countPill,
                    {
                      backgroundColor: cardTint,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="circle"
                    size={10}
                    color={theme.colors.accentStrong}
                  />
                  <AppText
                    weight="semibold"
                    style={[styles.countText, { color: theme.colors.text }]}
                  >
                    {bookmarks.length}개 저장됨
                  </AppText>
                </View>
              </View>
              <AppText
                weight={"extrabold"}
                style={[styles.heroTitle, { color: theme.colors.text }]}
              >
                다시 보고 싶은 섹션을 한곳에서
              </AppText>
              <AppText
                style={[styles.heroSubtitle, { color: theme.colors.muted }]}
              >
                도메인 별로 깔끔하게 정리된 북마크입니다. 탭하면 바로 해당
                콘텐츠로 이동해요.
              </AppText>
            </View>

            <View style={styles.sectionHeader}>
              <AppText
                weight="semibold"
                style={[styles.sectionTitle, { color: theme.colors.text }]}
              >
                내 북마크
              </AppText>
              <View
                style={[
                  styles.sectionBadge,
                  {
                    backgroundColor: accentTint,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Feather
                  name="list"
                  size={14}
                  color={theme.colors.accentStrong}
                />
                <AppText
                  weight="semibold"
                  style={[
                    styles.sectionBadgeText,
                    { color: theme.colors.accentStrong },
                  ]}
                >
                  {bookmarks.length}개
                </AppText>
              </View>
            </View>
          </View>
        }
        ListHeaderComponentStyle={styles.listHeaderSpacing}
        renderSectionHeader={({ section }) => (
          <View style={styles.domainHeader}>
            <View
              style={[
                styles.domainPill,
                {
                  backgroundColor: accentTint,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <AppText
                weight="semibold"
                style={[
                  styles.domainText,
                  { color: theme.colors.accentStrong },
                ]}
              >
                {section.title.toUpperCase()}
              </AppText>
            </View>
            <View
              style={[
                styles.sectionBadge,
                { backgroundColor: cardTint, borderColor: theme.colors.border },
              ]}
            >
              <Feather
                name="hash"
                size={14}
                color={theme.colors.accentStrong}
              />
              <AppText
                weight="semibold"
                style={[styles.sectionBadgeText, { color: theme.colors.text }]}
              >
                {section.data.length}개
              </AppText>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <Link href={`/home/${item.domain}/${item.slug}`} asChild>
            <Pressable
              style={[
                styles.card,
                {
                  backgroundColor: cardTint,
                  borderColor: theme.colors.border,
                  shadowColor: theme.colors.shadow,
                },
              ]}
              android_ripple={{ color: theme.colors.border }}
            >
              <View style={styles.cardHeader}>
                <AppText
                  weight={"bold"}
                  style={[styles.title, { color: theme.colors.text }]}
                  numberOfLines={2}
                >
                  {item.title}
                </AppText>
                <View
                  style={[
                    styles.arrowCircle,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="arrow-up-right"
                    size={16}
                    color={theme.colors.accentStrong}
                  />
                </View>
              </View>
              {item.description ? (
                <AppText
                  style={[styles.description, { color: theme.colors.muted }]}
                  numberOfLines={3}
                >
                  {item.description}
                </AppText>
              ) : null}
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        SectionSeparatorComponent={() => (
          <View style={styles.sectionSeparator} />
        )}
      />
    </SafeAreaViewScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  listHeader: {
    gap: 16,
  },
  listHeaderSpacing: {
    marginBottom: 10,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
    gap: 10,
  },
  heroCard: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
    gap: 12,
  },
  heroBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  tipRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tipPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipText: {
    fontSize: 13,
  },
  countPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  countText: {
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  domainHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
  },
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionBadgeText: {
    fontSize: 13,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  domainPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  domainText: {
    fontSize: 12,
    letterSpacing: 0.8,
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  itemSeparator: {
    height: 12,
  },
  sectionSeparator: {
    height: 20,
  },
});
