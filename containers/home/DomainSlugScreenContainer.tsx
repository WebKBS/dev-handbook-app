import NonTitleStackScreen from "@/components/stack/NonTitleStackScreen";
import ErrorState from "@/components/state/ErrorState";
import { AppText } from "@/components/text/AppText";
import { DomainType } from "@/constants/domain";
import BookmarkButton from "@/features/button/BookmarkButton";
import ReferencesWebBrowserCard from "@/features/card/ReferencesWebBrowserCard";
import { MarkdownView } from "@/features/markdown/MarkdownView";
import DomainSlugHeaderMoreMenu from "@/features/menu/DomainSlugHeaderMoreMenu";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useTheme } from "@/providers/ThemeProvider";
import { getPosts, Reference } from "@/services/content/post";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  LayoutRectangle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const DomainSlugScreenContainer = () => {
  const { slug, domain } = useLocalSearchParams<{
    slug: string;
    domain: DomainType;
  }>();

  const { theme } = useTheme();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["post", domain, slug],
    queryFn: () => getPosts({ domain, slug }),
  });

  const content = data?.content;
  const meta = data?.meta;
  const references = data?.meta?.references;
  const referencesList: Reference[] = references ?? [];

  const contentPaddingBottom = useContentPaddingBotton();
  const [headingHeight, setHeadingHeight] = useState<number | null>(null);
  const [isStickyTitleVisible, setIsStickyTitleVisible] = useState(false);

  useEffect(() => {
    setHeadingHeight(null);
    setIsStickyTitleVisible(false);
  }, [content, meta?.title]);

  const handleHeadingLayout = useCallback(
    (layout: LayoutRectangle) => {
      if (headingHeight !== null) return;
      const marginBuffer = 28; // markdown heading 상단/하단 여백 보정
      setHeadingHeight(layout.height + marginBuffer);
    },
    [headingHeight],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (headingHeight === null) return;
      const offsetY = event.nativeEvent.contentOffset.y;
      const shouldShow = offsetY >= headingHeight;
      setIsStickyTitleVisible((prev) =>
        prev === shouldShow ? prev : shouldShow,
      );
    },
    [headingHeight],
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
                  domain={domain}
                  slug={slug}
                  title={meta.title}
                  description={meta?.description}
                />
                <DomainSlugHeaderMoreMenu slug={slug} domain={domain} />
              </View>
            ),
          }}
        />
        <View
          style={[styles.container, { paddingBottom: contentPaddingBottom }]}
        >
          <NonTitleStackScreen />
          {isStickyTitleVisible && (
            <View
              pointerEvents="none"
              style={[
                styles.stickyTitle,
                {
                  backgroundColor: theme.colors.background,
                  borderBottomColor: theme.colors.border,
                },
              ]}
            >
              <AppText
                weight="semibold"
                style={styles.stickyTitleText}
                numberOfLines={1}
              >
                {meta.title}
              </AppText>
            </View>
          )}
          <ScrollView
            contentInsetAdjustmentBehavior={"automatic"}
            style={styles.scrollViewContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {/* 마크다운 내용 */}
            <MarkdownView
              markdown={content}
              onFirstHeadingLayout={handleHeadingLayout}
            />

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
  container: {
    flex: 1,
  },
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  stickyTitleText: {
    fontSize: 14,
  },
});
