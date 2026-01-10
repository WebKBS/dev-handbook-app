import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const SCREEN_HEIGHT = Dimensions.get("window").height;

function isHttpUrl(u: string) {
  return /^https?:\/\//i.test(u);
}

export function LinkBottomSheetModal({
  modalRef,
  url,
}: {
  modalRef: React.RefObject<BottomSheetModal | null>;
  url: string | null;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // 시트가 실제로 올라갈 수 있는 최대 높이(상단 안전영역 고려)
  const maxSheetHeight = useMemo(
    () => SCREEN_HEIGHT - insets.top,
    [insets.top],
  );

  // % 문자열 대신 px로 고정: WebView 높이 계산이 확실해짐
  const snapPoints = useMemo(
    () => [Math.round(maxSheetHeight * 0.6), Math.round(maxSheetHeight)],
    [maxSheetHeight],
  );

  const [sheetIndex, setSheetIndex] = useState(0);

  const safeUrl = url?.trim() ?? null;
  const canRender = !!safeUrl && isHttpUrl(safeUrl);

  // 현재 snap에 맞는 “확정 높이”를 래퍼에 직접 부여
  const currentSheetHeight =
    sheetIndex >= 0
      ? snapPoints[Math.min(sheetIndex, snapPoints.length - 1)]
      : snapPoints[0];

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      onChange={(i) => setSheetIndex(i)}
      enableDynamicSizing={false}
      enablePanDownToClose
      containerStyle={{ zIndex: 50 }}
      // WebView가 스크롤/터치 우선권 갖게
      enableContentPanningGesture={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          style={[props.style, { backgroundColor: theme.colors.background }]}
        />
      )}
      backgroundStyle={[styles.sheetBg]}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.accent,
        opacity: theme.mode === "dark" ? 0.9 : 0.8,
        width: 44,
      }}
    >
      <BottomSheetView style={styles.content}>
        <View
          style={[
            styles.webWrap,
            {
              height: currentSheetHeight, // 핵심: 0 방지 + 60%에서도 넘침 방지
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {canRender ? (
            <WebView
              source={{ uri: safeUrl! }}
              style={styles.webview} // height 없음, 대신 부모 height로 결정
              scrollEnabled
              nestedScrollEnabled
              startInLoadingState
              // 필요하면 켜도 됨 (iOS)
              allowsBackForwardNavigationGestures
            />
          ) : (
            <View />
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  webWrap: {
    width: "100%",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
});
