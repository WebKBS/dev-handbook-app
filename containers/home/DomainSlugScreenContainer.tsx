import NonTitleStackScreen from "@/components/stack/NonTitleStackScreen";
import ErrorState from "@/components/state/ErrorState";
import { AppText } from "@/components/text/AppText";
import { DomainType } from "@/constants/domain";

import { markDone, markInProgress } from "@/db/readState";
import { ReadStatus } from "@/enums/readState.enum";
import BookmarkButton from "@/features/button/BookmarkButton";
import ReferencesWebBrowserCard from "@/features/card/ReferencesWebBrowserCard";
import { MarkdownView } from "@/features/markdown/MarkdownView";
import DomainSlugHeaderMoreMenu from "@/features/menu/DomainSlugHeaderMoreMenu";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useTheme } from "@/providers/ThemeProvider";
import { getPosts, Reference } from "@/services/content/post";
import { Feather } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// 스크롤뷰 상단에 고정되는 제목 높이
const STICKY_TITLE_HEIGHT = 34;

// 바닥 판정(심플)
const DONE_THRESHOLD_PX = 32;

// 너무 짧은 문서에서 “바닥=즉시 완료” 방지(심플 가드)
const MIN_SCROLL_Y_TO_COMPLETE = 24; // 최소 이 정도 내려야 완료
const MIN_OVERFLOW_TO_SCROLL = 80; // content가 viewport보다 이 정도 이상 길면 완료 허용

function pickFirst<T>(v: T | T[] | undefined): T | undefined {
  return Array.isArray(v) ? v[0] : v;
}

const DomainSlugScreenContainer = () => {
  const params = useLocalSearchParams<{
    slug: string;
    domain: DomainType;
  }>();

  // expo-router에서 가끔 string | string[] 들어오는 경우 방어
  const slug = pickFirst(params.slug);
  const domain = pickFirst(params.domain);

  const { theme } = useTheme();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["post", domain, slug],
    queryFn: () =>
      getPosts({ domain: domain as DomainType, slug: slug as string }),
    enabled: !!domain && !!slug, // params 없을 때 불필요 호출 방지
  });

  const content = data?.content;
  const meta = data?.meta;
  const readingMinutes = meta?.derived?.readingMinutes ?? meta?.readingMinutes;

  const references = data?.meta?.references;
  const referencesList: Reference[] = references ?? [];

  const contentPaddingBottom = useContentPaddingBotton();

  // 중복 저장/레이스 방지용 ref들
  const statusRef = useRef<ReadStatus>("unread");
  const markingDoneRef = useRef(false); // done 저장 중 lock
  const [readStatus, setReadStatus] = useState<ReadStatus>("unread");

  const updateStatus = useCallback((next: ReadStatus) => {
    statusRef.current = next;
    setReadStatus(next);
  }, []);

  // 1) 콘텐츠 준비되면 "읽는 중" 처리 (단, done이면 절대 덮지 않음)
  useEffect(() => {
    if (!content || !meta) return;
    if (!domain || !slug) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await markInProgress(domain, slug); // { status: "in_progress" | "done" }
        if (cancelled) return;

        // 레이스 방지: 이미 done이면 in_progress로 절대 덮지 않기
        if (statusRef.current !== "done") {
          updateStatus(res.status);
        }
      } catch {
        // 저장 실패는 화면에 치명적이지 않으니 무시(원하면 로깅)
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [content, meta, domain, slug, updateStatus]);

  // 2) 바닥 근처 도달 시 done 처리 (중복 저장/레이스 방지 포함)
  const onScroll = useCallback(
    async (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!domain || !slug) return;

      // 이미 done이거나, done 저장 중이면 skip
      if (statusRef.current === "done") return;
      if (markingDoneRef.current) return;

      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;

      const viewportH = layoutMeasurement.height;
      const contentH = contentSize.height;
      const y = contentOffset.y;

      const overflow = contentH - viewportH;
      const bottomDistance = contentH - (y + viewportH);

      const canCompleteByScroll =
        overflow >= MIN_OVERFLOW_TO_SCROLL || y >= MIN_SCROLL_Y_TO_COMPLETE;

      if (canCompleteByScroll && bottomDistance <= DONE_THRESHOLD_PX) {
        markingDoneRef.current = true; // lock

        try {
          const res = await markDone(domain, slug); // { status: "done" }
          updateStatus(res.status); // 이제는 무조건 done
        } catch {
          // 실패하면 lock 해제 후 재시도 가능
        } finally {
          markingDoneRef.current = false;
        }
      }
    },
    [domain, slug, updateStatus],
  );

  if (isPending) {
    return (
      <View style={styles.centered}>
        <NonTitleStackScreen />
        <ActivityIndicator size="small" color={theme.colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <NonTitleStackScreen />
        <ErrorState
          title="콘텐츠를 불러오는 중에 오류가 발생했습니다."
          onRetry={async () => {
            await refetch();
          }}
        />
      </View>
    );
  }

  if (!content || !meta) {
    return (
      <View style={styles.container}>
        <NonTitleStackScreen />
        <ScrollView
          contentInsetAdjustmentBehavior={"automatic"}
          style={styles.scrollViewContent}
        >
          <MarkdownView markdown={"# 콘텐츠를 불러올 수 없습니다."} />
        </ScrollView>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack.Screen
          options={{
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 8,
                }}
              >
                <BookmarkButton
                  domain={domain as DomainType}
                  slug={slug as string}
                  title={meta.title}
                  description={meta?.description}
                />
                <DomainSlugHeaderMoreMenu
                  domain={domain as DomainType}
                  slug={slug as string}
                  readStatus={readStatus}
                  onReadStatusChange={(next) => updateStatus(next)}
                />
              </View>
            ),
          }}
        />

        <View
          style={[
            styles.container,
            {
              paddingBottom: contentPaddingBottom,
            },
          ]}
        >
          <NonTitleStackScreen />

          <View
            pointerEvents="none"
            style={[
              styles.stickyTitle,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border,
              },
            ]}
          >
            <AppText
              weight="semibold"
              style={[styles.stickyTitleText, { color: theme.colors.accent }]}
              numberOfLines={1}
            >
              {meta.title}
            </AppText>
            {typeof readingMinutes === "number" && (
              <View
                style={[
                  styles.readingBadge,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Feather
                  name="clock"
                  size={13}
                  color={theme.colors.accentStrong}
                />
                <AppText
                  weight="semibold"
                  style={[styles.readingText, { color: theme.colors.muted }]}
                >
                  {`${readingMinutes}분 읽기`}
                </AppText>
              </View>
            )}
          </View>

          <ScrollView
            contentInsetAdjustmentBehavior={"automatic"}
            style={[
              styles.scrollViewContent,
              { paddingTop: STICKY_TITLE_HEIGHT },
            ]}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {/* 마크다운 내용 */}
            <MarkdownView markdown={content} />

            {/* 참고 링크 */}
            <ReferencesWebBrowserCard referencesList={referencesList} />
          </ScrollView>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default DomainSlugScreenContainer;

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stickyTitle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: STICKY_TITLE_HEIGHT,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  stickyTitleText: { fontSize: 14, flex: 1 },
  readingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  readingText: {
    fontSize: 12,
  },
});
