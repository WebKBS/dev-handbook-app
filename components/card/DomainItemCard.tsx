import { AppText } from "@/components/text/AppText";
import type { DomainType } from "@/constants/domain";
import { ReadStatus } from "@/enums/readState.enum";
import { DOMAIN_COLORS, useTheme } from "@/providers/ThemeProvider";
import { RootManifestResponse } from "@/services/content/root-manifest";
import { Feather } from "@expo/vector-icons";
import { Link, LinkProps } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface DomainItemCardProps {
  item?: RootManifestResponse["items"][number];
  isSkeleton?: boolean;
  href?: LinkProps["href"];
  readStatus?: ReadStatus;
}

const DomainItemCard = ({
  item,
  isSkeleton,
  href,
  readStatus = "unread",
}: DomainItemCardProps) => {
  const { theme } = useTheme();

  const skeletonColor = { backgroundColor: theme.colors.card };
  const domain = item?.domain;
  const domainColor =
    (domain && DOMAIN_COLORS[domain as DomainType]) ||
    theme.colors.accentStrong;

  const statusTokens: Record<
    ReadStatus,
    {
      label: string;
      icon: "check" | "clock" | "minus";
      bg: string;
      text: string;
      border?: string;
    }
  > = {
    done: {
      label: "완료",
      icon: "check",
      bg: theme.colors.accentSubtle,
      text: theme.colors.accentStrong,
      border: "transparent",
    },
    in_progress: {
      label: "읽는 중",
      icon: "clock",
      bg: theme.colors.card,
      text: theme.colors.accent,
      border: theme.colors.border,
    },
    unread: {
      label: "미열람",
      icon: "minus",
      bg: theme.colors.card,
      text: theme.colors.muted,
      border: theme.colors.border,
    },
  };

  const status =
    readStatus && readStatus !== "unread" ? statusTokens[readStatus] : null;

  const CardContent = (
    <Pressable
      style={[
        styles.cardWrapper,
        {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.shadow,
          opacity: isSkeleton ? 0.6 : 1,
          borderColor: theme.colors.border,
        },
      ]}
      disabled={isSkeleton || !href}
      android_ripple={{ color: theme.colors.border }}
    >
      <View
        style={[
          styles.cardContent,
          {
            backgroundColor: isSkeleton
              ? theme.colors.card
              : theme.colors.cardBg,
          },
        ]}
      >
        {/* 왼쪽 컬러 바 */}
        <View style={[styles.accentBar, { backgroundColor: domainColor }]} />

        <View style={styles.mainContainer}>
          <View style={styles.textContent}>
            {isSkeleton ? (
              <>
                <View
                  style={[
                    styles.skeletonBox,
                    skeletonColor,
                    { width: "40%", height: 16, borderRadius: 4 },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonBox,
                    skeletonColor,
                    { width: "90%", height: 18, borderRadius: 4, marginTop: 8 },
                  ]}
                />
              </>
            ) : (
              <>
                {/* 상단 상태 표시 */}
                {status && (
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: status.bg,
                          borderColor: status.border,
                        },
                      ]}
                    >
                      <Feather
                        name={status.icon}
                        size={10}
                        color={status.text}
                      />
                      <AppText
                        weight="semibold"
                        style={[styles.statusText, { color: status.text }]}
                      >
                        {status.label}
                      </AppText>
                    </View>
                  </View>
                )}
                {/* 제목 및 설명 */}
                <AppText
                  weight="bold"
                  style={[styles.title, { color: theme.colors.text }]}
                  numberOfLines={2}
                >
                  {item?.title}
                </AppText>
                <AppText
                  style={[styles.description, { color: theme.colors.muted }]}
                  // numberOfLines={3}
                >
                  {item?.description}
                </AppText>
              </>
            )}
          </View>

          {/* 우측 아이콘 영역 */}
          <View style={styles.actionArea}>
            {!isSkeleton ? (
              <View
                style={[
                  styles.ctaCircle,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Feather
                  name="chevron-right"
                  size={16}
                  color={theme.colors.accentStrong}
                />
              </View>
            ) : (
              <View
                style={[styles.ctaCircle, skeletonColor, { opacity: 0.5 }]}
              />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (href && !isSkeleton) {
    return (
      <Link href={href} asChild>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default DomainItemCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 14, // 기존 유지
    overflow: "hidden",
    borderWidth: 1,
    padding: 6, // 기존 유지
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  cardContent: {
    flexDirection: "row",
    borderRadius: 8, // 기존 유지
    overflow: "hidden",
    position: "relative",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    zIndex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16, // 컬러바 공간 포함 여백
    paddingRight: 12,
    paddingVertical: 14,
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  statusRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionArea: {
    marginLeft: 12,
    justifyContent: "center",
  },
  ctaCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonBox: {
    backgroundColor: "#E0E0E0",
  },
});
