import {View, StyleSheet, FlatList} from "react-native";
import {NextPayment} from "@/types/dashboard";
import {useAppTheme} from "@/providers/ThemeProvider";
import {Text} from "./text";

interface Props {
  data: NextPayment[];
}

export default function NextPayments({data}: Props) {
  const {colors} = useAppTheme();

  if (!data.length) return null;

  return (
    <View style={[styles.card, {backgroundColor: colors.card}]}>
      <Text style={[styles.title, {color: colors.text}]}>Next Payments</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({item}) => (
          <View style={[styles.row]}>
            <View>
              <Text style={[styles.mainText, {color: colors.text}]}>
                {item.title}
              </Text>

              <Text style={[styles.subText, {color: colors.textMuted}]}>
                {new Date(item.nextPayment).toDateString()}
              </Text>
            </View>

            <Text style={[styles.amount, {color: colors.accent}]}>
              ₹ {item.amount}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{borderBottomColor: colors.border, borderWidth: 0.5}}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginTop: 14,
  },
  title: {
    fontSize: 18,
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
  },
  subText: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
});
