import Header from "@/components/header";
import SubscriptionCard from "@/components/subscriptioncard";
import {Text} from "@/components/text";
import {useAllSubscriptions} from "@/hooks/api/use-subscription";
import {useAppTheme} from "@/providers/ThemeProvider";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TriangleAlert} from "lucide-react-native";
import {FC, useMemo, useState} from "react";
import {View, StyleSheet, ActivityIndicator, FlatList} from "react-native";

const CATEGORIES = [
  "All",
  "Entertainment",
  "Productivity",
  "Health & Fitness",
  "Education",
  "News & Magazines",
  "Music",
  "Other",
];

interface Props {}

const AllSubscription: FC<Props> = (props) => {
  const {colors} = useAppTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showInstructions, setShowInstructions] = useState(true);

  const {
    data: allSubscriptions,
    isLoading,
    error,
    refetch,
  } = useAllSubscriptions();

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

  if (error) {
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

  const filteredSubscriptions = useMemo(() => {
    if (!allSubscriptions) return;

    return allSubscriptions.filter((sub) => {
      const matchesSearch = sub.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || sub.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allSubscriptions, searchQuery, selectedCategory]);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Header showHeaderContent={false} />

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <SubscriptionCard {...item} />}
        contentContainerStyle={{gap: 10}}
      />
    </View>
  );
};

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
  container: {flex: 1},
});

export default AllSubscription;
