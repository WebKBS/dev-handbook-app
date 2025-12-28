import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, View } from "react-native";

interface DomainHeroCardProps {
  title: string;
  subtitle: string;
}

const DomainHeroCard = ({ title, subtitle }: DomainHeroCardProps) => {
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

export default DomainHeroCard;

const styles = StyleSheet.create({
  hero: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
    gap: 10,
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
