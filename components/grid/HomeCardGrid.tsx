import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { DomainResponseData } from "@/services/content/domain";
import { replaceDomainText } from "@/utils/replaceDomainText";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type DomainItem = DomainResponseData["items"][number];

interface HomeCardGridProps {
  data: DomainResponseData["items"];
}

const HomeCardGrid = ({ data }: HomeCardGridProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  const items: (DomainItem | null)[] =
    data.length > 0 ? data : new Array(4).fill(null);

  return (
    <View style={styles.cardGrid}>
      {items.map((item, index) => {
        const isSkeleton = !item;
        const domainLabel = item?.domain ?? "------";
        const countLabel = item?.count ?? 0;

        return (
          <TouchableOpacity
            key={item?.domain ?? `skeleton-${index}`}
            activeOpacity={0.8}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadow,
                opacity: isSkeleton ? 0.6 : 1,
              },
            ]}
            onPress={() => {
              if (isSkeleton) return;
              router.navigate(`/home/${item.domain}`);
            }}
            disabled={isSkeleton}
          >
            <View style={styles.cardTop}>
              <Image
                source={item?.image}
                contentFit="contain"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                }}
              />
              <AppText
                weight="semibold"
                style={[styles.cardTitle, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {replaceDomainText(domainLabel)}
              </AppText>
            </View>
            <AppText
              weight="bold"
              style={[styles.cardCount, { color: theme.colors.text }]}
            >
              {isSkeleton ? "—" : `${countLabel}개 문서`}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default HomeCardGrid;

const styles = StyleSheet.create({
  cardGrid: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    gap: 12,
  },
  card: {
    // width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardCount: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: "auto",
  },
});
