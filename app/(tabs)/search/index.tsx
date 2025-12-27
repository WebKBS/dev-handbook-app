import SafeAreaViewScreen from "@/components/screen/SafeAreaViewScreen";
import { AppText } from "@/components/text/AppText";
import { Stack } from "expo-router";
import { View } from "react-native";

const SearchScreen = () => {
  return (
    <SafeAreaViewScreen>
      <Stack.Screen
        options={{
          title: "검색",
          headerTitleStyle: {
            fontFamily: "Pretendard-Bold",
          },
        }}
      />
      <View>
        <AppText>SearchScreen</AppText>
      </View>
    </SafeAreaViewScreen>
  );
};

export default SearchScreen;
