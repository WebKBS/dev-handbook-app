import { AppText } from "@/components/text/AppText";
import { Domain, type DomainType } from "@/constants/domain";
import { DOMAIN_COLORS, useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, View } from "react-native";

interface BookmarkSectionHeaderProps {
  section: { title: string };
}

function toRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}

const BookmarkSectionHeader = ({ section }: BookmarkSectionHeaderProps) => {
  const { theme } = useTheme();
  const rawKey = section.title.trim().toLowerCase();
  const domainKey = Object.values(Domain).includes(rawKey as DomainType)
    ? (rawKey as DomainType)
    : undefined;
  const domainColor = domainKey
    ? DOMAIN_COLORS[domainKey]
    : theme.colors.accentStrong;

  const pillBg = toRgba(domainColor, theme.mode === "dark" ? 0.22 : 0.12);
  const pillBorder = toRgba(domainColor, theme.mode === "dark" ? 0.5 : 0.35);
  const lineColor = toRgba(domainColor, theme.mode === "dark" ? 0.35 : 0.25);

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
            backgroundColor: pillBg,
            borderColor: pillBorder,
          },
        ]}
      >
        <AppText
          weight="bold"
          style={[styles.domainText, { color: domainColor }]}
        >
          {section.title.toUpperCase()}
        </AppText>
      </View>
      <View style={[styles.headerLine, { backgroundColor: lineColor }]} />
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
