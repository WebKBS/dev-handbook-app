import { useTheme } from "@/providers/ThemeProvider";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaViewScreenProps {
  children: ReactNode;
}

const SafeAreaViewScreen = ({ children }: SafeAreaViewScreenProps) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaViewScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
