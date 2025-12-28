import DomainItemCard from "@/components/card/DomainItemCard";
import DomainScreenHeader from "@/components/header/DomainScreenHeader";
import ErrorState from "@/components/state/ErrorState";
import { DomainType } from "@/constants/domain";
import { useTheme } from "@/providers/ThemeProvider";
import { getDomainManifest } from "@/services/content/domain-manifest";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { FlatList, Platform, StyleSheet } from "react-native";
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
  const listData = isPending ? new Array(6).fill(null) : domainItems;
  const contentPaddingBottom =
    40 + (Platform.OS === "android" ? bottom + 64 : 0);

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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
