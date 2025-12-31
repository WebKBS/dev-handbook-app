import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const quickLinks = [
  { title: "스타트 가이드", desc: "온보딩, 베스트 프랙티스", icon: "map" },
  { title: "릴리즈 체크리스트", desc: "QA · 배포 전 확인", icon: "check" },
  {
    title: "트러블슈팅",
    desc: "최근 이슈 해결 기록",
    icon: "alert-circle",
  },
];

const RecommendCardList = () => {
  const { theme } = useTheme();
  return (
    <View style={styles.cardGrid}>
      {quickLinks.map((item) => (
        <View
          key={item.title}
          style={[
            styles.quickCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <View
            style={[
              styles.quickIcon,
              {
                backgroundColor: theme.colors.accentSubtle,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Feather
              name={item.icon as any}
              size={16}
              color={theme.colors.accentStrong}
            />
          </View>
          <AppText
            weight="bold"
            style={[styles.quickTitle, { color: theme.colors.text }]}
          >
            {item.title}
          </AppText>
          <AppText
            style={[styles.quickDesc, { color: theme.colors.muted }]}
            numberOfLines={2}
          >
            {item.desc}
          </AppText>
          <View style={styles.quickFooter}>
            <AppText
              weight="semibold"
              style={[styles.quickCta, { color: theme.colors.accentStrong }]}
            >
              바로 열기
            </AppText>
            <Feather
              name="arrow-up-right"
              size={16}
              color={theme.colors.accentStrong}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default RecommendCardList;

const styles = StyleSheet.create({
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  quickCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  quickTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  quickDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  quickFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickCta: {
    fontSize: 13,
  },
});
