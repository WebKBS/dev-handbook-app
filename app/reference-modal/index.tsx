import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";

const ReferenceModal = () => {
  const { url } = useLocalSearchParams();
  return <WebView style={styles.container} source={{ uri: url as string }} />;
};

export default ReferenceModal;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
