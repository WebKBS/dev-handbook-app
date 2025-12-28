import { AppText } from "@/components/text/AppText";
import { DomainType } from "@/constants/domain";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DomainSlugScreen = () => {
  const { slug, domain } = useLocalSearchParams<{
    slug: string;
    domain: DomainType;
  }>();

  console.log("slug:", slug, domain);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior={"automatic"}>
        <AppText>Detail</AppText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DomainSlugScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
