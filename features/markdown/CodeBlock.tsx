import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import SyntaxHighlighter from "react-native-syntax-highlighter";

type Props = {
  code: string;
  language?: string; // hljs language key 그대로 (typescript/javascript/css/xml/bash...)
  showLineNumbers?: boolean;
};

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

type Mode = "light" | "dark";

type Palette = {
  bg: string;
  headerBg: string;
  border: string;
  text: string;
  muted: string;
  lineNumber: string;

  keyword: string;
  builtIn: string;
  type: string;

  string: string;
  number: string;
  literal: string;

  title: string;
  function: string;
  className: string;

  tag: string;
  attr: string;
  property: string;

  comment: string;
  meta: string;
  symbol: string;
};

const BASE_DARK = {
  bg: "#0B1020",
  headerBg: "#0F172A",
  border: "#1E293B",
  text: "#E5E7EB",
  muted: "#94A3B8",
  lineNumber: "#64748B",
};

const BASE_LIGHT = {
  bg: "#F8FAFC",
  headerBg: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#64748B",
  lineNumber: "#94A3B8",
};

function pickPalette(lang: string, mode: Mode): Palette {
  const base = mode === "dark" ? BASE_DARK : BASE_LIGHT;

  // 공통 토큰 톤(모드별로 대비 다르게)
  const common =
    mode === "dark"
      ? {
          string: "#9ECE6A",
          number: "#FF9E64",
          literal: "#FF9E64",
          title: "#E0AF68",
          function: "#7AA2F7",
          className: "#E0AF68",
          attr: "#E5E7EB",
          property: "#CBD5E1",
          comment: "#64748B",
          meta: "#A1A1AA",
          symbol: "#A1A1AA",
        }
      : {
          string: "#15803D", // green-700
          number: "#C2410C", // orange-700
          literal: "#C2410C",
          title: "#7C2D12", // warm brown-ish
          function: "#1D4ED8", // blue-700
          className: "#7C2D12",
          attr: "#0F172A",
          property: "#0F172A",
          comment: "#64748B",
          meta: "#475569",
          symbol: "#475569",
        };

  // “언어 느낌”은 keyword/type/tag 쪽의 포인트로만 분리
  // (라이트에서도 잘 보이도록 너무 밝은 노랑 같은 건 약간 톤다운)
  switch (lang) {
    case "xml":
    case "html":
      return {
        ...base,
        ...common,
        keyword: mode === "dark" ? "#7DCFFF" : "#0EA5E9",
        builtIn: mode === "dark" ? "#7DCFFF" : "#0EA5E9",
        type: mode === "dark" ? "#7DCFFF" : "#0EA5E9",
        tag: mode === "dark" ? "#FF7A5C" : "#DC2626", // red-600
      };

    case "css":
    case "scss":
    case "less":
      return {
        ...base,
        ...common,
        keyword: mode === "dark" ? "#89DDFF" : "#2563EB", // blue-600
        builtIn: mode === "dark" ? "#89DDFF" : "#2563EB",
        type: mode === "dark" ? "#89DDFF" : "#2563EB",
        tag: mode === "dark" ? "#7AA2F7" : "#1D4ED8", // selector 느낌
        property: mode === "dark" ? "#C0CAF5" : "#0F172A",
      };

    case "javascript":
    case "jsx":
      return {
        ...base,
        ...common,
        keyword: mode === "dark" ? "#F7DF1E" : "#B45309", // amber-700 (라이트에서 노랑 대비 보정)
        builtIn: mode === "dark" ? "#F7DF1E" : "#B45309",
        type: mode === "dark" ? "#F7DF1E" : "#B45309",
        tag: mode === "dark" ? "#7AA2F7" : "#1D4ED8",
      };

    case "typescript":
    case "tsx":
      return {
        ...base,
        ...common,
        keyword: mode === "dark" ? "#4FC3F7" : "#0284C7", // sky-600
        builtIn: mode === "dark" ? "#4FC3F7" : "#0284C7",
        type: mode === "dark" ? "#4FC3F7" : "#0284C7",
        tag: mode === "dark" ? "#7AA2F7" : "#1D4ED8",
      };

    case "json":
      return {
        ...base,
        ...common,
        keyword: mode === "dark" ? "#CBA6F7" : "#7C3AED", // violet-600
        builtIn: mode === "dark" ? "#CBA6F7" : "#7C3AED",
        type: mode === "dark" ? "#CBA6F7" : "#7C3AED",
        title: mode === "dark" ? "#CBA6F7" : "#7C3AED",
        tag: mode === "dark" ? "#CBA6F7" : "#7C3AED",
      };

    case "bash":
    case "sh":
    case "shell":
    case "zsh":
      return {
        ...base,
        ...common,
        keyword: mode === "dark" ? "#A6E3A1" : "#15803D",
        builtIn: mode === "dark" ? "#A6E3A1" : "#15803D",
        type: mode === "dark" ? "#A6E3A1" : "#15803D",
        tag: mode === "dark" ? "#A6E3A1" : "#15803D",
      };

    default:
      return {
        ...base,
        ...common,
        keyword: mode === "dark" ? "#7AA2F7" : "#2563EB",
        builtIn: mode === "dark" ? "#7AA2F7" : "#2563EB",
        type: mode === "dark" ? "#7AA2F7" : "#2563EB",
        tag: mode === "dark" ? "#7AA2F7" : "#2563EB",
      };
  }
}

function createHljsTheme(p: Palette) {
  return {
    hljs: {
      color: p.text,
      backgroundColor: "transparent",
    },

    "hljs-keyword": { color: p.keyword, fontWeight: "700" },
    "hljs-built_in": { color: p.builtIn },
    "hljs-type": { color: p.type },

    "hljs-string": { color: p.string },
    "hljs-template-string": { color: p.string },

    "hljs-number": { color: p.number },
    "hljs-literal": { color: p.literal },

    "hljs-title": { color: p.title, fontWeight: "700" },
    "hljs-function": { color: p.function },
    "hljs-class": { color: p.className, fontWeight: "700" },

    "hljs-tag": { color: p.tag },
    "hljs-name": { color: p.tag },

    "hljs-attr": { color: p.attr },
    "hljs-attribute": { color: p.attr },
    "hljs-property": { color: p.property },

    "hljs-selector-tag": { color: p.tag },
    "hljs-selector-class": { color: p.tag },
    "hljs-selector-id": { color: p.tag },

    "hljs-comment": { color: p.comment },
    "hljs-meta": { color: p.meta },
    "hljs-symbol": { color: p.symbol },

    "hljs-emphasis": { fontStyle: "italic" },
    "hljs-strong": { fontWeight: "800" },
  } as const;
}

export default function CodeBlock({
  code,
  language,
  showLineNumbers = false,
}: Props) {
  const { theme } = useTheme();
  const mode: Mode = theme.mode === "light" ? "light" : "dark";

  const lang = (language ?? "text").trim().toLowerCase();

  const palette = useMemo(() => pickPalette(lang, mode), [lang, mode]);
  const hljsTheme = useMemo(() => createHljsTheme(palette), [palette]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: palette.bg, borderColor: palette.border },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: palette.headerBg,
            borderBottomColor: palette.border,
          },
        ]}
      >
        <AppText style={[styles.langLabel, { color: palette.muted }]}>
          {lang}
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <SyntaxHighlighter
          language={lang}
          highlighter="hljs"
          style={hljsTheme}
          showLineNumbers={showLineNumbers}
          wrapLines={false}
          wrapLongLines={false}
          customStyle={styles.syntaxCustom as any}
          CodeTag={AppText}
          PreTag={AppText}
          lineNumberStyle={{
            color: palette.lineNumber,
            fontFamily: monoFont,
            fontSize: 12,
            lineHeight: 19,
            paddingRight: 12,
          }}
          codeTagProps={{
            style: {
              color: palette.text,
              fontFamily: monoFont,
              fontSize: 13,
              lineHeight: 19,
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
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 12,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 9,
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
