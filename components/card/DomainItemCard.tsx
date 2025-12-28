import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { RootManifestResponse } from "@/services/content/root-manifest";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface DomainItemCardProps {
  item: RootManifestResponse["items"][number];
}

const DomainItemCard = ({ item }: DomainItemCardProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.cardWrapper,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow,
        },
      ]}
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
          <Image
            source={item.coverImage}
            style={styles.icon}
            contentFit="contain"
          />
        </View>

        <View style={styles.cardBody}>
          <AppText
            weight="semibold"
            style={[styles.cardTitle, { color: theme.colors.text }]}
          >
            {item.title}
          </AppText>
          <AppText
            style={[styles.cardDescription, { color: theme.colors.muted }]}
            numberOfLines={3}
          >
            {item.description}
          </AppText>
          <View style={styles.metaRow}>
            <View style={styles.tagRow}>
              {item.tags.map((tag) => (
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
              <Feather name="clock" size={14} color={theme.colors.muted} />
              <AppText
                style={[styles.updatedText, { color: theme.colors.muted }]}
              >
                {item.updatedAt}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DomainItemCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 16,
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
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 40,
    height: 40,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
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
    paddingVertical: 6,
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
});
