import DomainHeroCard from "@/components/card/DomainHeroCard";
import { AppText } from "@/components/text/AppText";
import { DomainHeroContent, DomainType } from "@/constants/domain";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, View } from "react-native";

interface DomainScreenHeaderProps {
  domain: DomainType;
}

const DomainScreenHeader = ({ domain }: DomainScreenHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View>
      <DomainHeroCard
        title={DomainHeroContent[domain].title}
        subtitle={DomainHeroContent[domain].subtitle}
      />
      <View style={styles.listHeader}>
        <AppText
          weight="bold"
          style={[styles.sectionTitle, { color: theme.colors.text }]}
        >
          학습 카드
        </AppText>
        <AppText style={[styles.sectionCaption, { color: theme.colors.muted }]}>
          기본 개념부터 순서대로 따라가보세요.
        </AppText>
      </View>
    </View>
  );
};

export default DomainScreenHeader;

const styles = StyleSheet.create({
  listHeader: {
    marginTop: 16,
    marginBottom: 8,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
  },
  sectionCaption: {
    fontSize: 14,
    lineHeight: 20,
  },
});
