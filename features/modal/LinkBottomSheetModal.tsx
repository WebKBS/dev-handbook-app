import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const HEIGHT = Dimensions.get("window").height;

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

  const snapPoints = useMemo(() => ["60%", "100%"], []);
  const safeUrl = url?.trim() ?? null;

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      enableDynamicSizing={false}
      enablePanDownToClose
      containerStyle={{
        zIndex: 50,
      }}
      //  WebView 스크롤이 안 되는 주원인 해결
      // - 시트 “콘텐츠 영역”의 팬 제스처를 꺼서 WebView가 터치를 가져가게 함
      // - 시트 높이 조절/닫기는 "핸들"로만 가능 (UX도 보통 이게 더 깔끔)
      enableContentPanningGesture={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          style={[
            props.style,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        />
      )}
      backgroundStyle={[
        styles.sheetBg,
        { backgroundColor: theme.colors.background },
      ]}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.accent,
        opacity: theme.mode === "dark" ? 0.9 : 0.8,
        width: 44,
      }}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.webWrap}>
          {safeUrl && isHttpUrl(safeUrl) ? (
            <>
              <WebView
                source={{ uri: safeUrl }}
                style={[
                  styles.webview,
                  {
                    height: HEIGHT,
                  },
                ]}
                scrollEnabled
                nestedScrollEnabled
                startInLoadingState
              />
            </>
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
  content: { flex: 1 },
  webWrap: { flex: 1 },
  webview: { flex: 1 },
});
