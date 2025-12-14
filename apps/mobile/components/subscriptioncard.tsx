import {useAppTheme} from "@/providers/ThemeProvider";
import {RecentSubscription} from "@/types/dashboard";
import {useRouter} from "expo-router";
import {FC} from "react";
import {View, StyleSheet, TouchableOpacity} from "react-native";
import {Text} from "./text";
import {Calendar} from "lucide-react-native";
import {capitalizeString} from "@/lib/common";

interface Props extends RecentSubscription {}

const SubscriptionCard: FC<Props> = ({
  id,
  title,
  amount,
  type,
  notification,
  category,
  startDate,
}) => {
  const {colors} = useAppTheme();
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: colors.card}]}
      onPress={() => router.push(`/edit-subscription/${id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.title]}>{title}</Text>
        <Text style={[styles.amount]}>${amount.toFixed(2)}</Text>
      </View>
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Calendar color={colors.textMuted} size={16} />
          <Text style={styles.detailText} muted>
            {type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
});

export default SubscriptionCard;
