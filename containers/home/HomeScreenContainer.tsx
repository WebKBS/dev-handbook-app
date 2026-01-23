import ScreenHeroCard from "@/components/card/ScreenHeroCard";
import HomeCardGrid from "@/components/grid/HomeCardGrid";
import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { DomainResponseData } from "@/services/content/domain";
import { StyleSheet, View } from "react-native";

interface HomeScreenContainerProps {
  data: DomainResponseData["items"];
}

const HomeScreenContainer = ({ data }: HomeScreenContainerProps) => {
  const { theme } = useTheme();

  // "glossary" 용어 도메인을 제외한 나머지 도메인만 필터링
  const filteredData = data.filter((item) => item.domain !== "glossary");

  // glossary 도메인 데이터 추출 (필요 시 사용)
  const glossaryData = data.find((item) => item.domain === "glossary");

  return (
    <>
      <ScreenHeroCard
        label={"학습"}
        title={"도메인별 학습 카드"}
        subtitle={"HTML, CSS 등 분류별로 최신 업데이트를 한눈에 확인하세요."}
      />
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
      <HomeCardGrid data={filteredData} />
    </>
  );
};

export default HomeScreenContainer;

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 20,
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
