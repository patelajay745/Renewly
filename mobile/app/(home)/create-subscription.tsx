import Header from "@/components/header";
import {FC, useEffect, useState, useRef} from "react";
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import {Text} from "@/components/text";
import {TextInput} from "@/components/text-input";
import {useAppTheme} from "@/providers/ThemeProvider";
import CustomPicker, {PickerOption} from "@/components/custom-picker";
import {Controller, useForm} from "react-hook-form";
import {subscriptionSchema} from "@/schemas/create-subscription";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import DatePicker from "@/components/date-picker";
import {useCreateSubscription} from "@/hooks/api/use-subscription";
import {Check} from "lucide-react-native";
import Loader from "@/components/loader";
import {useRouter} from "expo-router";
import {getExpoNotificationToken} from "@/lib/expo-notification-token";
import * as Notifications from "expo-notifications";

interface Props {}

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export const typeOptions: PickerOption[] = [
  {label: "Daily", value: "daily"},
  {label: "Weekly", value: "weekly"},
  {label: "Monthly", value: "monthly"},
  {label: "Yearly", value: "yearly"},
];

export const categoryOptions: PickerOption[] = [
  {label: "Entertainment", value: "entertainment"},
  {label: "Utilities", value: "utilities"},
  {label: "Software", value: "software"},
  {label: "Health & Fitness", value: "health_fitness"},
  {label: "Education", value: "education"},
  {label: "Food & Drink", value: "food_drink"},
  {label: "Transportation", value: "transportation"},
  {label: "Other", value: "other"},
];

const CreateSubscription: FC<Props> = (props) => {
  const [notificationError, setNotificationError] = useState<string>("");
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [displayValue, setDisplayValue] = useState("");
  const [notificationGranted, setNotificationGranted] =
    useState<boolean>(false);
  const {colors} = useAppTheme();
  const router = useRouter();

  const {mutate, isPending} = useCreateSubscription();

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

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const {status} = await Notifications.getPermissionsAsync();
      setNotificationGranted(status === "granted");
    };

    checkNotificationPermission();
  }, []);

  let token: string;

  const onSubmit = (data: SubscriptionFormData) => {
    const dataTobeSubmitted = {
      ...data,
      expoToken: data.notification && expoPushToken ? expoPushToken : "",
    };

    mutate(dataTobeSubmitted, {
      onSuccess: () => {
        setIsSuccessful(true);

        reset();

        setTimeout(() => {
          setIsSuccessful(false);
          setDisplayValue("");
          router.push("/");
        }, 2000);
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          "Failed to create subscription. Please try again.",
          [{text: "OK"}]
        );
        console.error("Subscription creation error:", error);
      },
    });
  };
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Header showHeaderContent={false} />

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
                render={({field: {onChange, onBlur, value}}) => {
                  return (
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
                      onBlur={() => {
                        onBlur();
                        const numValue =
                          displayValue === ""
                            ? 0
                            : parseFloat(displayValue) || 0;
                        onChange(numValue);
                      }}
                      onChangeText={(text) => {
                        if (text === "" || /^\d*\.?\d*$/.test(text)) {
                          setDisplayValue(text);

                          const numValue =
                            text === "" ? 0 : parseFloat(text) || 0;
                          onChange(numValue);
                        }
                      }}
                      value={displayValue}
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
                {!notificationGranted && (
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
                      if (newValue && !notificationGranted) {
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
                                  setNotificationGranted(true);
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
                    Creating subscription
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
                    Subscription created
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
                  Create Subscription
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={() => (
          <Text
            style={[styles.screenTitle, {color: colors.text}]}
            variant="title"
          >
            Create Subscription
          </Text>
        )}
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
export default CreateSubscription;
