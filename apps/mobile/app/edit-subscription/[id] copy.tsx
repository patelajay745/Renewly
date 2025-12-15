import Header from "@/components/header";
import {FC, useEffect, useState} from "react";
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import {Text} from "@/components/text";
import {TextInput} from "@/components/text-input";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {useAppTheme} from "@/providers/ThemeProvider";
import CustomPicker, {PickerOption} from "@/components/custom-picker";
import {Controller, useForm} from "react-hook-form";
import {subscriptionSchema} from "@/schemas/create-subscription";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import DatePicker from "@/components/date-picker";
import {
  useGetSubscription,
  useUpdateSubscription,
} from "@/hooks/api/use-subscription";
import {Check} from "lucide-react-native";
import Loader from "@/components/loader";
import {useRouter, useLocalSearchParams} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

interface Props {}

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

const EditSubscription: FC<Props> = (props) => {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notificationPermissionGranted, setNotificationPermissionGranted] =
    useState<boolean>(false);
  const [notificationError, setNotificationError] = useState<string>("");
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const {colors} = useAppTheme();
  const router = useRouter();
  const {id} = useLocalSearchParams<{id: string}>();

  const {data: subscription, isLoading: isLoadingSubscription} =
    useGetSubscription(id!);
  const {mutate, isPending, isSuccess} = useUpdateSubscription();

  const {
    handleSubmit,
    control,
    formState: {errors, isDirty, isValid},
    reset,
  } = useForm<SubscriptionFormData>({
    mode: "onChange",
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      type: undefined,
      notification: false,
      category: "",
      startDate: new Date(),
    },
  });

  // Pre-fill form when subscription data is loaded
  useEffect(() => {
    if (subscription) {
      reset({
        title: subscription.title,
        amount: subscription.amount,
        type: subscription.type,
        notification: subscription.notification,
        category: subscription.category,
        startDate: new Date(subscription.startDate),
      });
    }
  }, [subscription, reset]);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const typeOptions: PickerOption[] = [
    {label: "Daily", value: "daily"},
    {label: "Weekly", value: "weekly"},
    {label: "Monthly", value: "monthly"},
    {label: "Yearly", value: "yearly"},
  ];

  const categoryOptions: PickerOption[] = [
    {label: "Entertainment", value: "entertainment"},
    {label: "Utilities", value: "utilities"},
    {label: "Software", value: "software"},
    {label: "Health & Fitness", value: "health_fitness"},
    {label: "Education", value: "education"},
    {label: "Food & Drink", value: "food_drink"},
    {label: "Transportation", value: "transportation"},
    {label: "Other", value: "other"},
  ];

  let token: string;

  async function registerForPushNotificationsAsync() {
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
        setNotificationPermissionGranted(false);
        return;
      }

      setNotificationPermissionGranted(true);
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
      setNotificationPermissionGranted(false);
    }

    return token;
  }

  const onSubmit = (data: SubscriptionFormData) => {
    if (!id) return;

    const dataTobeSubmitted = {
      ...data,
      expoToken: expoPushToken || subscription?.expoToken || "",
    };

    mutate(
      {id, data: dataTobeSubmitted},
      {
        onSuccess: () => {
          setIsSuccessful(true);
          Alert.alert("Success", "Subscription updated successfully", [
            {
              text: "OK",
              onPress: () => {
                router.back();
              },
            },
          ]);
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            "Failed to update subscription. Please try again.",
            [{text: "OK"}]
          );
          console.error("Subscription update error:", error);
        },
      }
    );
  };

  if (isLoadingSubscription) {
    return (
      <View
        style={[styles.loadingContainer, {backgroundColor: colors.background}]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, {color: colors.textMuted}]}>
          Loading subscription...
        </Text>
      </View>
    );
  }

  if (!subscription) {
    return (
      <View
        style={[styles.loadingContainer, {backgroundColor: colors.background}]}
      >
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[styles.loadingText, {color: colors.error}]}>
          Subscription not found
        </Text>
        <TouchableOpacity
          style={[styles.backButton, {backgroundColor: colors.primary}]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, {color: colors.foregroundText}]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={[1]}
        renderItem={() => (
          <View style={styles.inputView}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputText, {color: colors.text}]}>
                Title
              </Text>

              <Controller
                control={control}
                name="title"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    placeholder="NetFlix, Spotify, etc."
                    placeholderTextColor={`${colors.inputPlaceholder}`}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.inputBorder,
                      },
                      {color: colors.text},
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.title && (
                <Text style={{color: "red", fontSize: 12}}>
                  {errors.title.message}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputText, {color: colors.text}]}>
                Amount
              </Text>
              <Controller
                control={control}
                name="amount"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    placeholder="0.0"
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.inputBorder,
                      },
                      {color: colors.text},
                    ]}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(+text);
                    }}
                    value={value.toString()}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.amount && (
                <Text style={{color: "red", fontSize: 12}}>
                  {errors.amount.message}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputText, {color: colors.text}]}>Type</Text>

              <Controller
                control={control}
                name="type"
                render={({field: {onChange, onBlur, value}}) => (
                  <CustomPicker
                    options={typeOptions}
                    selectedValue={value}
                    onValueChange={onChange}
                    placeholder="Select recurring type"
                  />
                )}
              />
              {errors.type && (
                <Text style={{color: "red", fontSize: 12}}>
                  {errors.type.message}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputText, {color: colors.text}]}>
                Category
              </Text>

              <Controller
                control={control}
                name="category"
                render={({field: {onChange, onBlur, value}}) => (
                  <CustomPicker
                    options={categoryOptions}
                    selectedValue={value}
                    onValueChange={onChange}
                    placeholder="Select Category"
                  />
                )}
              />
              {errors.category && (
                <Text style={{color: "red", fontSize: 12}}>
                  {errors.category.message}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputText, {color: colors.text}]}>
                Start Date
              </Text>

              <Controller
                control={control}
                name="startDate"
                render={({field: {onChange, onBlur, value}}) => (
                  <DatePicker
                    placeholder="Choose a date"
                    value={value}
                    onChange={(date) => {
                      onChange(date || new Date());
                    }}
                  />
                )}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <View style={{flex: 1}}>
                <Text style={[styles.inputText, {color: colors.text}]}>
                  Notification
                </Text>
                {!notificationPermissionGranted && (
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    Permission not granted
                  </Text>
                )}
              </View>

              <Controller
                control={control}
                name="notification"
                render={({field: {onChange, onBlur, value}}) => (
                  <Switch
                    value={value}
                    onValueChange={(newValue) => {
                      if (newValue && !notificationPermissionGranted) {
                        setNotificationError(
                          "Notification permission is required"
                        );
                        Alert.alert(
                          "Permission Required",
                          "Please enable notification permissions in your device settings to use this feature.",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Open Settings",
                              onPress: () => {
                                if (Platform.OS === "ios") {
                                  Linking.openURL("app-settings:");
                                } else {
                                  Linking.openSettings();
                                }
                              },
                            },
                          ]
                        );
                        return;
                      }
                      setNotificationError("");
                      onChange(newValue);
                    }}
                    trackColor={{
                      false: colors.disabled,
                      true: colors.success,
                    }}
                    thumbColor={colors.surface}
                  />
                )}
              />
            </View>
            {notificationError && (
              <Text style={{color: "red", fontSize: 12, marginTop: -15}}>
                {notificationError}
              </Text>
            )}
          </View>
        )}
        ListFooterComponent={() => {
          return (
            <TouchableOpacity
              style={[
                styles.submitButton,
                {backgroundColor: colors.primary},
                {opacity: !isValid ? 0.5 : 1},
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isPending || isSuccessful}
            >
              {isPending ? (
                <>
                  <Text
                    style={[
                      styles.submitButtonText,
                      {color: colors.foregroundText},
                    ]}
                  >
                    Updating subscription
                  </Text>
                  <Loader />
                </>
              ) : isSuccessful ? (
                <>
                  <Text
                    style={[
                      styles.submitButtonText,
                      {color: colors.foregroundText},
                    ]}
                  >
                    Subscription updated
                  </Text>
                  <Check size={24} color={colors.foregroundText} />
                </>
              ) : (
                <Text
                  style={[
                    styles.submitButtonText,
                    {color: colors.foregroundText},
                  ]}
                >
                  Update Subscription
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{paddingHorizontal: 10, marginTop: 20}}
        ListHeaderComponentStyle={{marginBottom: 20}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    gap: 26,
  },
  tokenText: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  inputView: {
    paddingHorizontal: 10,
    gap: 20,
  },
  inputText: {
    fontSize: 16,
    fontWeight: "500",
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputContainer: {
    gap: 5,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
  },
  submitButtonText: {fontSize: 18, fontWeight: "600"},
});
export default EditSubscription;
