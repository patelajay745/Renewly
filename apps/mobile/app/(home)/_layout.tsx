import {Tabs} from "expo-router";
import {NativeTabs, Icon, Label} from "expo-router/unstable-native-tabs";
import {Home, PlusCircle, Settings} from "lucide-react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="create-subscription"
        options={{
          title: "Create",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
