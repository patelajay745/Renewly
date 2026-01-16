import {useAppTheme} from "@/providers/ThemeProvider";
import {RecentSubscription} from "@/types/dashboard";
import {useRouter} from "expo-router";
import {FC, useRef} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import {Text} from "./text";
import {Bell, Calendar, Grid3X3, Trash2} from "lucide-react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {useDeleteSubscription} from "@/hooks/api/use-subscription";
import {useCurrency} from "@/providers/CurrencyProvider";
import {formatPrice} from "@/lib/currency-utils";
interface Props extends RecentSubscription {}

const SubscriptionCard: FC<Props> = (props) => {
  const {colors} = useAppTheme();
  const router = useRouter();
  const {mutate: deleteSubscription, isPending} = useDeleteSubscription();
  const swipeableRef = useRef<any>(null);
  const pressed = useSharedValue(false);
  const {selectedCurrency} = useCurrency();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(pressed.value ? 0.98 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  const handleDelete = (subscriptionId: string, title: string) => {
    Alert.alert(
      "Delete Subscription",
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            swipeableRef.current?.close();
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteSubscription(subscriptionId, {
              onSuccess: () => {
                swipeableRef.current?.close();
              },
              onError: (error) => {
                Alert.alert(
                  "Error",
                  "Failed to delete subscription. Please try again."
                );
                console.error("Delete error:", error);
                swipeableRef.current?.close();
              },
            });
          },
        },
      ]
    );
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        ref={swipeableRef}
        friction={3}
        enableTrackpadTwoFingerGesture
        rightThreshold={1}
        renderRightActions={(prog, drag) =>
          RightAction(prog, drag, props, handleDelete, isPending)
        }
      >
        <Reanimated.View style={animatedStyle}>
          <TouchableOpacity
            style={[styles.card, {backgroundColor: colors.card}]}
            onPress={() =>
              router.push({
                pathname: `/edit-subscription/[id]`,
                params: {
                  id: props.id,
                  subscriptionData: JSON.stringify(props),
                },
              })
            }
            onPressIn={() => (pressed.value = true)}
            onPressOut={() => (pressed.value = false)}
            activeOpacity={1}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.title]}>{props.title}</Text>
              <Text style={[styles.amount]}>
                {formatPrice(props.amount, selectedCurrency)}
              </Text>
            </View>
            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Calendar color={colors.textMuted} size={16} />
                <Text style={styles.detailText} muted>
                  {props.type}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Grid3X3 color={colors.textMuted} size={16} />
                <Text style={styles.detailText} muted>
                  {props.category.replaceAll("_", " ")}
                </Text>
              </View>

              {props.notification && <Bell color={colors.success} size={14} />}
            </View>
          </TouchableOpacity>
        </Reanimated.View>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

function RightAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  subscription: RecentSubscription,
  handleDelete: (id: string, title: string) => void,
  isPending: boolean
) {
  const {colors} = useAppTheme();
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: drag.value + Platform.OS === "android" ? 80 : 10},
      ],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <TouchableOpacity
        style={[styles.deleteButton, {backgroundColor: colors.card}]}
        onPress={() => handleDelete(subscription.id, subscription.title)}
        activeOpacity={0.7}
        disabled={isPending}
      >
        <Trash2 color={colors.text} size={22} strokeWidth={2.5} />
        <Text style={styles.deleteText}>
          {isPending ? "Deleting..." : "Delete"}
        </Text>
      </TouchableOpacity>
    </Reanimated.View>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    flex: 1,
    textTransform: "capitalize",
  },
  amount: {
    fontSize: 17,
  },
  detailRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
    height: "100%",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  deleteText: {
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 0.3,
  },
});

export default SubscriptionCard;
