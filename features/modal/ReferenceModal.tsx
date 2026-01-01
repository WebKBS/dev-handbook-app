import { AppText } from "@/components/text/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { Reference } from "@/services/content/post";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ReferenceModalProps {
  selectedReference: Reference | null;
  handleCloseModal: () => void;
  handleOpenUrl: () => void;
}

const ReferenceModal = ({
  selectedReference,
  handleCloseModal,
  handleOpenUrl,
}: ReferenceModalProps) => {
  const { theme } = useTheme();
  return (
    <Modal
      visible={!!selectedReference}
      animationType="slide"
      transparent
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <View
            style={[
              styles.sheetHandle,
              { backgroundColor: theme.colors.border },
            ]}
          />
          <View style={styles.sheetHeader}>
            <AppText weight="extrabold" style={styles.sheetTitle}>
              참고 링크
            </AppText>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Ionicons name="close" size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>
          <AppText weight="bold" style={styles.sheetHeading}>
            {selectedReference?.title}
          </AppText>
          {selectedReference?.note ? (
            <AppText style={[styles.sheetNote, { color: theme.colors.muted }]}>
              {selectedReference.note}
            </AppText>
          ) : null}
          <View style={styles.sheetUrlRow}>
            <Ionicons
              name="link-outline"
              size={16}
              color={theme.colors.accent}
            />
            <AppText
              weight="medium"
              numberOfLines={2}
              style={[styles.sheetUrl, { color: theme.colors.accent }]}
            >
              {selectedReference?.url}
            </AppText>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleOpenUrl}
            style={[
              styles.openLinkButton,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <AppText weight="bold" style={styles.openLinkButtonText}>
              링크 열기
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReferenceModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  bottomSheet: {
    marginTop: "auto",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
  },
  closeButton: {
    padding: 6,
  },
  sheetHeading: {
    fontSize: 18,
    marginBottom: 6,
  },
  sheetNote: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  sheetUrlRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sheetUrl: {
    fontSize: 14,
    marginLeft: 4,
    flexShrink: 1,
  },
  openLinkButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 6,
  },
  openLinkButtonText: {
    color: "#ffffff",
    fontSize: 15,
  },
});
