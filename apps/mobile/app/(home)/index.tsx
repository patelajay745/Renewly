import Header from "@/components/header";
import StatsCard from "@/components/stateCard";
import SubscriptionList from "@/components/subscription-list";
import {Text} from "@/components/text";

import {useGetDashboardStats} from "@/hooks/api/use-dashboard";
import {useAppTheme} from "@/providers/ThemeProvider";
import {useAuth, useUser} from "@clerk/clerk-expo";
import {StatusBar} from "expo-status-bar";
import {TriangleAlert} from "lucide-react-native";
import {useEffect} from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from "react-native";

export default function Page() {
  const {colors} = useAppTheme();
  const {user} = useUser();
  const {data, isLoading, refetch, error} = useGetDashboardStats();
  const {getToken} = useAuth();

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const token = await getToken();
  //     console.log(token);
  //   };
  //   fetchToken();

  //   console.log(data);
  // }, [data]);

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, {backgroundColor: colors.background}]}
      >
        <ActivityIndicator size={"large"} color={colors.foreground} />
        <Text style={{color: colors.text}}>Loading Subscriptions</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View
        style={[styles.centerContainer, {backgroundColor: colors.background}]}
      >
        <TriangleAlert color={colors.error} />
        <Text style={[styles.errorText, {color: colors.error}]}>
          Error loading subscriptions
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Header showHeaderContent={false} />

      <FlatList
        data={[1]}
        renderItem={() => (
          <SubscriptionList
            data={data.recentSubscriptions}
            title="Recent Subscriptions"
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={() => (
          <>
            <Text style={[styles.heading, {color: colors.text}]}>
              Welcome, {user?.firstName}
            </Text>
            <StatsCard data={data} />
            <SubscriptionList
              data={data.nextPayments}
              title="Upcoming Payments"
            />
          </>
        )}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  errorText: {
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 120 : 120,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
