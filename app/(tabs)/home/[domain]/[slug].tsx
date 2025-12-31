import NonTitleStackScreen from "@/components/stack/NonTitleStackScreen";
import ErrorState from "@/components/state/ErrorState";
import { DomainType } from "@/constants/domain";
import BookmarkButton from "@/features/button/BookmarkButton";
import { MarkdownView } from "@/features/markdown/MarkdownView";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useTheme } from "@/providers/ThemeProvider";
import { getPosts } from "@/services/content/post";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const DomainSlugScreen = () => {
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
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <BookmarkButton
              domain={domain}
              slug={slug}
              title={meta.title}
              description={meta?.description}
            />
          ),
        }}
      />
      <View style={[styles.container, { paddingBottom: contentPaddingBottom }]}>
        <NonTitleStackScreen />
        <ScrollView
          contentInsetAdjustmentBehavior={"automatic"}
          style={styles.scrollViewContent}
        >
          <MarkdownView markdown={content} />
        </ScrollView>
      </View>
    </>
  );
};

export default DomainSlugScreen;

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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
