import HomeCardGrid from "@/components/grid/HomeCardGrid";
import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { DomainResponseData } from "@/services/content/domain";
import { StyleSheet, View } from "react-native";

interface HomeScreenContainerProps {
  data: DomainResponseData;
}

const HomeScreenContainer = ({ data }: HomeScreenContainerProps) => {
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
      <HomeCardGrid data={data} />
    </>
  );
};

export default HomeScreenContainer;

const styles = StyleSheet.create({
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
