import { DomainType } from "@/constants/domain";
import { MarkdownView } from "@/features/MarkdownView";
import { useTheme } from "@/providers/ThemeProvider";
import { getPosts } from "@/services/content/post";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

const DomainSlugScreen = () => {
  const { slug, domain } = useLocalSearchParams<{
    slug: string;
    domain: DomainType;
  }>();

  const { theme } = useTheme();
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
        <ScrollView
          contentInsetAdjustmentBehavior={"automatic"}
          style={styles.scrollViewContent}
        >
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
          headerLargeTitle: false,
          headerTintColor: theme.colors.accent,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior={"automatic"}
        style={styles.scrollViewContent}
      >
        <MarkdownView markdown={content} />
      </ScrollView>
    </View>
  );
};

export default DomainSlugScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
