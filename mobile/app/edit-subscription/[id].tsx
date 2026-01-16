import CustomPicker, {PickerOption} from "@/components/custom-picker";
import {Text} from "@/components/text";
import {TextInput} from "@/components/text-input";
import {useUpdateSubscription} from "@/hooks/api/use-subscription";
import {getExpoNotificationToken} from "@/lib/expo-notification-token";
import {useAppTheme} from "@/providers/ThemeProvider";
import {subscriptionSchema} from "@/schemas/create-subscription";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLocalSearchParams, useRouter} from "expo-router";
import {AlertCircle, Check} from "lucide-react-native";
import {FC, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  Platform,
  Linking,
} from "react-native";
import z from "zod";
import {categoryOptions, typeOptions} from "../(home)/create-subscription";
import DatePicker from "@/components/date-picker";
import Loader from "@/components/loader";
import * as Notifications from "expo-notifications";

interface Props {}

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

const EditSubscription: FC<Props> = (props) => {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notificationPermissionGranted, setnotificationPermissionGranted] =
    useState<boolean>(false);
  const [notificationError, setNotificationError] = useState<string>("");
  const [amountDisplayValue, setAmountDisplayValue] = useState<string>("");
  const {colors} = useAppTheme();
  const router = useRouter();
  const {id, subscriptionData} = useLocalSearchParams<{
    id: string;
    subscriptionData?: string;
  }>();

  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const subscription = subscriptionData ? JSON.parse(subscriptionData) : null;
  const {mutate, isPending, isSuccess} = useUpdateSubscription();

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const {status} = await Notifications.getPermissionsAsync();
      setnotificationPermissionGranted(status === "granted");

      if (status === "granted") {
        const result = await getExpoNotificationToken();
        if (result) {
          setExpoPushToken(result.token);
        }
      }
    };

    checkNotificationPermission();
  }, []);

  const {
    handleSubmit,
    control,
    formState: {errors, isValid},
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

  const onSubmit = (data: SubscriptionFormData) => {
    if (!id) return;

    const dataTobeSubmitted = {
      ...data,
      expoToken:
        data.notification && expoPushToken
          ? expoPushToken
          : subscription?.expoToken || "",
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

      setAmountDisplayValue(
        subscription.amount === 0 ? "" : subscription.amount.toString()
      );
    }
  }, [subscription]);

  if (!subscription) {
    return (
      <View
        style={[styles.loadingContainer, {backgroundColor: colors.background}]}
      >
        <AlertCircle size={48} color={colors.error} />
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
        ListHeaderComponentStyle={{marginBottom: 20}}
        contentContainerStyle={{paddingHorizontal: 10, marginTop: 20}}
        renderItem={() => (
          <View style={styles.inputView}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}> Title</Text>
              <Controller
                control={control}
                name="title"
                render={({field: {onBlur, onChange, value}}) => (
                  <TextInput
                    placeholder="NetFlix, Spotify, etc."
                    placeholderTextColor={colors.inputPlaceholder}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.inputBorder,
                      },
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
              <Text style={styles.inputText}> Amount</Text>
              <Controller
                control={control}
                name="amount"
                render={({field: {onBlur, onChange, value}}) => {
                  return (
                    <TextInput
                      placeholder="0.0"
                      placeholderTextColor={colors.inputPlaceholder}
                      style={[
                        styles.textInput,
                        {
                          backgroundColor: colors.inputBackground,
                          borderColor: colors.inputBorder,
                        },
                      ]}
                      onBlur={() => {
                        onBlur();
                        const numValue =
                          amountDisplayValue === ""
                            ? 0
                            : parseFloat(amountDisplayValue) || 0;
                        onChange(numValue);
                      }}
                      onChangeText={(text) => {
                        if (text === "" || /^\d*\.?\d*$/.test(text)) {
                          setAmountDisplayValue(text);

                          const numValue =
                            text === "" ? 0 : parseFloat(text) || 0;
                          onChange(numValue);
                        }
                      }}
                      value={amountDisplayValue}
                      keyboardType="decimal-pad"
                    />
                  );
                }}
              />

              {errors.amount && (
                <Text style={{color: "red", fontSize: 12}}>
                  {errors.amount.message}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputText}> Type</Text>
              <Controller
                control={control}
                name="type"
                render={({field: {onBlur, onChange, value}}) => (
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
              <Text style={styles.inputText}> Category</Text>
              <Controller
                control={control}
                name="category"
                render={({field: {onBlur, onChange, value}}) => {
                  return (
                    <CustomPicker
                      options={categoryOptions}
                      selectedValue={value}
                      onValueChange={onChange}
                      placeholder="Select Category"
                    />
                  );
                }}
              />

              {errors.category && (
                <Text style={{color: "red", fontSize: 12}}>
                  {errors.category.message}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputText}> Start Date</Text>
              <Controller
                control={control}
                name="startDate"
                render={({field: {onBlur, onChange, value}}) => (
                  <DatePicker
                    placeholder="Choose a date"
                    value={value}
                    onChange={(date) => {
                      onChange(date || new Date());
                    }}
                  />
                )}
              />

              {errors.title && (
                <Text style={{color: "red", fontSize: 12}}>
                  {errors.title.message}
                </Text>
              )}
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
                    onValueChange={async (newValue) => {
                      if (newValue && !notificationPermissionGranted) {
                        
                        Alert.alert(
                          "Enable Notifications",
                          "Renewly would like to send you notifications to remind you about upcoming subscription renewals. This is optional and you can change this anytime.",
                          [
                            {
                              text: "Not Now",
                              style: "cancel",
                              onPress: () => {
                                onChange(false);
                              },
                            },
                            {
                              text: "Allow",
                              onPress: async () => {
                                const result = await getExpoNotificationToken();
                                if (result && result.notificationGranted) {
                                  setExpoPushToken(result.token);
                                  setnotificationPermissionGranted(true);
                                  setNotificationError("");
                                  onChange(true);
                                } else {
                                  
                                  Alert.alert(
                                    "Permission Denied",
                                    "You can enable notifications later in your device settings.",
                                    [{text: "OK"}]
                                  );
                                  onChange(false);
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
  },
  inputView: {
    paddingHorizontal: 10,
    gap: 20,
  },
  inputContainer: {
    gap: 5,
  },
  inputText: {
    fontSize: 16,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
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
  submitButtonText: {fontSize: 18},
});

export default EditSubscription;
