import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * 콘텐츠 하단 패딩 계산 훅
 * - 안드로이드에서 소프트 내비게이션 바 높이 + 64 추가
 */
export const useContentPaddingBotton = () => {
  const { bottom } = useSafeAreaInsets();

  return 40 + (Platform.OS === "android" ? bottom + 64 : 0);
};
