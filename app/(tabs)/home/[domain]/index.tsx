import DomainHeroCard from "@/components/card/DomainHeroCard";
import ErrorState from "@/components/state/ErrorState";
import { AppText } from "@/components/text/AppText";
import { DomainHeroContent, DomainType } from "@/constants/domain";
import { useTheme } from "@/providers/ThemeProvider";
import { getDomainManifest } from "@/services/content/domain-manifest";
import { RootManifestResponse } from "@/services/content/root-manifest";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DomainScreen = () => {
  const { theme } = useTheme();
  const { domain } = useLocalSearchParams<{ domain: DomainType }>();
  const { bottom } = useSafeAreaInsets();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: domain?.toUpperCase(),
    });
  }, [navigation, domain]);

  const { data, isPending, error } = useQuery({
    queryKey: ["domain-manifest", domain],
    queryFn: () => getDomainManifest({ domain }),
  });

  if (error)
    return <ErrorState title={"데이터를 불러오는 중 오류가 발생했어요."} />;

  const domainItems = data?.items || [];
  const contentPaddingBottom =
    40 + (Platform.OS === "android" ? bottom + 64 : 0);

  const renderListHeader = () => (
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

  const renderItem = ({
    item,
  }: {
    item: RootManifestResponse["items"][number];
  }) => (
    <View
      style={[
        styles.cardWrapper,
        { shadowColor: theme.colors.shadow, borderColor: theme.colors.border },
      ]}
    >
      <Image
        source={item.coverImage}
        style={[styles.cover, { backgroundColor: theme.colors.card }]}
        contentFit="contain"
      />
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
                  style={[styles.tagText, { color: theme.colors.accentStrong }]}
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
  );

  return (
    <FlatList
      data={domainItems}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={renderListHeader}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: contentPaddingBottom,
        },
      ]}
      contentInsetAdjustmentBehavior={"automatic"}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default DomainScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

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
  cover: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    padding: 14,
    gap: 8,
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
    gap: 8,
    flexShrink: 1,
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
