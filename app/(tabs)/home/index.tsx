import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import { useRootManifest } from "@/hooks/services/useRootManifest";
import { useTheme } from "@/providers/ThemeProvider";
import { focusManager } from "@tanstack/query-core";
import { Link } from "expo-router";
import { useEffect } from "react";
import {
  AppState,
  AppStateStatus,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// 앱 상태 변화에 따라 focusManager의 포커스 상태를 업데이트합니다.
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function HomeScreen() {
  const { mode, theme, toggleMode } = useTheme();

  const { data, isPending, error } = useRootManifest();

  useEffect(() => {
    // 앱 화면 상태 변화 이벤트 리스너 등록
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  if (isPending) {
    return (
      <SafeAreaViewScreen>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text style={[styles.errorText, { color: theme.colors.muted }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaViewScreen>
    );
  }

  if (error) {
    return (
      <SafeAreaViewScreen>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text
            style={[styles.errorText, { color: theme.colors.accentStrong }]}
          >
            오류가 발생했습니다: {(error as Error).message}
          </Text>
        </View>
      </SafeAreaViewScreen>
    );
  }

  console.log(data);

  return (
    <SafeAreaViewScreen>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.hero,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <View style={styles.badge}>
            <Text
              style={[styles.badgeText, { color: theme.colors.accentStrong }]}
            >
              DEV
            </Text>
            <Text
              style={[
                styles.badgeText,
                { color: theme.colors.accent, marginLeft: 4 },
              ]}
            >
              HANDBOOK
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            개발 핸드북
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
            팀이 같은 톤과 도구로 움직일 수 있도록 기준과 예시를 모았습니다.
            마크다운 파일만 업데이트하면 앱이 그대로 반영됩니다.
          </Text>
          <Pressable
            onPress={toggleMode}
            style={[
              styles.toggleButton,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.toggleLabel, { color: theme.colors.muted }]}>
              뷰 모드
            </Text>
            <Text style={[styles.toggleValue, { color: theme.colors.accent }]}>
              {mode === "dark" ? "다크" : "라이트"}
            </Text>
          </Pressable>
        </View>
        <Link
          href={"/(tabs)/home/html"}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.accent,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontFamily: "Pretendard-Bold" }}>
            상세 페이지로 이동
          </Text>
        </Link>
      </ScrollView>
    </SafeAreaViewScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  hero: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: "Pretendard-Bold",
    fontSize: 12,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: "Pretendard-ExtraBold",
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Pretendard-Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  toggleButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleLabel: {
    fontFamily: "Pretendard-Medium",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  toggleValue: {
    fontFamily: "Pretendard-Bold",
    fontSize: 16,
  },
  loading: {
    marginTop: 8,
  },
  errorText: {
    fontFamily: "Pretendard-Bold",
    fontSize: 14,
  },
});
