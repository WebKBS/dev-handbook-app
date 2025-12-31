import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

const BackButton = () => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.back();
      }}
      hitSlop={10}
    >
      {/*hitSlop은 터치 영역을 확장해주는 속성입니다. */}
      <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
    </Pressable>
  );
};

export default BackButton;
