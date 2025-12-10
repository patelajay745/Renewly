import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import {
  Home,
  HomeIcon,
  LucideIcon,
  PlusCircle,
  PlusSquare,
  Settings,
  Settings2,
} from "lucide-react-native";
import { ComponentProps, Ref } from "react";
import { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "@/providers/ThemeProvider";

export default function Layout() {
  const { colors } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.borderLight,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabItem icon={HomeIcon}>Home</TabItem>,
        }}
      />
      <Tabs.Screen
        name="create-subscription"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <TabItem icon={PlusSquare}>Create</TabItem>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
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

const TabItem = ({ icon: Icon, children, isFocused, ...props }: TabItemProps) => {
  const { colors } = useAppTheme();

  return (
    <Pressable
      {...props}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon size={18} color={isFocused ? colors.primary : colors.textMuted} />
      <Text style={{ color: isFocused ? colors.primary : colors.textMuted }}>
        {children}
      </Text>
    </Pressable>
  );
};
