import { getSearch, SearchResponse } from "@/services/content/search";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseSearchInfinityQueryProps {
  canSearch: boolean;
  trimmedQuery: string;
}

export const useSearchInfinityQuery = ({
  canSearch,
  trimmedQuery,
}: UseSearchInfinityQueryProps) => {
  // debounce 적용

  return useInfiniteQuery<SearchResponse>({
    queryKey: ["searchDocs", trimmedQuery],
    queryFn: ({ pageParam = 1, signal }) =>
      getSearch({
        domain: "",
        q: trimmedQuery,
        page: pageParam as number,
        // getSearch가 fetch 기반이라면 signal을 받아 abort 가능하게 만들 수 있음
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
    // 캐시 전략 (원하면 조정)
    staleTime: 30_000, // 30초 동안은 동일 검색어 재진입 시 호출 억제
    gcTime: 5 * 60_000,
  });
};
