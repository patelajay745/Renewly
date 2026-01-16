import {View, StyleSheet} from "react-native";
import {DashboardResponse} from "@/types/dashboard";
import {useAppTheme} from "@/providers/ThemeProvider";
import {Text} from "./text";
import Animated, {SlideInDown, Easing} from "react-native-reanimated";
import {useCurrency} from "@/providers/CurrencyProvider";
import {formatPrice} from "@/lib/currency-utils";

export default function StatsCard({data}: {data: DashboardResponse}) {
  const {colors} = useAppTheme();
  const {selectedCurrency} = useCurrency();

  return (
    <Animated.View
      style={[
        styles.card,
        {backgroundColor: colors.card, borderColor: colors.borderLight},
      ]}
      entering={SlideInDown.duration(600).easing(Easing.out(Easing.cubic))}
    >
      <Text style={[styles.title, {color: colors.text}]}>
        Total Subscriptions
      </Text>
      <Text style={[styles.value, {color: colors.primary}]}>
        {data.stats.totalSubscriptions}
      </Text>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={[styles.label, {color: colors.textMuted}]}>Monthly</Text>
          <Text style={[styles.amount, {color: colors.primary}]}>
            {formatPrice(data?.stats?.totalMonthlySpend, selectedCurrency)}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.label, {color: colors.textMuted}]}>
            Yearly Projection
          </Text>
          <Text style={[styles.amount, {color: colors.primary}]}>
            {formatPrice(data?.stats?.totalYearlyProjection, selectedCurrency)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 15,
    gap: 10,
  },
  title: {fontSize: 17, fontWeight: "600"},
  value: {fontSize: 34, fontWeight: "bold"},
  row: {flexDirection: "row", justifyContent: "space-between"},
  item: {flex: 1},
  label: {fontSize: 13, fontWeight: "500"},
  amount: {fontSize: 20, fontWeight: "600"},
});
