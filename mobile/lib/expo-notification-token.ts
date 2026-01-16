import { Platform } from "react-native";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export const getExpoNotificationToken = async () => {

    let notificationGranted = false;
    let token = ""
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.log("Failed to get push token for push notification!");
            notificationGranted = false
            return;
        }

        notificationGranted = true
        try {
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId: process.env.EXPO_PUBLIC_PROJECTID,
                })
            ).data;
            console.log("📱 Expo Push Token:", token);

        } catch (error) {
            console.error("Error getting push token:", error);
        }
    } else {
        console.log("Must use physical device for Push Notifications");
        notificationGranted = false
    }

    return { token, notificationGranted };
}