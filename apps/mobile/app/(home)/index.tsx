import Header from "@/components/header";
import NextPayments from "@/components/nextPayments";
import RecentSubscriptions from "@/components/recentSubscriptions";
import StatsCard from "@/components/stateCard";

import { useGetDashboardStats } from "@/hooks/api/use-dashboard";
import { useAppTheme } from "@/providers/ThemeProvider";
import { useUser } from "@clerk/clerk-expo";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const { colors } = useAppTheme();
  const { user } = useUser();
  const { data, isLoading } = useGetDashboardStats();

  if (isLoading)
    return (
      <Text style={[styles.loadingText, { color: colors.text }]}>
        Loading...
      </Text>
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showHeaderContent={false} />

      <FlatList
        data={[1]}
        renderItem={() => (
          <>
            <Text style={[styles.heading, { color: colors.text }]}>
              Welcome, {user?.firstName}
            </Text>

            {data && <StatsCard data={data} />}
            {data && <NextPayments data={data.nextPayments} />}
            {data && <RecentSubscriptions data={data.recentSubscriptions} />}
          </>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
