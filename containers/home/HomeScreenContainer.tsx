import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { DomainResponseData } from "@/services/content/domain";
import { Pressable, StyleSheet, View } from "react-native";

interface HomeScreenContainerProps {
  data: DomainResponseData;
}

const HomeScreenContainer = ({ data }: HomeScreenContainerProps) => {
  const isPending = !data;
  const { theme } = useTheme();

  return (
    <>
      <View
        style={[
          styles.hero,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
          },
        ]}
      >
        <View style={styles.heroBadgeRow}>
          <View
            style={[
              styles.heroPill,
              {
                backgroundColor: theme.colors.codeBg,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[styles.pillDot, { backgroundColor: theme.colors.accent }]}
            />
            <AppText weight="semibold" style={{ color: theme.colors.accent }}>
              학습 현황
            </AppText>
          </View>
          <AppText style={[styles.timestamp, { color: theme.colors.muted }]}>
            {new Date().toLocaleDateString()}
          </AppText>
        </View>
        <AppText
          weight="extrabold"
          style={[styles.heroTitle, { color: theme.colors.text }]}
        >
          도메인별 학습 카드
        </AppText>
        <AppText style={[styles.heroSubtitle, { color: theme.colors.muted }]}>
          HTML, CSS 등 분류별로 최신 업데이트를 한눈에 확인하세요.
        </AppText>
      </View>

      <View style={styles.sectionHeader}>
        <AppText
          weight="bold"
          style={[styles.sectionTitle, { color: theme.colors.text }]}
        >
          카테고리
        </AppText>
        <AppText style={[styles.sectionCaption, { color: theme.colors.muted }]}>
          도메인 카드에서 바로 이동할 수 있어요.
        </AppText>
      </View>

      <View style={styles.cardGrid}>
        {(data?.items ?? new Array(4).fill(null)).map((item, index) => {
          const isSkeleton = !item || isPending;
          const domainLabel = item?.domain ?? "------";
          const countLabel = item?.count ?? 0;
          const updatedLabel = item?.latestUpdatedAt ?? "---- -- --";

          return (
            <Pressable
              key={item?.domain ?? `skeleton-${index}`}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  shadowColor: theme.colors.shadow,
                  opacity: isSkeleton ? 0.6 : 1,
                },
              ]}
              disabled={isSkeleton}
            >
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: theme.colors.codeBg },
                  ]}
                >
                  <View
                    style={[
                      styles.iconDot,
                      { backgroundColor: theme.colors.accent },
                    ]}
                  />
                </View>
                <AppText
                  weight="semibold"
                  style={[styles.cardTitle, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {domainLabel.toUpperCase()}
                </AppText>
              </View>
              <AppText
                weight="bold"
                style={[styles.cardCount, { color: theme.colors.text }]}
              >
                {isSkeleton ? "—" : `${countLabel}개 문서`}
              </AppText>
              <View style={styles.cardFooter}>
                <AppText
                  style={[styles.cardMeta, { color: theme.colors.muted }]}
                >
                  최신 업데이트
                </AppText>
                <AppText
                  weight="medium"
                  style={[styles.cardMetaValue, { color: theme.colors.accent }]}
                >
                  {updatedLabel}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

export default HomeScreenContainer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  hero: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
    gap: 8,
  },
  heroBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  timestamp: {
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionHeader: {
    marginBottom: 10,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
  },
  sectionCaption: {
    fontSize: 14,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardCount: {
    fontSize: 18,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 12,
  },
  cardMetaValue: {
    fontSize: 12,
  },
});
