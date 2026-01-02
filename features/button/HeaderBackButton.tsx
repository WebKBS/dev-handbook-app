import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

interface HeaderBackButtonProps {
  navigation: any;
}

const HeaderBackButton = ({ navigation }: HeaderBackButtonProps) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={() => navigation.goBack()}
      hitSlop={12}
      style={{
        padding: 6,
      }}
    >
      <Ionicons name="close" size={24} color={theme.colors.text} />
    </Pressable>
  );
};

export default HeaderBackButton;
