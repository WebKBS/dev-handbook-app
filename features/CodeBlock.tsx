import { AppText } from "@/components/text/AppText";
import { ThemeColors, useTheme } from "@/providers/ThemeProvider";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import SyntaxHighlighter from "react-native-syntax-highlighter";

type Props = {
  code: string;
  language?: string; // "ts", "js", "bash" 등
  showLineNumbers?: boolean;
};

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

function normalizeLanguage(language?: string) {
  const l = (language ?? "").trim().toLowerCase();
  if (!l) return "text"; //  언어가 없으면 text로 강제
  // 필요하면 alias 추가
  if (l === "typescript") return "ts";
  if (l === "javascript") return "js";
  if (l === "shell") return "bash";
  return l;
}

export default function CodeBlock({
  code,
  language,
  showLineNumbers = false,
}: Props) {
  const { theme } = useTheme();
  const themedStyles = useMemo(
    () => createStyles(theme.colors),
    [theme.colors],
  );
  const lang = useMemo(() => normalizeLanguage(language), [language]);

  return (
    <View style={[styles.container, themedStyles.container]}>
      {/* 언어 라벨(항상 표시) */}
      <View style={[styles.header, themedStyles.header]}>
        <AppText style={[styles.langLabel, themedStyles.langLabel]}>
          {lang}
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, themedStyles.scroll]}
      >
        <SyntaxHighlighter
          language={lang}
          highlighter="hljs"
          showLineNumbers={showLineNumbers}
          wrapLongLines={false}
          customStyle={[styles.syntaxCustom, themedStyles.syntaxCustom] as any}
          CodeTag={AppText}
          PreTag={AppText}
          codeTagProps={{
            style: {
              fontFamily: monoFont,
              fontSize: 13,
              lineHeight: 18,
            },
          }}
        >
          {String(code ?? "").replace(/\n$/, "")}
        </SyntaxHighlighter>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 10,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  langLabel: {
    fontFamily: monoFont,
    fontSize: 12,
  },
  scroll: { padding: 12 },
  syntaxCustom: {
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
  },
});

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    header: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
    },
    langLabel: {
      color: colors.muted,
    },
    scroll: {
      backgroundColor: colors.surface,
    },
    syntaxCustom: {
      color: colors.codeText ?? colors.text,
    },
  });
