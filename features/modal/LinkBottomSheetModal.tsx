import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export function LinkBottomSheetModal({
  modalRef,
  url,
}: {
  modalRef: React.RefObject<BottomSheetModal>;
  url: string | null;
}) {
  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const safeUrl = url && /^https?:\/\//i.test(url) ? url : null;

  console.log(safeUrl);

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      enableDynamicSizing={false} // ✅ v5 기본 true라 작아지는 원인 제거 :contentReference[oaicite:1]{index=1}
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}
      backgroundStyle={styles.sheetBg}
    >
      <BottomSheetView style={styles.content}>
        {safeUrl ? (
          <WebView
            source={{ uri: safeUrl }}
            style={{ flex: 1 }} // ✅ WebView 높이 확보
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={["http://*", "https://*"]}
            setSupportMultipleWindows={false}
            onShouldStartLoadWithRequest={(req) =>
              /^https?:\/\//i.test(req.url)
            }
          />
        ) : (
          <View />
        )}
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
});
