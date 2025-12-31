import RecommendCardList from "@/components/card/RecommendCardList";
import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const SearchScreen = () => {
  const { theme, mode } = useTheme();
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("전체");

  const docs = useMemo(
    () => [
      {
        title: "React Query 베스트 프랙티스",
        desc: "캐싱, Suspense, 무한 스크롤 패턴 정리",
        category: "Frontend",
        domain: "web",
        tags: ["react", "state", "cache"],
        icon: "layers",
      },
      {
        title: "Drizzle 스키마 가이드",
        desc: "SQLite 환경에서의 스키마 설계와 마이그레이션",
        category: "API",
        domain: "backend",
        tags: ["drizzle", "sqlite", "orm"],
        icon: "database",
      },
      {
        title: "CI/CD 체크리스트",
        desc: "테스트, 빌드, 배포 파이프라인 기본 세팅",
        category: "DevOps",
        domain: "ops",
        tags: ["ci", "cd", "github actions"],
        icon: "git-commit",
      },
      {
        title: "디자인 토큰 정리",
        desc: "Typography, spacing, color 토큰 구조",
        category: "Frontend",
        domain: "design",
        tags: ["design tokens", "ui", "guideline"],
        icon: "droplet",
      },
      {
        title: "테스트 전략 101",
        desc: "단위/통합/엔드투엔드 테스트 우선순위",
        category: "Testing",
        domain: "quality",
        tags: ["testing", "coverage", "playwright"],
        icon: "check-circle",
      },
    ],
    [],
  );

  const filters = useMemo(
    () => ["전체", "API", "Frontend", "DevOps", "Testing", "Culture"],
    [],
  );

  const history = useMemo(
    () => [
      "react-query",
      "drizzle schema",
      "CI/CD",
      "markdown",
      "design tokens",
    ],
    [],
  );

  const handleHeaderSearch = (e: NativeSyntheticEvent<{ text: string }>) => {
    setQuery(e.nativeEvent.text);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placement: "automatic",
        placeholder: "검색",
        onChangeText: handleHeaderSearch,
      },
    });
  }, [navigation]);

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter((doc) => {
      const matchFilter =
        selectedFilter === "전체" || doc.category === selectedFilter;
      if (!matchFilter) return false;
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.desc.toLowerCase().includes(q) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [docs, query, selectedFilter]);

  return (
    <SafeAreaViewScreen>
      <ScrollView
        contentContainerStyle={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
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
          <View style={styles.heroBadgeRow}>
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
            <AppText style={[styles.helper, { color: theme.colors.muted }]}>
              엔터로 바로 이동
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
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery("")}>
                <Feather name="x" size={16} color={theme.colors.muted} />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.filterRow}>
            {filters.map((filter) => (
              <Pressable
                key={filter}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      selectedFilter === filter
                        ? theme.colors.accentSubtle
                        : "transparent",
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <AppText
                  weight="semibold"
                  style={[
                    styles.chipText,
                    {
                      color:
                        selectedFilter === filter
                          ? theme.colors.text
                          : theme.colors.muted,
                    },
                  ]}
                >
                  {filter}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <AppText
            weight="semibold"
            style={[styles.sectionTitle, { color: theme.colors.text }]}
          >
            최근 검색
          </AppText>
          <Feather name="clock" size={16} color={theme.colors.muted} />
        </View>
        <View style={styles.historyRow}>
          {history.map((item) => (
            <Pressable
              key={item}
              style={[
                styles.historyChip,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Feather name="rotate-ccw" size={14} color={theme.colors.muted} />
              <AppText style={{ color: theme.colors.text }}>{item}</AppText>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <AppText
            weight="semibold"
            style={[styles.sectionTitle, { color: theme.colors.text }]}
          >
            추천 핸드북
          </AppText>
          <Feather name="star" size={16} color={theme.colors.accentStrong} />
        </View>

        {/* 추천 카드 리스트 컴포넌트 */}
        <RecommendCardList />

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
                    style={[
                      styles.resultCategory,
                      { color: theme.colors.muted },
                    ]}
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
      </ScrollView>
    </SafeAreaViewScreen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    paddingBottom: 32,
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
  heroBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  helper: {
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.3,
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
  },
  historyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  historyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
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
