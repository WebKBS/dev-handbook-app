import { AppText } from "@/components/text/AppText";
import { ThemeColors, useTheme } from "@/providers/ThemeProvider";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import SyntaxHighlighter from "react-native-syntax-highlighter";

type Props = {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
};

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

function normalizeLanguage(language?: string) {
  const l = (language ?? "").trim().toLowerCase();
  if (!l) return "text";
  if (l === "typescript") return "ts";
  if (l === "javascript") return "js";
  if (l === "shell") return "bash";
  return l;
}

/**
 * highlight.js(hljs) 토큰 클래스에 대응하는 스타일 맵
 * - react-native-syntax-highlighter (highlighter="hljs")에서 잘 먹음
 * - colors에 맞춰 “대충 예쁘게”가 아니라, 문서 앱처럼 톤 맞추는 게 목표
 */
function createHljsTheme(colors: ThemeColors) {
  const baseText = colors.codeText ?? colors.text;
  const muted = colors.muted;

  // 포인트 컬러는 theme.accent를 기반으로 과하지 않게 분기
  const accent = colors.accent;

  return {
    hljs: {
      color: baseText,
      backgroundColor: "transparent",
    },

    // 키워드/타입/예약어
    "hljs-keyword": { color: accent, fontWeight: "700" },
    "hljs-built_in": { color: accent },
    "hljs-type": { color: accent },

    // 문자열/템플릿
    "hljs-string": { color: baseText },
    "hljs-template-string": { color: baseText },

    // 숫자/불리언/리터럴
    "hljs-number": { color: baseText },
    "hljs-literal": { color: baseText },

    // 함수/클래스/타이틀
    "hljs-title": { color: baseText, fontWeight: "700" },
    "hljs-function": { color: baseText },
    "hljs-class": { color: baseText, fontWeight: "700" },

    // 속성/프로퍼티
    "hljs-attr": { color: baseText },
    "hljs-attribute": { color: baseText },
    "hljs-property": { color: baseText },

    // 주석
    "hljs-comment": { color: muted },

    // 태그/선택자(HTML/CSS 계열)
    "hljs-tag": { color: accent },
    "hljs-name": { color: accent },
    "hljs-selector-tag": { color: accent },
    "hljs-selector-class": { color: accent },
    "hljs-selector-id": { color: accent },

    // 메타/심볼
    "hljs-meta": { color: muted },
    "hljs-symbol": { color: muted },

    // 강조
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

  const themed = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const lang = useMemo(() => normalizeLanguage(language), [language]);

  // 내부 하이라이트 테마
  const hljsTheme = useMemo(
    () => createHljsTheme(theme.colors),
    [theme.colors],
  );

  return (
    <View style={[styles.container, themed.container]}>
      <View style={[styles.header, themed.header]}>
        <AppText style={[styles.langLabel, themed.langLabel]}>{lang}</AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scroll]}
      >
        <SyntaxHighlighter
          language={lang}
          highlighter="hljs"
          style={hljsTheme}
          showLineNumbers={showLineNumbers}
          wrapLongLines={false}
          customStyle={[styles.syntaxCustom, themed.syntaxCustom] as any}
          CodeTag={AppText}
          PreTag={AppText}
          codeTagProps={{
            style: {
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.codeBg,
      borderColor: colors.border,
    },
    header: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
    },
    langLabel: {
      color: colors.muted,
    },
    syntaxCustom: {
      color: colors.codeText ?? colors.text,
    },
  });
