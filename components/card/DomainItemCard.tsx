import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { RootManifestResponse } from "@/services/content/root-manifest";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface DomainItemCardProps {
  item?: RootManifestResponse["items"][number];
  isSkeleton?: boolean;
  href?: string;
}

const DomainItemCard = ({ item, isSkeleton, href }: DomainItemCardProps) => {
  const { theme } = useTheme();
  const Wrapper = href && !isSkeleton ? Link : View;
  const wrapperProps =
    href && !isSkeleton
      ? { href, asChild: true }
      : ({} as { href?: string; asChild?: boolean });
  const skeletonColor = { backgroundColor: theme.colors.card };

  return (
    <Wrapper {...wrapperProps}>
      <Pressable
        style={[
          styles.cardWrapper,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
            opacity: isSkeleton ? 0.7 : 1,
          },
        ]}
        disabled={isSkeleton || !href}
      >
        <View style={styles.cardContent}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {isSkeleton ? (
              <View
                style={[
                  styles.skeletonBox,
                  skeletonColor,
                  { width: 26, height: 26, borderRadius: 8 },
                ]}
              />
            ) : (
              <Image
                source={item?.coverImage}
                style={styles.icon}
                contentFit="contain"
              />
            )}
          </View>

          <View style={styles.cardBody}>
            {isSkeleton ? (
              <>
                <View
                  style={[
                    styles.skeletonBox,
                    skeletonColor,
                    { width: "36%", height: 14 },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonBox,
                    skeletonColor,
                    { width: "80%", height: 12 },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonBox,
                    skeletonColor,
                    { width: "60%", height: 12 },
                  ]}
                />
              </>
            ) : (
              <>
                <AppText
                  weight="semibold"
                  style={[styles.cardTitle, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {item?.title}
                </AppText>
                <AppText
                  style={[
                    styles.cardDescription,
                    { color: theme.colors.muted },
                  ]}
                  numberOfLines={2}
                >
                  {item?.description}
                </AppText>
              </>
            )}

            <View style={styles.metaRow}>
              <View style={styles.tagRow}>
                {isSkeleton
                  ? [1, 2].map((key) => (
                      <View
                        key={`skeleton-tag-${key}`}
                        style={[
                          styles.skeletonBox,
                          skeletonColor,
                          { width: 48, height: 12, borderRadius: 8 },
                        ]}
                      />
                    ))
                  : item?.tags.map((tag) => (
                      <View
                        key={tag}
                        style={[
                          styles.tag,
                          {
                            backgroundColor: theme.colors.card,
                            borderColor: theme.colors.border,
                          },
                        ]}
                      >
                        <AppText
                          weight="medium"
                          style={[
                            styles.tagText,
                            { color: theme.colors.accentStrong },
                          ]}
                        >
                          #{tag}
                        </AppText>
                      </View>
                    ))}
              </View>
              <View style={styles.updatedRow}>
                {isSkeleton ? (
                  <View
                    style={[
                      styles.skeletonBox,
                      skeletonColor,
                      { width: 64, height: 12, borderRadius: 8 },
                    ]}
                  />
                ) : (
                  <>
                    <Feather
                      name="clock"
                      size={14}
                      color={theme.colors.muted}
                    />
                    <AppText
                      style={[
                        styles.updatedText,
                        { color: theme.colors.muted },
                      ]}
                    >
                      {item?.updatedAt}
                    </AppText>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Wrapper>
  );
};

export default DomainItemCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  cardBody: {
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 8,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
  },
  updatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  updatedText: {
    fontSize: 12,
  },
  skeletonBox: {
    backgroundColor: "#E0E0E0",
  },
});
