import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { MenuView } from "@react-native-menu/menu";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type DomainReadFilter = "all" | "unread" | "read";

const FILTER_OPTIONS: { id: DomainReadFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "unread", label: "안 읽음" },
  { id: "read", label: "완료" },
];

type Props = {
  value: DomainReadFilter;
  onChange: (next: DomainReadFilter) => void;
};

export function DomainReadFilterMenu({ value, onChange }: Props) {
  const { theme } = useTheme();
  const current = FILTER_OPTIONS.find((opt) => opt.id === value);

  return (
    <MenuView
      isAnchoredToRight
      shouldOpenOnLongPress={false}
      actions={FILTER_OPTIONS.map((opt) => ({
        id: opt.id,
        title: opt.label,
        state: opt.id === value ? "on" : "off",
      }))}
      onPressAction={({ nativeEvent }) => {
        const next = nativeEvent.event as DomainReadFilter;
        if (next && next !== value) {
          onChange(next);
        }
      }}
    >
      <Pressable
        hitSlop={8}
        style={[
          styles.button,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <View style={styles.buttonContent}>
          <AppText
            weight="semibold"
            style={[styles.buttonLabel, { color: theme.colors.text }]}
          >
            {current?.label ?? "전체"}
          </AppText>
          <Ionicons name="chevron-down" size={16} color={theme.colors.muted} />
        </View>
      </Pressable>
    </MenuView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  buttonLabel: {
    fontSize: 14,
  },
});
