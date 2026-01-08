import { DomainType } from "@/constants/domain";
import {
  markDone,
  markInProgress,
  markInProgressOverride,
} from "@/db/readState";
import { ReadStatus } from "@/enums/readState.enum";
import { useTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { MenuView } from "@react-native-menu/menu";
import React, { useState } from "react";
import { Alert, Linking, Platform, Pressable, Share } from "react-native";

const FEEDBACK_EMAIL = "dev21c2020@gmail.com";

interface HeaderMoreMenuProps {
  title: string;
  slug: string;
  domain: DomainType;
  readStatus?: ReadStatus;
  onReadStatusChange?: (next: ReadStatus) => void;
}

function DomainSlugHeaderMoreMenu({
  title,
  slug,
  domain,
  readStatus,
  onReadStatusChange,
}: HeaderMoreMenuProps) {
  const { theme } = useTheme();
  const [saving, setSaving] = useState(false);

  const handleShare = async () => {
    try {
      if (!slug || !domain) {
        Alert.alert("공유 실패", "공유할 경로 정보를 찾지 못했어요.");
        return;
      }

      // 웹(Universal/App Links)로 공유할 URL
      const url = `https://recodelog.com/learn/${encodeURIComponent(
        String(domain),
      )}/${encodeURIComponent(String(slug))}`;

      await Share.share({
        message: `이 글 보기: ${url}`, // 대부분 메신저가 message 안 URL을 링크로 인식
        // url, // 필요하면 같이 넣어도 되지만 message에 포함만 해도 충분한 경우가 많음
      });
    } catch (error: any) {
      Alert.alert("공유 실패", "공유 중 오류가 발생했어요.", error);
    }
  };

  const handleFeedback = async () => {
    try {
      const subject = encodeURIComponent(`Dev Handbook 피드백: ${title}`);
      const body = encodeURIComponent(
        [
          "Dev Handbook 팀에 보내는 피드백입니다.",
          "",
          "------------",
          `제목: ${title}`,
          `경로: /${domain}/${slug}`,
          "------------",
          "",
          "피드백 내용:",
          "",
          "",
        ].join("\n"),
      );
      const mailtoUrl = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;

      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (!canOpen) {
        Alert.alert("피드백 전송 실패", "메일 앱을 열 수 없습니다.");
        return;
      }

      await Linking.openURL(mailtoUrl);
    } catch (error: any) {
      Alert.alert(
        "피드백 전송 실패",
        "메일 전송을 준비하는 중 오류가 발생했습니다.",
        error,
      );
    }
  };

  const handleMark = async (
    nextStatus: ReadStatus,
    opts?: { force?: boolean },
  ) => {
    if (saving) return;
    if (!slug || !domain) return;
    setSaving(true);
    try {
      if (nextStatus === "done") {
        await markDone(domain, slug);
      } else if (nextStatus === "in_progress") {
        if (opts?.force) {
          await markInProgressOverride(domain, slug);
        } else {
          await markInProgress(domain, slug);
        }
      }
      onReadStatusChange?.(nextStatus);
    } catch (error: any) {
      Alert.alert("상태 변경 실패", "읽음 상태를 저장하지 못했어요.", error);
    } finally {
      setSaving(false);
    }
  };

  const readActions = () => {
    if (readStatus === "done") {
      return [{ id: "mark-reset", title: "완료 취소" }];
    }

    const actions = [];
    if (readStatus !== "in_progress") {
      actions.push({ id: "mark-in-progress", title: "읽는 중으로 표시" });
    }
    actions.push({ id: "mark-done", title: "완료로 표시" });
    return actions;
  };

  return (
    <MenuView
      isAnchoredToRight
      shouldOpenOnLongPress={false}
      actions={[
        ...readActions(),
        { id: "feedback", title: "피드백 보내기" },
        { id: "share", title: "공유" },
      ]}
      onPressAction={({ nativeEvent }) => {
        const id = nativeEvent.event;

        if (id === "feedback") {
          handleFeedback();
        }

        if (id === "share") {
          handleShare();
        }

        if (id === "mark-in-progress") {
          handleMark("in_progress");
        }
        if (id === "mark-done") {
          handleMark("done");
        }
        if (id === "mark-reset") {
          handleMark("in_progress", { force: true });
        }
      }}
    >
      <Pressable hitSlop={12}>
        <Ionicons
          name={
            Platform.OS === "ios" ? "ellipsis-horizontal" : "ellipsis-vertical"
          }
          size={22}
          color={theme.colors.text}
        />
      </Pressable>
    </MenuView>
  );
}

export default DomainSlugHeaderMoreMenu;
