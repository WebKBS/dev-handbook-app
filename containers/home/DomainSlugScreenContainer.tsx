import NonTitleStackScreen from "@/components/stack/NonTitleStackScreen";
import ErrorState from "@/components/state/ErrorState";
import { DomainType } from "@/constants/domain";
import BookmarkButton from "@/features/button/BookmarkButton";
import ReferencesCard from "@/features/card/ReferencesCard";
import { MarkdownView } from "@/features/markdown/MarkdownView";
import DomainSlugHeaderMoreMenu from "@/features/menu/DomainSlugHeaderMoreMenu";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useTheme } from "@/providers/ThemeProvider";
import { getPosts, Reference } from "@/services/content/post";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
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
          <ScrollView
            contentInsetAdjustmentBehavior={"automatic"}
            style={styles.scrollViewContent}
          >
            {/* 마크다운 내용 */}
            <MarkdownView markdown={content} />

            {/* 참고 링크 */}
            <ReferencesCard referencesList={referencesList} />
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
});
