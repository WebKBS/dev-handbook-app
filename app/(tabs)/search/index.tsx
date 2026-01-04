import SearchResultCard from "@/components/card/SearchResultCard";
import SearchEmptyResult from "@/components/empty/SearchEmptyResult";
import SearchFooter from "@/components/footer/SearchFooter";
import SearchHeader from "@/components/header/SearchHeader";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchInfinityQuery } from "@/hooks/useSearchInfinityQuery";
import { useTheme } from "@/providers/ThemeProvider";
import { SearchItem } from "@/services/content/search";
import { useNavigation } from "expo-router";
import {
  startTransition,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { FlatList, NativeSyntheticEvent, StyleSheet, View } from "react-native";

const DEBOUNCE_MS = 500;

const SearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const contentPaddingBottom = useContentPaddingBotton();

  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const trimmedQuery = debouncedQuery.trim();

  // (선택) 1글자 검색 호출 방지. 원치 않으면 1로 바꾸거나 제거.
  const MIN_LENGTH = 1;
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
      },
    });
  }, [navigation, handleHeaderSearch]);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useSearchInfinityQuery({
      canSearch,
      trimmedQuery,
    });

  // 검색 결과 가공은 useMemo로 안정화(렌더마다 재계산 방지)
  const searchResults: SearchItem[] = useMemo(() => {
    if (!canSearch) return [];
    if (!data?.pages) return [];

    return data.pages.flatMap((page) =>
      page.items.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        domain: item.domain,
        tags: item.tags ?? [],
        coverImage: item.coverImage,
      })),
    );
  }, [canSearch, data?.pages]);

  const renderEmptyComponent =
    canSearch && !isLoading ? () => <SearchEmptyResult /> : null;

  const total = data?.pages?.[0]?.total ?? 0;

  return (
    <FlatList
      data={searchResults}
      keyExtractor={(item) => item.id ?? item.title}
      renderItem={({ item }) => <SearchResultCard doc={item} />}
      ListHeaderComponent={
        <SearchHeader
          query={query}
          setQuery={setQuery}
          trimmedQuery={trimmedQuery}
          total={total}
        />
      }
      ListHeaderComponentStyle={styles.listHeaderSpacing}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={
        <SearchFooter
          canSearch={canSearch}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
        />
      }
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: contentPaddingBottom,
        },
      ]}
      style={{ backgroundColor: theme.colors.background }}
      keyboardDismissMode="on-drag"
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

  itemSeparator: {
    height: 12,
  },
});
