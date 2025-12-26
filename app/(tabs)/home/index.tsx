import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import ErrorState from "@/components/state/ErrorState";
import { useDomain } from "@/hooks/services/useDomain";
import { useTheme } from "@/providers/ThemeProvider";
import { focusManager } from "@tanstack/query-core";
import { useEffect } from "react";
import {
  AppState,
  AppStateStatus,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

// 앱 상태 변화에 따라 focusManager의 포커스 상태를 업데이트합니다.
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function HomeScreen() {
  const { mode, theme, toggleMode } = useTheme();

  const { data, isPending, error, refetch } = useDomain();

  useEffect(() => {
    // 앱 화면 상태 변화 이벤트 리스너 등록
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  if (error) {
    return (
      <SafeAreaViewScreen>
        <ErrorState
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      </SafeAreaViewScreen>
    );
  }

  return (
    <SafeAreaViewScreen>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* html */}
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
});
