import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import { AppText } from "@/components/text/AppText";
import { getBookmarkBySlug } from "@/db/queries/bookmark";
import { useTheme } from "@/providers/ThemeProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function BookmarkScreen() {
  const { theme } = useTheme();

  const { data } = useLiveQuery(getBookmarkBySlug());

  console.log("BookmarkScreen rendered", data);

  const isEmpty = (data?.length || 0) === 0;

  if (isEmpty) {
    return (
      <SafeAreaViewScreen>
        <ScrollView
          style={styles.container}
          contentInsetAdjustmentBehavior={"automatic"}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadow,
              },
            ]}
          >
            <AppText
              weight={"bold"}
              style={[styles.title, { color: theme.colors.text }]}
            >
              북마크가 비어 있습니다
            </AppText>
            <AppText
              style={[styles.description, { color: theme.colors.muted }]}
            >
              이후 저장할 페이지나 섹션이 생기면 같은 테마로 표시될 예정입니다.
              마크다운 기반 콘텐츠와 연동해보세요.
            </AppText>
          </View>
        </ScrollView>
      </SafeAreaViewScreen>
    );
  }

  return (
    <SafeAreaViewScreen>
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior={"automatic"}
      >
        {data?.map((bookmark) => (
          <Link
            href={`/home/${bookmark.domain}/${bookmark.slug}`}
            key={bookmark.slug}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadow,
                marginBottom: 16,
              },
            ]}
          >
            <AppText
              weight={"bold"}
              style={[styles.title, { color: theme.colors.text }]}
            >
              {bookmark.title}
            </AppText>
            {bookmark.description ? (
              <AppText
                style={[styles.description, { color: theme.colors.muted }]}
              >
                {bookmark.description}
              </AppText>
            ) : null}
          </Link>
        ))}
      </ScrollView>
    </SafeAreaViewScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
});
