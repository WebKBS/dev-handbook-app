import NonTitleStackScreen from "@/components/stack/NonTitleStackScreen";
import ErrorState from "@/components/state/ErrorState";
import { AppText } from "@/components/text/AppText";
import { DomainType } from "@/constants/domain";
import BookmarkButton from "@/features/button/BookmarkButton";
import ReferencesCard from "@/features/card/ReferencesCard";
import { MarkdownView } from "@/features/markdown/MarkdownView";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useTheme } from "@/providers/ThemeProvider";
import { getPosts, Reference } from "@/services/content/post";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
        <Modal
          visible={!!selectedReference}
          animationType="slide"
          transparent
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={handleCloseModal}>
              <View style={styles.backdrop} />
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.bottomSheet,
                {
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.border,
                  shadowColor: theme.colors.shadow,
                },
              ]}
            >
              <View
                style={[
                  styles.sheetHandle,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <View style={styles.sheetHeader}>
                <AppText weight="extrabold" style={styles.sheetTitle}>
                  참고 링크
                </AppText>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <Ionicons name="close" size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              </View>
              <AppText weight="bold" style={styles.sheetHeading}>
                {selectedReference?.title}
              </AppText>
              {selectedReference?.note ? (
                <AppText
                  style={[styles.sheetNote, { color: theme.colors.muted }]}
                >
                  {selectedReference.note}
                </AppText>
              ) : null}
              <View style={styles.sheetUrlRow}>
                <Ionicons
                  name="link-outline"
                  size={16}
                  color={theme.colors.accent}
                />
                <AppText
                  weight="medium"
                  numberOfLines={2}
                  style={[styles.sheetUrl, { color: theme.colors.accent }]}
                >
                  {selectedReference?.url}
                </AppText>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleOpenUrl}
                style={[
                  styles.openLinkButton,
                  { backgroundColor: theme.colors.accent },
                ]}
              >
                <AppText weight="bold" style={styles.openLinkButtonText}>
                  링크 열기
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  bottomSheet: {
    marginTop: "auto",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
  },
  closeButton: {
    padding: 6,
  },
  sheetHeading: {
    fontSize: 18,
    marginBottom: 6,
  },
  sheetNote: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  sheetUrlRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sheetUrl: {
    fontSize: 14,
    marginLeft: 4,
    flexShrink: 1,
  },
  openLinkButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 6,
  },
  openLinkButtonText: {
    color: "#ffffff",
    fontSize: 15,
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
