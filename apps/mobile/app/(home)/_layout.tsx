import {Redirect, Tabs} from "expo-router";
import {HomeIcon, Plus, History, Settings} from "lucide-react-native";
import {Pressable, View, StyleSheet, Platform} from "react-native";
import {useAppTheme} from "@/providers/ThemeProvider";
import {useUser} from "@clerk/clerk-expo";
import {Text} from "@/components/text";
import {identifyDevice} from "vexo-analytics";

export default function Layout() {
  const {isSignedIn, user} = useUser();

  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  if (user) {
    identifyDevice(user.emailAddresses[0].emailAddress);
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 100,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          marginBottom: 200,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
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
    </Tabs>
  );
}

const CustomTabBar = ({state, navigation}: any) => {
  const {colors} = useAppTheme();

  const mainTabs = [
    {route: "index", icon: HomeIcon, label: "Home"},
    {route: "create-subscription", icon: Plus, label: "Add"},
    {route: "all-subscription", icon: History, label: "Subscriptions"},
  ];

  const sideTabs = [{route: "settings", icon: Settings, label: "Settings"}];

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.mainTabsWrapper}>
        <View
          style={[styles.mainTabsContainer, {backgroundColor: colors.primary}]}
        >
          {mainTabs.map((tab, index) => {
            const routeIndex = state.routes.findIndex(
              (r: {name: string}) => r.name === tab.route
            );
            const isFocused = state.index === routeIndex;
            const Icon = tab.icon;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: state.routes[routeIndex].key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(state.routes[routeIndex].name);
              }
            };

            return (
              <Pressable
                key={tab.route}
                onPress={onPress}
                style={styles.mainTab}
              >
                <Icon size={24} color={colors.foregroundText} strokeWidth={2} />
                <Text
                  style={[styles.mainTabLabel, {color: colors.foregroundText}]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sideTabsContainer}>
        {sideTabs.map((tab) => {
          const routeIndex = state.routes.findIndex(
            (r: {name: string}) => r.name === tab.route
          );
          const isFocused = state.index === routeIndex;
          const Icon = tab.icon;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[routeIndex].key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(state.routes[routeIndex].name);
            }
          };

          const bgColor = colors.surface;
          const iconColor = colors.text;

          return (
            <Pressable
              key={tab.route}
              onPress={onPress}
              style={[styles.sideTab, {backgroundColor: bgColor}]}
            >
              <Icon size={24} color={iconColor} strokeWidth={2} />
              <Text style={[styles.sideTabLabel, {color: iconColor}]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 0 : 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
    height: Platform.OS === "ios" ? 95 : 75,
  },
  mainTabsWrapper: {
    flex: 1,
    marginRight: 15,
  },
  mainTabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  mainTabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
  sideTabsContainer: {
    flexDirection: "column",
    gap: 10,
  },
  sideTab: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  sideTabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "600",
  },
});
