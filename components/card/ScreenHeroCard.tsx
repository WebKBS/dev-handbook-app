import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, View } from "react-native";

interface ScreenHeroCardProps {
  label: string;
  title: string;
  subtitle: string;
}

const ScreenHeroCard = ({ label, title, subtitle }: ScreenHeroCardProps) => {
  const { theme } = useTheme();

  return (
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
            {label}
          </AppText>
        </View>
      </View>
      <AppText
        weight="extrabold"
        style={[styles.heroTitle, { color: theme.colors.text }]}
      >
        {title}
      </AppText>
      <AppText style={[styles.heroSubtitle, { color: theme.colors.muted }]}>
        {subtitle}
      </AppText>
    </View>
  );
};

export default ScreenHeroCard;

const styles = StyleSheet.create({
  hero: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
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
});
