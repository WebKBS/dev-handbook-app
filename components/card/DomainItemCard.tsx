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

  const tagLabel = item?.tags?.[0];

  const CardContent = (
    <Pressable
      style={[
        styles.cardWrapper,
        {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.shadow,
          opacity: isSkeleton ? 0.5 : 1,
          borderColor: theme.colors.border,
        },
      ]}
      disabled={isSkeleton || !href}
      android_ripple={{ color: theme.colors.border }}
    >
      <View
        style={[
          styles.accentBar,
          { backgroundColor: theme.colors.accentStrong },
        ]}
      />
      <View style={styles.cardContent}>
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

          <View style={styles.footerRow}>
            {isSkeleton ? (
              <View
                style={[
                  styles.skeletonBox,
                  skeletonColor,
                  { width: 80, height: 18, borderRadius: 10 },
                ]}
              />
            ) : tagLabel ? (
              <View
                style={[
                  styles.tagChip,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <AppText
                  weight="medium"
                  style={[styles.tagText, { color: theme.colors.accentStrong }]}
                >
                  #{tagLabel}
                </AppText>
              </View>
            ) : (
              <View />
            )}

            <View style={styles.updatedRow}>
              {isSkeleton ? (
                <View
                  style={[
                    styles.skeletonBox,
                    skeletonColor,
                    { width: 70, height: 14, borderRadius: 8 },
                  ]}
                />
              ) : (
                <>
                  <Feather name="clock" size={13} color={theme.colors.muted} />
                  <AppText
                    style={[styles.updatedText, { color: theme.colors.muted }]}
                  >
                    {item?.updatedAt}
                  </AppText>
                </>
              )}
            </View>
          </View>
        </View>

        {!isSkeleton ? (
          <View
            style={[
              styles.ctaCircle,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Feather
              name="arrow-right"
              size={16}
              color={theme.colors.accentStrong}
            />
          </View>
        ) : (
          <View
            style={[
              styles.ctaCircle,
              skeletonColor,
              { borderRadius: 999, width: 32, height: 32 },
            ]}
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
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
    position: "relative",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    opacity: 0.9,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 96,
    paddingHorizontal: 14,
    paddingVertical: 14,
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
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 12,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  updatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  updatedText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  ctaCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  skeletonBox: {
    backgroundColor: "#E0E0E0",
  },
});
