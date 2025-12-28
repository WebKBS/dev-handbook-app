import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { RootManifestResponse } from "@/services/content/root-manifest";
import { Feather } from "@expo/vector-icons";
import { Link, LinkProps } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface DomainItemCardProps {
  item?: RootManifestResponse["items"][number];
  isSkeleton?: boolean;
  href?: LinkProps["href"];
}

const DomainItemCard = ({ item, isSkeleton, href }: DomainItemCardProps) => {
  const { theme } = useTheme();

  const skeletonColor = { backgroundColor: theme.colors.card };

  const CardContent = (
    <Pressable
      style={[
        styles.cardWrapper,
        {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.shadow,
          opacity: isSkeleton ? 0.5 : 1,
        },
      ]}
      disabled={isSkeleton || !href}
      android_ripple={{ color: theme.colors.border }}
    >
      <View style={styles.cardContent}>
        {/* 텍스트 콘텐츠 */}
        <View style={styles.textContent}>
          {isSkeleton ? (
            <>
              <View
                style={[
                  styles.skeletonBox,
                  skeletonColor,
                  { width: "50%", height: 18, borderRadius: 4 },
                ]}
              />
              <View
                style={[
                  styles.skeletonBox,
                  skeletonColor,
                  { width: "90%", height: 14, borderRadius: 4, marginTop: 8 },
                ]}
              />
            </>
          ) : (
            <>
              <AppText
                weight="semibold"
                style={[styles.title, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {item?.title}
              </AppText>
              <AppText
                style={[styles.description, { color: theme.colors.muted }]}
                numberOfLines={2}
              >
                {item?.description}
              </AppText>
            </>
          )}
        </View>

        {/* 화살표 */}
        {!isSkeleton && (
          <Feather
            name="chevron-right"
            size={20}
            color={theme.colors.text}
            style={styles.arrow}
          />
        )}
      </View>
    </Pressable>
  );

  if (href && !isSkeleton) {
    return (
      <Link href={href} asChild>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default DomainItemCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 88,
  },

  textContent: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.1,
  },

  arrow: {
    opacity: 0.3,
  },
  skeletonBox: {
    backgroundColor: "#E0E0E0",
  },
});
