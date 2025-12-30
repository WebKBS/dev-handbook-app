import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type ErrorStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
};

const ErrorState = ({
  title = "문제가 발생했어요",
  message = "잠시 후 다시 시도해주세요.",
  actionLabel = "다시 시도",
  onRetry,
}: ErrorStateProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: theme.colors.codeBg,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Feather name="alert-triangle" size={22} color={theme.colors.accent} />
      </View>
      <AppText
        weight="bold"
        style={[styles.title, { color: theme.colors.text }]}
      >
        {title}
      </AppText>
      <AppText style={[styles.message, { color: theme.colors.muted }]}>
        {message}
      </AppText>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.accent,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <AppText weight="semibold" style={{ color: theme.colors.text }}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
};

export default ErrorState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 10,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
});
