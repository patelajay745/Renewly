import { View, Text, StyleSheet } from "react-native";
import { DashboardResponse } from "@/types/dashboard";
import { useAppTheme } from "@/providers/ThemeProvider";

export default function StatsCard({ data }: { data: DashboardResponse }) {
    const { colors } = useAppTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <Text style={[styles.title, { color: colors.text }]}>Total Subscriptions</Text>
            <Text style={[styles.value, { color: colors.primary }]}>{data.stats.totalSubscriptions}</Text>

            <View style={styles.row}>
                <View style={styles.item}>
                    <Text style={[styles.label, { color: colors.textMuted }]}>Monthly</Text>
                    <Text style={[styles.amount, { color: colors.primary }]}>₹{data.stats.totalMonthlySpend}</Text>
                </View>

                <View style={styles.item}>
                    <Text style={[styles.label, { color: colors.textMuted }]}>Yearly Projection</Text>
                    <Text style={[styles.amount, { color: colors.primary }]}>₹{data.stats.totalYearlyProjection}</Text>
                </View>
            </View>
        </View>
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
    title: { fontSize: 16, fontWeight: "600" },
    value: { fontSize: 26, fontWeight: "bold" },
    row: { flexDirection: "row", justifyContent: "space-between" },
    item: { flex: 1 },
    label: { fontSize: 12 },
    amount: { fontSize: 18, fontWeight: "600" },
});
