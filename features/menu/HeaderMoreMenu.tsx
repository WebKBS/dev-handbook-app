import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { MenuView } from "@react-native-menu/menu";
import React from "react";
import { Alert, Platform, Pressable } from "react-native";

function HeaderMoreMenu() {
  const { theme } = useTheme();

  return (
    <MenuView
      // iOS에서 메뉴 타이틀 (선택)
      // Android에서 오른쪽 기준 정렬(헤더 우측이면 켜두는 게 자연스러움)
      isAnchoredToRight={true}
      shouldOpenOnLongPress={false}
      actions={[
        { id: "feedback", title: "피드백 보내기" },
        { id: "report", title: "오류 신고" },
        { id: "share", title: "공유" },
      ]}
      onPressAction={({ nativeEvent }) => {
        // nativeEvent.event === 선택된 id
        const id = nativeEvent.event;

        if (id === "feedback") {
          // TODO: 피드백 화면 이동
        }
        if (id === "report") {
          // TODO: 신고 화면 이동
        }
        if (id === "share") {
          // TODO: 공유
          Alert.alert("공유하기", "공유 기능은 아직 구현되지 않았습니다.");
        }
      }}
    >
      <Pressable hitSlop={12}>
        <Ionicons
          name={
            Platform.OS === "ios" ? "ellipsis-horizontal" : "ellipsis-vertical"
          }
          size={22}
          color={theme.colors.text}
        />
      </Pressable>
    </MenuView>
  );
}

export default HeaderMoreMenu;
