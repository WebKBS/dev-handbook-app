import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";

export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  cardBg: string;
  text: string;
  muted: string;
  accent: string;
  accentStrong: string;
  accentSubtle: string;
  headerBg: string;
  border: string;
  codeBg: string;
  codeText: string;
  tabInactive: string;
  shadow: string;
};

export type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
};

type ThemeContextValue = {
  mode: ThemeMode;
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const palette = {
  ink: "#0b1220",
  midnight: "#0f172a",
  slate: "#1f2937",
  pebble: "#e2e8f0",
  cloud: "#f8fafc",
  accent: "#0ea5e9",
  accentDeep: "#0284c7",
  accentBright: "#38bdf8",
  ember: "#f97316",
  ash: "#94a3b8",
  mutedLight: "#64748b",
};

export const themes: Record<ThemeMode, Theme> = {
  light: {
    colors: {
      background: palette.cloud,
      surface: "#ffffff",
      card: "#f4f6fb",
      cardBg: "#ffffff",
      text: palette.ink,
      muted: palette.mutedLight,
      accent: palette.accent,
      accentStrong: palette.accentDeep,
      accentSubtle: "rgba(14, 165, 233, 0.08)",
      headerBg: "rgba(255,255,255,0.9)",
      border: palette.pebble,
      codeBg: "rgba(15, 23, 42, 0.05)",
      codeText: palette.ink,
      tabInactive: palette.ash,
      shadow: "rgba(15, 23, 42, 0.08)",
    },
    mode: "light",
  },
  dark: {
    colors: {
      background: palette.ink,
      surface: palette.midnight,
      card: palette.slate,
      cardBg: palette.midnight,
      text: "#e5e7eb",
      muted: palette.ash,
      accent: palette.accentBright,
      accentStrong: palette.accent,
      accentSubtle: "rgba(56, 189, 248, 0.1)",
      headerBg: "rgba(18, 18, 18, 0.9)",
      border: "#1f2937",
      codeBg: "rgba(255, 255, 255, 0.05)",
      codeText: "#e5e7eb",
      tabInactive: "#6b7280",
      shadow: "rgba(8, 15, 26, 0.6)",
    },
    mode: "dark",
  },
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(
    Appearance.getColorScheme() === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(colorScheme === "dark" ? "dark" : "light");
    });

    return () => subscription.remove();
  }, []);

  const theme = useMemo(() => themes[mode], [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      mode,
      theme,
      setMode,
      toggleMode,
    }),
    [mode, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return value;
}
