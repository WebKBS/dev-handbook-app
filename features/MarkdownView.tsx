import { AppText } from "@/components/text/AppText";
import CodeBlock from "@/features/CodeBlock";
import { Theme, useTheme } from "@/providers/ThemeProvider";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";

type Props = {
  markdown: string;
};

function extractFenceLanguage(node: any): string | undefined {
  // markdown-it 토큰에서 언어 정보가 node.info / node.sourceInfo 쪽에 들어오는 경우가 많음
  const info = node?.info ?? node?.attributes?.info ?? node?.sourceInfo ?? "";

  const raw = String(info).trim();
  if (!raw) return undefined;

  // ```ts {1,3} 같은 형태면 첫 토큰만 언어로 사용
  return raw.split(/\s+/)[0];
}

export function MarkdownView({ markdown }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const rules = useMemo(() => {
    return {
      // ```lang fenced block
      fence: (node: any) => {
        const language = extractFenceLanguage(node);
        const code = node?.content ?? "";
        return <CodeBlock key={node.key} code={code} language={language} />;
      },

      // 4스페이스 들여쓰기 코드블럭
      code_block: (node: any) => {
        const code = node?.content ?? "";
        return <CodeBlock key={node.key} code={code} language="text" />;
      },

      // 인라인 코드
      code_inline: (node: any) => {
        const txt = node?.content ?? "";
        return (
          <AppText key={node.key} style={styles.inlineCode}>
            {txt}
          </AppText>
        );
      },
    };
  }, [styles.inlineCode]);

  return <Markdown rules={rules}>{markdown}</Markdown>;
}

const createStyles = (theme: Theme) => {
  const inlineCode = StyleSheet.create({
    inlineCode: {
      fontFamily: "monospace",
      fontSize: 13,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      color: theme.colors.codeText,
    },
  });

  const markdownStyles = StyleSheet.create({
    body: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text,
    },
    heading1: {
      fontSize: 26,
      marginTop: 12,
      marginBottom: 6,
      color: theme.colors.text,
    },
    heading2: {
      fontSize: 20,
      marginTop: 12,
      marginBottom: 6,
      color: theme.colors.text,
    },
    paragraph: { marginTop: 6, marginBottom: 6, color: theme.colors.text },
    bullet_list: { marginVertical: 6 },
    ordered_list: { marginVertical: 6 },
    strong: { color: theme.colors.text },
    link: { color: theme.colors.accent },
  });

  return { inlineCode: inlineCode.inlineCode, markdownStyles };
};
