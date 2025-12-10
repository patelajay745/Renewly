import { View, Text, StyleSheet } from "react-native";
import { DashboardResponse } from "@/types/dashboard";
import { useAppTheme } from "@/providers/ThemeProvider";

export default function NextPayments({ data }: { data: DashboardResponse }) {
    const { colors } = useAppTheme();

    if (!data.nextPayments.length) return null;

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>Next Payments</Text>

            {data.nextPayments.map((item) => (
                <View key={item.id} style={[styles.row, { borderColor: colors.borderMuted }]}>
                    <View>
                        <Text style={[styles.mainText, { color: colors.text }]}>{item.title}</Text>
                        <Text style={[styles.subText, { color: colors.textMuted }]}>
                            {new Date(item.nextPayment).toDateString()}
                        </Text>
                    </View>

                    <Text style={[styles.amount, { color: colors.accent }]}>
                        ₹ {item.amount}
                    </Text>
                </View>
            ))}
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
        borderBottomWidth: 0.6,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    mainText: { fontSize: 16, fontWeight: "500" },
    subText: { fontSize: 12 },
    amount: { fontSize: 16, fontWeight: "600" },
});
