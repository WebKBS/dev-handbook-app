import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, View } from "react-native";

interface BookmarkSectionHeaderProps {
  section: { title: string };
}

const BookmarkSectionHeader = ({ section }: BookmarkSectionHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.domainHeader,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View
        style={[
          styles.domainPill,
          {
            backgroundColor: theme.colors.accentSubtle,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <AppText
          weight="bold"
          style={[styles.domainText, { color: theme.colors.accentStrong }]}
        >
          {section.title.toUpperCase()}
        </AppText>
      </View>
      <View style={styles.headerLine} />
    </View>
  );
};

export default BookmarkSectionHeader;

const styles = StyleSheet.create({
  // 섹션 헤더 스타일
  domainHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  domainPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  domainText: {
    fontSize: 12,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(150,150,150,0.1)",
  },
});
