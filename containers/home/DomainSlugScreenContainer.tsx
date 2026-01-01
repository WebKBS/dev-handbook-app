import NonTitleStackScreen from "@/components/stack/NonTitleStackScreen";
import ErrorState from "@/components/state/ErrorState";
import { DomainType } from "@/constants/domain";
import BookmarkButton from "@/features/button/BookmarkButton";
import ReferencesCard from "@/features/card/ReferencesCard";
import { MarkdownView } from "@/features/markdown/MarkdownView";
import ReferenceModal from "@/features/modal/ReferenceModal";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useTheme } from "@/providers/ThemeProvider";
import { getPosts, Reference } from "@/services/content/post";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

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
  const [selectedReference, setSelectedReference] = useState<Reference | null>(
    null,
  );

  const contentPaddingBottom = useContentPaddingBotton();

  const handleCloseModal = useCallback(() => {
    setSelectedReference(null);
  }, []);

  const handleOpenUrl = useCallback(async () => {
    const url = selectedReference?.url;
    if (!url) return;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error("Failed to open reference url:", err);
    }
  }, [selectedReference]);

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
          {/* 마크다운 내용 */}
          <MarkdownView markdown={content} />

          {/* 참고 링크 */}
          <ReferencesCard
            referencesList={referencesList}
            setSelectedReference={setSelectedReference}
          />
        </ScrollView>
        <ReferenceModal
          handleCloseModal={handleCloseModal}
          selectedReference={selectedReference}
          handleOpenUrl={handleOpenUrl}
        />
      </View>
    </>
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
