import { useTheme } from "@/providers/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalSearchParams } from "expo-router";
import { Linking, Pressable } from "react-native";

const OpenUrlLinkButton = () => {
  const { theme } = useTheme();
  const { url } = useGlobalSearchParams();

  return (
    <Pressable
      onPress={() => Linking.openURL(url as string)}
      hitSlop={12}
      style={{
        padding: 6,
      }}
    >
      <MaterialCommunityIcons name="web" size={24} color={theme.colors.text} />
    </Pressable>
  );
};

export default OpenUrlLinkButton;
