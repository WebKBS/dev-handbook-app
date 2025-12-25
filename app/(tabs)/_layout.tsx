import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        color: DynamicColorIOS({
          light: "#ff0000",
          dark: "#FFFFFF",
        }),
      }}
      tintColor={DynamicColorIOS({
        light: "#ff0000",
        dark: "#FFFFFF",
      })}
    >
      <NativeTabs.Trigger name="index">
        <Label>학습</Label>
        <Icon sf="book" drawable="custom_settings_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bookmark/index">
        <Label>북마크</Label>
        <Icon sf="bookmark" drawable="custom_settings_drawable" />
      </NativeTabs.Trigger>
      {/*<NativeTabs.Trigger name="settings">*/}
      {/*  <Icon sf="gear" drawable="custom_settings_drawable" />*/}
      {/*  <Label>Settings</Label>*/}
      {/*</NativeTabs.Trigger>*/}
    </NativeTabs>
  );
}
