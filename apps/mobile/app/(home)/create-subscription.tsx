import Header from "@/components/header";
import {FC, useEffect, useState} from "react";
import {View, StyleSheet, Text, Platform} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

interface Props {}

const CreateSubscription: FC<Props> = (props) => {
  const [expoPushToken, setExpoPushToken] = useState<string>("");

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const {status: existingStatus} =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      try {
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: "7e666261-6612-4122-9157-e4cbaab8492a",
          })
        ).data;
        console.log("📱 Expo Push Token:", token);
        setExpoPushToken(token);
      } catch (error) {
        console.error("Error getting push token:", error);
      }
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    return token;
  }
  return (
    <View style={styles.container}>
      <Header showHeaderContent={false} />
      <View style={styles.contentContainer}>
        <Text> create subscription page</Text>
        {expoPushToken && (
          <Text style={styles.tokenText}>Token: {expoPushToken}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  tokenText: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
  },
});

export default CreateSubscription;
