import {RecentSubscription} from "@/types/dashboard";
import {FC} from "react";
import {View, StyleSheet, FlatList} from "react-native";
import {NextPayment} from "@/types/dashboard";
import {useAppTheme} from "@/providers/ThemeProvider";
import {Text} from "./text";
import PaymentItemCard from "./payment-item-card";
import Animated, {Easing, SlideInDown} from "react-native-reanimated";

interface Props {
  data: (RecentSubscription | NextPayment)[];
  title: string;
}

const SubscriptionList: FC<Props> = ({data, title}) => {
  const {colors} = useAppTheme();
  const delayTime = title.includes("Recent") ? 200 : 100;

  return (
    <Animated.View
      style={[styles.card, {backgroundColor: colors.card}]}
      entering={SlideInDown.duration(600)
        .delay(delayTime)
        .easing(Easing.out(Easing.cubic))}
    >
      <Text style={[styles.title]}>{title}</Text>

      {!data.length ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, {color: colors.textMuted}]}>
            No subscriptions found
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({item, index}) => (
            <PaymentItemCard {...item} index={index} />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={[styles.separator, {backgroundColor: colors.borderMuted}]}
            />
          )}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginTop: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  row: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainText: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
    flex: 1,
  },
  category: {
    fontSize: 13,
    fontWeight: "400",
    textTransform: "capitalize",
  },
  amount: {
    fontSize: 17,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    opacity: 0.3,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "400",
  },
});

export default SubscriptionList;
