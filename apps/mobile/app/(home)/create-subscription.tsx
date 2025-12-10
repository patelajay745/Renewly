import Header from "@/components/header";
import {FC, useEffect, useState} from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TextInput,
  useColorScheme,
  FlatList,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {semanticColors} from "@/constants/theme";
import CustomPicker, {PickerOption} from "@/components/custom-picker";
import {Controller, useForm} from "react-hook-form";
import {subscriptionSchema} from "@/schemas/create-subscription";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import DatePicker from "@/components/date-picker";

interface Props {}

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

const CreateSubscription: FC<Props> = (props) => {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? "light"];

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: {errors},
  } = useForm<SubscriptionFormData>({
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

  const [selectedType, setSelectedType] = useState();

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

      <FlatList
        data={[1]}
        renderItem={() => (
          <View style={styles.inputView}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Title</Text>

              <Controller
                control={control}
                name="title"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    placeholder="NetFlix, Spotify, etc."
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
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Amount</Text>
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
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value.toString()}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Type</Text>

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
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Category</Text>

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
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Start Date</Text>

              <Controller
                control={control}
                name="startDate"
                render={({field: {onChange, onBlur, value}}) => (
                  <DatePicker
                    placeholder="Choose a date"
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      onChange(date ? date.toISOString().split("T")[0] : "");
                    }}
                  />
                )}
              />
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <Text style={styles.screenTitle}> Create Subscription</Text>
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
    fontSize: 30,
    fontWeight: "700",
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
    padding: 16,
    fontSize: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  inputContainer: {
    gap: 5,
  },
});
export default CreateSubscription;
