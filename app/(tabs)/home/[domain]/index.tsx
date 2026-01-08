import DomainItemCard from "@/components/card/DomainItemCard";
import DomainScreenHeader from "@/components/header/DomainScreenHeader";
import DomainSectionHeader from "@/components/header/DomainSectionHeader";
import ErrorState from "@/components/state/ErrorState";
import { DomainType } from "@/constants/domain";
import { getReadStatesByDomain } from "@/db/queries/readState";
import { ReadStatus } from "@/enums/readState.enum";
import { useContentPaddingBotton } from "@/hooks/useContentPaddingBotton";
import { useTheme } from "@/providers/ThemeProvider";
import { getDomainManifest } from "@/services/content/domain-manifest";
import { replaceDomainText } from "@/utils/replaceDomainText";
import { useQuery } from "@tanstack/react-query";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { SectionList, StyleSheet, View } from "react-native";

const DomainScreen = () => {
  const { theme } = useTheme();
  const { domain } = useLocalSearchParams<{ domain: DomainType }>();
  const contentPaddingBottom = useContentPaddingBotton();
  const navigation = useNavigation();

  // 1. iOS Large Title 내비게이션 설정
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: replaceDomainText(domain),

      headerStyle: {
        backgroundColor: theme.colors.background,
      },
    });
  }, [navigation, domain, theme]);

  const { data, isPending, error } = useQuery({
    queryKey: ["domain-manifest", domain],
    queryFn: () => getDomainManifest({ domain }),
  });

  const { data: readStateRows } = useLiveQuery(
    getReadStatesByDomain(domain ?? ""),
  );

  // --- 데이터 가공 ---
  const readStateMap: Record<string, ReadStatus> = {};
  (readStateRows ?? []).forEach((row) => {
    readStateMap[`${row.domain}:${row.slug}`] = row.status;
  });

  const domainItems = data?.items ?? [];
  const sections = data?.sections ?? [];

  let sectionedData: {
    id: string;
    name: string;
    data: typeof domainItems;
  }[];

  if (isPending) {
    sectionedData = [
      { id: "__skeleton__", name: "", data: new Array(4).fill(null) },
    ];
  } else {
    const orderedSections = [...sections].sort(
      (a, b) => (a?.order ?? 0) - (b?.order ?? 0),
    );
    sectionedData = orderedSections.map((section) => ({
      ...section,
      data: domainItems
        .filter((item) => item.sectionId === section.id)
        .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)),
    }));

    const sectionIds = new Set(orderedSections.map((s) => s.id));
    const uncategorized = domainItems.filter(
      (item) => !sectionIds.has(item.sectionId),
    );
    if (uncategorized.length > 0) {
      sectionedData.push({
        id: "__uncategorized__",
        name: "기타",
        data: uncategorized,
      });
    }
  }
  // --------------------------------

  if (error)
    return <ErrorState title={"데이터를 불러오는 중 오류가 발생했어요."} />;

  return (
    <SectionList
      sections={sectionedData.filter((s) => s.data.length > 0)}
      keyExtractor={(item, index) => item?.id ?? `sk-${index}`}
      // iOS Sticky 핵심 설정
      stickySectionHeadersEnabled={true}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.container,
        { paddingBottom: contentPaddingBottom },
      ]}
      style={{ backgroundColor: theme.colors.background }}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <DomainItemCard
            item={item ?? undefined}
            isSkeleton={!item}
            readStatus={
              item ? readStateMap[`${item.domain}:${item.slug}`] : undefined
            }
            href={item ? `/home/${domain}/${item.slug}` : undefined}
          />
        </View>
      )}
      // Sticky Header 디자인
      renderSectionHeader={({ section }) =>
        section.name ? <DomainSectionHeader name={section.name} /> : null
      }
      ListHeaderComponent={<DomainScreenHeader domain={domain} />}
    />
  );
};

export default DomainScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    // Large Title 사용 시 paddingTop을 너무 크게 주면 sticky 위치가 어긋날 수 있음
    paddingTop: 8,
  },
  cardWrapper: {
    marginBottom: 12,
  },
});
