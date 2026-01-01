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
          styles.cardContent,
          isSkeleton
            ? { opacity: 0.7 }
            : {
                opacity: 1,
                backgroundColor: theme.colors.cardBg,
              },
        ]}
      >
        <View
          style={[
            styles.accentBar,
            { backgroundColor: theme.colors.accentStrong },
          ]}
        />
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

        {!isSkeleton ? (
          <View
            style={[
              styles.ctaCircle,
              styles.ctaPosition,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Feather
              name="chevron-right"
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
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    padding: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
    position: "relative",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
  },

  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    opacity: 0.9,
    zIndex: 1,
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
  ctaPosition: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  skeletonBox: {
    backgroundColor: "#E0E0E0",
  },
});
