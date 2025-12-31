import {
  SearchEmptyResult,
  SearchResult,
  SearchResultCard,
  SearchResultHeader,
} from "@/components/card/SearchListCard";
import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { getSearch, SearchResponse } from "@/services/content/search";
import { Feather } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const DEBOUNCE_MS = 400; // 보통 300~500ms 추천

/**
 * Debounce hook
 * - 입력이 "멈춘 뒤" delay(ms) 후에만 값이 반영됨
 * - 검색/자동완성에 throttle보다 더 적합
 */
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debouncedValue;
};

const SearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [query, setQuery] = useState("");

  // debounce 적용
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const trimmedQuery = debouncedQuery.trim();

  // (선택) 1글자 검색 호출 방지. 원치 않으면 1로 바꾸거나 제거.
  const MIN_LENGTH = 2;
  const canSearch = trimmedQuery.length >= MIN_LENGTH;

  //  iOS 헤더 검색바 이벤트 핸들러: useCallback으로 고정 (setOptions 안정화)
  const handleHeaderSearch = useCallback(
    (e: NativeSyntheticEvent<{ text: string }>) => {
      const nextValue = e.nativeEvent.text;
      startTransition(() => setQuery(nextValue));
    },
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerSearchBarOptions: {
        placement: "automatic",
        placeholder: "검색",
        onChangeText: handleHeaderSearch,
        onFocus: () => {},
        onBlur: () => {},
      },
    });
  }, [navigation, handleHeaderSearch]);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<SearchResponse>({
      queryKey: ["searchDocs", trimmedQuery],
      queryFn: ({ pageParam = 1, signal }) =>
        getSearch({
          domain: "",
          q: trimmedQuery,
          page: pageParam as number,
          // ✅ getSearch가 fetch 기반이라면 signal을 받아 abort 가능하게 만들 수 있음
          // getSearch 쪽 타입이 안 받으면 제거해도 됨.
          signal,
        } as any),
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
        const nextPage = lastPage.page + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
      initialPageParam: 1,
      enabled: canSearch,
      // ✅ 캐시 전략 (원하면 조정)
      staleTime: 30_000, // 30초 동안은 동일 검색어 재진입 시 호출 억제
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  // 검색 결과 가공은 useMemo로 안정화(렌더마다 재계산 방지)
  const searchResults: SearchResult[] = useMemo(() => {
    if (!canSearch) return [];
    if (!data?.pages) return [];

    return data.pages.flatMap((page) =>
      page.items.map((item) => ({
        id: item.id,
        title: item.title,
        desc: item.description,
        category: item.domain
          ? item.domain.charAt(0).toUpperCase() + item.domain.slice(1)
          : "",
        icon: "file-text" as const,
        tags: item.tags ?? [],
      })),
    );
  }, [canSearch, data?.pages]);

  const renderHeader = () => (
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

  const renderItem = ({ item }: { item: SearchResult }) => (
    <SearchResultCard doc={item} />
  );

  const renderFooter = () => {
    const shouldShowLoader = (isLoading && canSearch) || isFetchingNextPage;
    if (!shouldShowLoader) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={theme.colors.accentStrong} />
      </View>
    );
  };

  const renderEmptyComponent =
    canSearch && !isLoading ? () => <SearchEmptyResult /> : null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id ?? item.title}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={styles.listHeaderSpacing}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
        style={{ backgroundColor: theme.colors.background }}
        contentInsetAdjustmentBehavior={"automatic"}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={() => {
          if (!canSearch || !hasNextPage || isFetchingNextPage) return;
          fetchNextPage();
        }}
        onEndReachedThreshold={0.6}
        removeClippedSubviews
      />
    </TouchableWithoutFeedback>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  listHeaderSpacing: {
    marginBottom: 20,
  },
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
  itemSeparator: {
    height: 12,
  },
  footerLoader: {
    paddingVertical: 12,
  },
});
