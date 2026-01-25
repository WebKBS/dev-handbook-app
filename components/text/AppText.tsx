import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, Text, type TextProps } from "react-native";

// 폰트 weight 타입 정의
type Weight = "regular" | "medium" | "semibold" | "bold" | "extrabold";

const fontMap: Record<Weight, string> = {
  regular: "Pretendard-Regular",
  medium: "Pretendard-Medium",
  semibold: "Pretendard-SemiBold",
  bold: "Pretendard-Bold",
  extrabold: "Pretendard-ExtraBold",
};

export function AppText({
  style,
  weight = "regular",
  ...props
}: TextProps & { weight?: Weight }) {
  const { theme } = useTheme();

  return (
    <Text
      {...props}
      style={[
        styles.base,
        {
          fontFamily: fontMap[weight],
          fontWeight: "normal",
          color: theme.colors.text,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    // 공통 텍스트 스타일 있으면 여기 추가
  },
});
