import {Tabs} from "expo-router";
import {NativeTabs, Icon, Label} from "expo-router/unstable-native-tabs";
import {
  Home,
  HomeIcon,
  LucideIcon,
  PlusCircle,
  PlusSquare,
  Settings,
  Settings2,
} from "lucide-react-native";
import {ComponentProps, Ref} from "react";
import {TabTriggerSlotProps} from "expo-router/ui";
import {Pressable, Text, View} from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({focused}) => <TabItem icon={HomeIcon}>Home</TabItem>,
        }}
      />
      <Tabs.Screen
        name="create-subscription"
        options={{
          title: "Create",
          tabBarIcon: ({focused}) => (
            <TabItem icon={PlusSquare}>Create</TabItem>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({focused}) => (
            <TabItem icon={Settings}>Settings</TabItem>
          ),
        }}
      />
    </Tabs>
  );
}

export type TabItemProps = TabTriggerSlotProps & {
  icon: LucideIcon;
  ref?: Ref<View>;
};

const TabItem = ({icon: Icon, children, isFocused, ...props}: TabItemProps) => {
  return (
    <Pressable
      {...props}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon size={16} />
      <Text>{children}</Text>
    </Pressable>
  );
};
