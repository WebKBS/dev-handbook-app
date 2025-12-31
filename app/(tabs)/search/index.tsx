import SearchListCard from "@/components/card/SearchListCard";
import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const docs = [
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
];

const SearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleHeaderSearch = (e: NativeSyntheticEvent<{ text: string }>) => {
    setQuery(e.nativeEvent.text);
  };

  useLayoutEffect(() => {
    // iOS에서만 헤더 검색바 설정
    navigation.setOptions({
      headerShown: true,
      headerSearchBarOptions: {
        placement: "automatic",
        placeholder: "검색",
        onChangeText: handleHeaderSearch,
        onFocus: () => {
          setIsFocused(true);
        },
        onBlur: () => {
          setIsFocused(false);
        },
      },
    });
  }, [navigation]);

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;

    return docs.filter((doc) => {
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.desc.toLowerCase().includes(q) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [query]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
        contentInsetAdjustmentBehavior={"automatic"}
        showsVerticalScrollIndicator={false}
      >
        {/* Android에서는 항상 표시, iOS에서는 검색 전에만 표시 */}
        {(Platform.OS === "android" || query.length === 0) && (
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

            {/* Android에서만 검색 입력창 표시 */}
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
                  onChangeText={setQuery}
                  returnKeyType="search"
                />
                {query.length > 0 && (
                  <Pressable onPress={() => setQuery("")}>
                    <Feather name="x" size={16} color={theme.colors.muted} />
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        <SearchListCard filteredDocs={filteredDocs} />
      </ScrollView>
    </TouchableWithoutFeedback>
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
    letterSpacing: 1,
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
});
