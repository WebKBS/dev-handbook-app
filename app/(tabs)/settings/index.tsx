import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import Constants from "expo-constants";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

const SettingsScreen = () => {
  const { mode, theme, toggleMode } = useTheme();
  //
  // const quickActions: Array<{
  //   icon: keyof typeof Feather.glyphMap;
  //   title: string;
  //   description: string;
  // }> = [
  //   {
  //     icon: "user",
  //     title: "프로필 수정",
  //     description: "소개, 역할, 연락처를 최신 상태로 유지하세요.",
  //   },
  //   {
  //     icon: "lock",
  //     title: "보안 설정",
  //     description: "비밀번호, 2단계 인증, 기기 로그인을 관리합니다.",
  //   },
  //   {
  //     icon: "life-buoy",
  //     title: "문의하기",
  //     description: "가이드에 추가하고 싶은 내용이 있다면 알려주세요.",
  //   },
  // ];

  const versionLabel = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SafeAreaViewScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <AppText
              weight="bold"
              style={[styles.cardTitle, { color: theme.colors.text }]}
            >
              환경 설정
            </AppText>
          </View>

          <Pressable
            onPress={toggleMode}
            style={[
              styles.row,
              styles.touchableRow,
              { borderColor: theme.colors.border },
            ]}
          >
            <View style={styles.rowLeft}>
              <View>
                <AppText weight="semibold" style={{ color: theme.colors.text }}>
                  테마
                </AppText>
                <AppText
                  style={[styles.rowCaption, { color: theme.colors.muted }]}
                >
                  {mode === "dark"
                    ? "어둡게, 눈부심 최소화"
                    : "밝게, 가독성 강조"}
                </AppText>
              </View>
            </View>

            <Switch
              value={mode === "dark"}
              onValueChange={toggleMode}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
              thumbColor={theme.colors.surface}
              ios_backgroundColor={theme.colors.border}
              style={
                Platform.OS === "ios"
                  ? {
                      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                    }
                  : {}
              }
            />
          </Pressable>

          {/*<View style={[styles.row, { borderColor: theme.colors.border }]}>*/}
          {/*  <View style={styles.rowLeft}>*/}
          {/*    <View>*/}
          {/*      <AppText weight="semibold" style={{ color: theme.colors.text }}>*/}
          {/*        푸시 알림*/}
          {/*      </AppText>*/}
          {/*      <AppText*/}
          {/*        style={[styles.rowCaption, { color: theme.colors.muted }]}*/}
          {/*      >*/}
          {/*        배포, 리뷰 요청, 즐겨찾기 업데이트 소식 받기*/}
          {/*      </AppText>*/}
          {/*    </View>*/}
          {/*  </View>*/}
          {/*  <Switch*/}
          {/*    value={pushEnabled}*/}
          {/*    onValueChange={setPushEnabled}*/}
          {/*    trackColor={{*/}
          {/*      false: theme.colors.border,*/}
          {/*      true: theme.colors.accent,*/}
          {/*    }}*/}
          {/*    thumbColor={theme.colors.surface}*/}
          {/*    ios_backgroundColor={theme.colors.border}*/}
          {/*    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}*/}
          {/*  />*/}
          {/*</View>*/}

          {/*<View style={[styles.row, { borderColor: theme.colors.border }]}>*/}
          {/*  <View style={styles.rowLeft}>*/}
          {/*    <View>*/}
          {/*      <AppText weight="semibold" style={{ color: theme.colors.text }}>*/}
          {/*        이메일 알림*/}
          {/*      </AppText>*/}
          {/*      <AppText*/}
          {/*        style={[styles.rowCaption, { color: theme.colors.muted }]}*/}
          {/*      >*/}
          {/*        하루 한 번 정리된 요약 메일*/}
          {/*      </AppText>*/}
          {/*    </View>*/}
          {/*  </View>*/}
          {/*  <Switch*/}
          {/*    value={emailEnabled}*/}
          {/*    onValueChange={setEmailEnabled}*/}
          {/*    trackColor={{*/}
          {/*      false: theme.colors.border,*/}
          {/*      true: theme.colors.accent,*/}
          {/*    }}*/}
          {/*    thumbColor={theme.colors.surface}*/}
          {/*    ios_backgroundColor={theme.colors.border}*/}
          {/*    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}*/}
          {/*  />*/}
          {/*</View>*/}

          {/*<View style={[styles.row, { borderColor: theme.colors.border }]}>*/}
          {/*  <View style={styles.rowLeft}>*/}
          {/*    <View>*/}
          {/*      <AppText weight="semibold" style={{ color: theme.colors.text }}>*/}
          {/*        위클리 다이제스트*/}
          {/*      </AppText>*/}
          {/*      <AppText*/}
          {/*        style={[styles.rowCaption, { color: theme.colors.muted }]}*/}
          {/*      >*/}
          {/*        일주일간의 새 글을 금요일 아침에 전달해요.*/}
          {/*      </AppText>*/}
          {/*    </View>*/}
          {/*  </View>*/}
          {/*  <Switch*/}
          {/*    value={digestEnabled}*/}
          {/*    onValueChange={setDigestEnabled}*/}
          {/*    trackColor={{*/}
          {/*      false: theme.colors.border,*/}
          {/*      true: theme.colors.accent,*/}
          {/*    }}*/}
          {/*    thumbColor={theme.colors.surface}*/}
          {/*    ios_backgroundColor={theme.colors.border}*/}
          {/*    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}*/}
          {/*  />*/}
          {/*</View>*/}
        </View>

        {/* 계정 및 지원 */}
        {/*<View*/}
        {/*  style={[*/}
        {/*    styles.card,*/}
        {/*    {*/}
        {/*      backgroundColor: theme.colors.surface,*/}
        {/*      borderColor: theme.colors.border,*/}
        {/*      shadowColor: theme.colors.shadow,*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*>*/}
        {/*  <AppText*/}
        {/*    weight="bold"*/}
        {/*    style={[styles.cardTitle, { color: theme.colors.text }]}*/}
        {/*  >*/}
        {/*    계정 & 지원*/}
        {/*  </AppText>*/}
        {/*  <View style={styles.quickList}>*/}
        {/*    {quickActions.map((item, index) => (*/}
        {/*      <Pressable*/}
        {/*        key={item.title}*/}
        {/*        style={[*/}
        {/*          styles.quickRow,*/}
        {/*          index === 0 && styles.quickRowFirst,*/}
        {/*          { borderColor: theme.colors.border },*/}
        {/*        ]}*/}
        {/*      >*/}
        {/*        <View style={styles.rowLeft}>*/}
        {/*          <View>*/}
        {/*            <AppText*/}
        {/*              weight="semibold"*/}
        {/*              style={{ color: theme.colors.text }}*/}
        {/*            >*/}
        {/*              {item.title}*/}
        {/*            </AppText>*/}
        {/*            <AppText*/}
        {/*              style={[styles.rowCaption, { color: theme.colors.muted }]}*/}
        {/*            >*/}
        {/*              {item.description}*/}
        {/*            </AppText>*/}
        {/*          </View>*/}
        {/*        </View>*/}
        {/*        <Feather*/}
        {/*          name="chevron-right"*/}
        {/*          size={18}*/}
        {/*          color={theme.colors.muted}*/}
        {/*        />*/}
        {/*      </Pressable>*/}
        {/*    ))}*/}
        {/*  </View>*/}
        {/*</View>*/}

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <AppText
            weight="bold"
            style={[styles.cardTitle, { color: theme.colors.text }]}
          >
            앱 정보
          </AppText>
          <View
            style={[
              styles.infoRow,
              styles.infoRowFirst,
              { borderColor: theme.colors.border },
            ]}
          >
            <AppText style={{ color: theme.colors.muted }}>버전</AppText>
            <AppText weight="semibold" style={{ color: theme.colors.text }}>
              {versionLabel}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaViewScreen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },

  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginTop: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  },

  cardHeader: {
    marginBottom: 8,
    gap: 4,
  },

  cardTitle: {
    fontSize: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  touchableRow: {
    borderTopWidth: 0,
    paddingBottom: 14,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  rowCaption: {
    fontSize: 13,
    marginTop: 2,
  },

  modeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },

  quickList: {
    marginTop: 10,
  },

  quickRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  quickRowFirst: {
    borderTopWidth: 0,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "transparent",
  },

  infoRowFirst: {
    borderTopWidth: 0,
  },
});
