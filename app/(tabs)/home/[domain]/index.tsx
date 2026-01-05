import DomainItemCard from "@/components/card/DomainItemCard";
import DomainScreenHeader from "@/components/header/DomainScreenHeader";
import ErrorState from "@/components/state/ErrorState";
import { DomainType } from "@/constants/domain";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useTheme } from "@/providers/ThemeProvider";
import { getDomainManifest } from "@/services/content/domain-manifest";
import { replaceDomainText } from "@/utils/replaceDomainText";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

const DomainScreen = () => {
  const { theme } = useTheme();
  const { domain } = useLocalSearchParams<{ domain: DomainType }>();
  const contentPaddingBottom = useContentPaddingBotton();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: replaceDomainText(domain),
    });
  }, [navigation, domain]);

  const { data, isPending, error } = useQuery({
    queryKey: ["domain-manifest", domain],
    queryFn: () => getDomainManifest({ domain }),
  });

  if (error)
    return <ErrorState title={"데이터를 불러오는 중 오류가 발생했어요."} />;

  const domainItems = data?.items || [];
  const listData = isPending ? new Array(4).fill(null) : domainItems;

  return (
    <FlatList
      data={listData}
      keyExtractor={(item, index) => item?.id ?? `skeleton-${index}`}
      renderItem={({ item }) => (
        <DomainItemCard
          item={item ?? undefined}
          isSkeleton={!item}
          href={item ? `/home/${domain}/${item.slug}` : undefined}
        />
      )}
      ListHeaderComponent={<DomainScreenHeader domain={domain} />}
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
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
