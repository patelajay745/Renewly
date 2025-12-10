// components/recentSubscriptions.tsx

import { View, Text, StyleSheet, FlatList } from "react-native";
import { RecentSubscription } from "@/types/dashboard";
import { useAppTheme } from "@/providers/ThemeProvider";

interface Props {
    data: RecentSubscription[];
}

export default function RecentSubscriptions({ data }: Props) {
    const { colors } = useAppTheme();

    if (!data.length) return null;

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                Recent Subscriptions
            </Text>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={[styles.row, { borderColor: colors.borderMuted }]}>
                        <View>
                            <Text style={[styles.mainText, { color: colors.text }]}>
                                {item.title}
                            </Text>

                            <Text style={[styles.category, { color: colors.textMuted }]}>
                                {item.category}
                            </Text>
                        </View>

                        <Text style={[styles.amount, { color: colors.accent }]}>
                            ₹ {item.amount}
                        </Text>
                    </View>
                )}
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
        borderBottomWidth: 0.6,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    mainText: {
        fontSize: 16,
        fontWeight: "500",
    },
    category: {
        fontSize: 12,
    },
    amount: {
        fontSize: 16,
        fontWeight: "600",
    },
});
