import { AppText } from "@/components/text/AppText";
import CodeBlock from "@/features/CodeBlock";
import { Theme, useTheme } from "@/providers/ThemeProvider";
import React, { useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";

type Props = { markdown: string };

function extractFenceLanguage(node: any): string | undefined {
  const info = node?.info ?? node?.attributes?.info ?? node?.sourceInfo ?? "";
  const raw = String(info).trim();
  if (!raw) return undefined;
  return raw.split(/\s+/)[0];
}

export function MarkdownView({ markdown }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const rules = useMemo(() => {
    return {
      fence: (node: any) => {
        const language = extractFenceLanguage(node);
        const code = node?.content ?? "";
        return <CodeBlock key={node.key} code={code} language={language} />;
      },

      code_block: (node: any) => {
        const code = node?.content ?? "";
        return <CodeBlock key={node.key} code={code} language="text" />;
      },

      code_inline: (node: any) => {
        const txt = node?.content ?? "";
        return (
          <AppText key={node.key} style={styles.inlineCode}>
            {txt}
          </AppText>
        );
      },

      blockquote: (node: any, children: any) => {
        return (
          <View key={node.key} style={styles.blockquoteBox}>
            {children}
          </View>
        );
      },

      // 테이블 가로 스크롤
      table: (node: any, children: any) => {
        return (
          <ScrollView
            key={node.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tableScrollContent}
          >
            <View style={[styles.markdown.table, styles.tableWrap]}>
              {children}
            </View>
          </ScrollView>
        );
      },
    };
  }, [
    styles.inlineCode,
    styles.blockquoteBox,
    styles.tableWrap,
    styles.markdown.table,
    styles.tableScrollContent,
  ]);

  return (
    <Markdown rules={rules} style={styles.markdown}>
      {markdown}
    </Markdown>
  );
}

const createStyles = (theme: Theme) => {
  const markdown = StyleSheet.create({
    body: {
      color: theme.colors.text,
      fontSize: 15,
      lineHeight: 23,
    },

    heading1: {
      color: theme.colors.text,
      fontSize: 28,
      lineHeight: 34,
      marginTop: 18,
      marginBottom: 10,
      fontWeight: "800",
    },
    heading2: {
      color: theme.colors.text,
      fontSize: 22,
      lineHeight: 28,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: "800",
    },
    heading3: {
      color: theme.colors.text,
      fontSize: 18,
      lineHeight: 24,
      marginTop: 14,
      marginBottom: 6,
      fontWeight: "700",
    },

    paragraph: {
      marginTop: 6,
      marginBottom: 10,
      color: theme.colors.text,
    },

    strong: { fontWeight: "800", color: theme.colors.text },
    link: {
      color: theme.colors.accent,
      textDecorationLine: "underline",
      textDecorationColor: theme.colors.accent,
    },

    bullet_list: { marginVertical: 8, paddingLeft: 2 },
    ordered_list: { marginVertical: 8, paddingLeft: 2 },
    list_item: { marginVertical: 3 },
    bullet_list_icon: { color: theme.colors.muted },
    ordered_list_icon: { color: theme.colors.muted },

    hr: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 14,
    },

    // 테이블 자체 스타일 (테두리/패딩)
    table: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      overflow: "hidden",
      marginVertical: 12,
    },
    thead: { backgroundColor: theme.colors.surface },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
    },
    th: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      color: theme.colors.text,
      fontWeight: "800",
      flex: 1,
    },
    td: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      color: theme.colors.text,
      flex: 1,
      maxWidth: 160,
      minWidth: 160,
    },
  });

  const inlineCode = StyleSheet.create({
    inlineCode: {
      fontFamily: "monospace",
      fontSize: 13,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: theme.colors.codeBg ?? theme.colors.surface,
      borderColor: theme.colors.border,
      color: theme.colors.codeText ?? theme.colors.text,
    },
  });

  const blockquote = StyleSheet.create({
    blockquoteBox: {
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginVertical: 10,
    },
  });

  // table scroll wrapper
  const tableScroll = StyleSheet.create({
    tableScrollContent: {
      paddingRight: 8, // 끝이 딱 붙어 보이는 것 방지
    },
    tableWrap: {
      // 테이블이 최소 화면폭은 차지하도록 숫자 픽셀로 강제
      minWidth: Dimensions.get("window").width,
      flexShrink: 0,
    },
  });

  return {
    markdown,
    inlineCode: inlineCode.inlineCode,
    blockquoteBox: blockquote.blockquoteBox,
    tableScrollContent: tableScroll.tableScrollContent,
    tableWrap: tableScroll.tableWrap,
  };
};
