import {FC} from "react";
import {View, StyleSheet} from "react-native";
import {Text} from "./text";
import {useAppTheme} from "@/providers/ThemeProvider";
import {NextPayment, RecentSubscription} from "@/types/dashboard";
import {Calendar} from "lucide-react-native";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  Layout,
} from "react-native-reanimated";
import {useCurrency} from "@/providers/CurrencyProvider";
import {formatPrice} from "@/lib/currency-utils";

type Props = (NextPayment | RecentSubscription) & {
  index: number;
};

const PaymentItemCard: FC<Props> = (props) => {
  const {colors} = useAppTheme();
  const {title, amount, type, index} = props;
  const date = "nextPayment" in props ? props.nextPayment : props.startDate;
  const isRecent = "startDate" in props;
  const {selectedCurrency} = useCurrency();

  return (
    <View style={[styles.row]}>
      <View style={{flex: 1}}>
        <Text style={[styles.mainText]}>{title}</Text>

        <View style={styles.itemDetails}>
          <Text style={[styles.subText]} muted>
            {new Date(date).toDateString()}
          </Text>

          {isRecent && (
            <View style={styles.typeContainer}>
              <Calendar color={colors.textMuted} size={13} />
              <Text style={styles.typeText} muted>
                {type}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text style={[styles.amount, {color: colors.accent}]}>
        {formatPrice(amount, selectedCurrency)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,

    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainText: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  subText: {
    fontSize: 13,
    fontWeight: "400",
  },
  amount: {
    fontSize: 17,
    fontWeight: "600",
  },
  itemDetails: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  typeText: {
    textTransform: "capitalize",
    fontSize: 13,
  },
});

export default PaymentItemCard;
