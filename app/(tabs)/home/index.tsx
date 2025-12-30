import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import ErrorState from "@/components/state/ErrorState";
import HomeScreenContainer from "@/containers/home/HomeScreenContainer";
import { useDomain } from "@/hooks/services/useDomain";
import { useTheme } from "@/providers/ThemeProvider";
import { focusManager } from "@tanstack/query-core";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
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
  const dbContext = useSQLiteContext();
  useDrizzleStudio(dbContext);

  const { theme } = useTheme();

  const { data, isPending, error, refetch } = useDomain();

  useEffect(() => {
    // 앱 화면 상태 변화 이벤트 리스너 등록
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  if (isPending && !data) {
    // 초기 로딩 중에는 아무것도 렌더링하지 않음
    // TODO: 스켈레톤 UI 추가 고려
    return null;
  }

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
        contentInsetAdjustmentBehavior={"automatic"}
        showsVerticalScrollIndicator={false}
      >
        <HomeScreenContainer data={data} />
      </ScrollView>
    </SafeAreaViewScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
