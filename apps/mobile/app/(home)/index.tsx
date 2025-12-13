import Header from "@/components/header";
import NextPayments from "@/components/nextPayments";
import RecentSubscriptions from "@/components/recentSubscriptions";
import StatsCard from "@/components/stateCard";
import {Text} from "@/components/text";

import {useGetDashboardStats} from "@/hooks/api/use-dashboard";
import {useAppTheme} from "@/providers/ThemeProvider";
import {useUser} from "@clerk/clerk-expo";
import {FlatList, Platform, StyleSheet, View} from "react-native";

export default function Page() {
  const {colors} = useAppTheme();
  const {user} = useUser();
  const {data, isLoading} = useGetDashboardStats();

  if (isLoading)
    return (
      <Text style={[styles.loadingText, {color: colors.text}]}>Loading...</Text>
    );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Header showHeaderContent={false} />

      <FlatList
        data={[1]}
        renderItem={() => (
          <>{data && <RecentSubscriptions data={data.recentSubscriptions} />}</>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={() => (
          <>
            <Text style={[styles.heading, {color: colors.text}]}>
              Welcome, {user?.firstName}
            </Text>

            {data && <StatsCard data={data} />}
            {data && <NextPayments data={data.nextPayments} />}
          </>
        )}
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
    paddingBottom: Platform.OS === "ios" ? 80 : 120,
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
