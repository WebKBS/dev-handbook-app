import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Reference } from "@/services/content/post";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ReferencesCardProps {
  referencesList: Reference[];
}

const ReferencesCard = ({ referencesList }: ReferencesCardProps) => {
  const { theme } = useTheme();
  const hasReferences = referencesList.length > 0;
  const router = useRouter();

  const handleReferencePress = (url: string) => {
    router.push(`/reference-modal?url=${url}`);
  };

  if (!hasReferences) {
    return null;
  }

  return (
    <>
      <View style={styles.referenceSection}>
        <View style={styles.referenceHeader}>
          <AppText weight="extrabold" style={styles.referenceTitle}>
            참고 자료
          </AppText>
          <AppText
            weight="medium"
            style={[styles.referenceCount, { color: theme.colors.muted }]}
          >
            {referencesList.length}개 링크
          </AppText>
        </View>

        {referencesList.map((reference, index) => (
          <TouchableOpacity
            key={`${reference.url}-${index}`}
            activeOpacity={0.9}
            onPress={() => handleReferencePress(reference.url)}
            style={[
              styles.referenceCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadow,
              },
            ]}
          >
            <View style={styles.referenceCardTop}>
              <AppText weight="bold" style={styles.referenceCardTitle}>
                {reference.title}
              </AppText>
              <Ionicons
                name="chevron-up"
                size={18}
                color={theme.colors.accentStrong}
                style={styles.referenceIcon}
              />
            </View>
            {reference.note ? (
              <AppText
                style={[styles.referenceNote, { color: theme.colors.muted }]}
                numberOfLines={2}
              >
                {reference.note}
              </AppText>
            ) : null}
            <AppText
              weight="medium"
              numberOfLines={1}
              style={[
                styles.referenceUrl,
                {
                  color: theme.colors.accent,
                },
              ]}
            >
              {reference.url}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default ReferencesCard;

const styles = StyleSheet.create({
  referenceSection: {
    marginTop: 28,
  },
  referenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  referenceTitle: {
    fontSize: 18,
  },
  referenceCount: {
    fontSize: 13,
  },
  referenceCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  referenceCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingRight: 24,
    position: "relative",
  },
  referenceCardTitle: {
    fontSize: 16,
  },
  referenceIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  referenceNote: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  referenceUrl: {
    fontSize: 13,
  },
});
