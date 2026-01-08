import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, View } from "react-native";

interface DomainSectionHeaderProps {
  name: string;
}

const DomainSectionHeader = ({ name }: DomainSectionHeaderProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.sectionHeader,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.sectionTextContainer}>
        <AppText
          weight="extrabold"
          style={[styles.sectionTitle, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {name}
        </AppText>
      </View>
    </View>
  );
};

export default DomainSectionHeader;

const styles = StyleSheet.create({
  sectionHeader: {
    // iOS에서 header와 자연스럽게 연결되도록 패딩 조절
    paddingVertical: 8,
    marginBottom: 4,
    // Sticky 상태일 때 뒤쪽 아이템이 비치지 않도록 불투명 배경 필수
    width: "100%",
  },
  sectionTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
  },
});
