import { DomainType } from "@/constants/domain";
import { MarkdownView } from "@/features/MarkdownView";
import { getPosts } from "@/services/content/post";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

const DomainSlugScreen = () => {
  const { slug, domain } = useLocalSearchParams<{
    slug: string;
    domain: DomainType;
  }>();

  const { data, isPending, error } = useQuery({
    queryKey: ["post", domain, slug],
    queryFn: () => getPosts({ domain, slug }),
  });

  const content = data?.content;

  if (!content) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "",
          }}
        />
        <ScrollView contentInsetAdjustmentBehavior={"automatic"}>
          <MarkdownView markdown={"# 콘텐츠를 불러올 수 없습니다."} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior={"automatic"}>
        <MarkdownView markdown={content} />
      </ScrollView>
    </View>
  );
};

export default DomainSlugScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
