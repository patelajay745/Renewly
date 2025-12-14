import {useAppTheme} from "@/providers/ThemeProvider";
import {FC, useState, useMemo} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  useAllSubscriptions,
  useDeleteSubscription,
} from "@/hooks/api/use-subscription";
import {RecentSubscription} from "@/types/dashboard";
import {Ionicons} from "@expo/vector-icons";
import {Swipeable} from "react-native-gesture-handler";
import Header from "@/components/header";
import {useRouter} from "expo-router";
import {Text} from "@/components/text";
import {TextInput} from "@/components/text-input";

interface Props {}

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

const AllSubscription: FC<Props> = (props) => {
  const {colors} = useAppTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showInstructions, setShowInstructions] = useState(true);

  const {
    data: subscriptions,
    isLoading,
    error,
    refetch,
  } = useAllSubscriptions();
  const deleteSubscription = useDeleteSubscription();

  // Filter subscriptions based on search and category
  const filteredSubscriptions = useMemo(() => {
    if (!subscriptions) return [];

    return subscriptions.filter((sub) => {
      const matchesSearch = sub.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || sub.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [subscriptions, searchQuery, selectedCategory]);

  const handleDelete = (subscription: RecentSubscription) => {
    Alert.alert(
      "Delete Subscription",
      `Are you sure you want to delete "${subscription.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteSubscription.mutate(subscription.id, {
              onSuccess: () => {
                Alert.alert("Success", "Subscription deleted successfully");
              },
              onError: (error) => {
                Alert.alert("Error", "Failed to delete subscription");
                console.error(error);
              },
            });
          },
        },
      ]
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    subscription: RecentSubscription
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{translateX: trans}],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.deleteButton, {backgroundColor: colors.error}]}
          onPress={() => handleDelete(subscription)}
        >
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSubscriptionCard = ({item}: {item: RecentSubscription}) => {
    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
        overshootRight={false}
      >
        <TouchableOpacity
          style={[styles.card, {backgroundColor: colors.card}]}
          onPress={() => router.push(`/edit-subscription/${item.id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.title, {color: colors.text}]}>
              {item.title}
            </Text>
            <Text style={[styles.amount, {color: colors.primary}]}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.textMuted}
              />
              <Text style={[styles.detailText, {color: colors.textMuted}]}>
                {item.type}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="pricetag-outline"
                size={16}
                color={colors.textMuted}
              />
              <Text style={[styles.detailText, {color: colors.textMuted}]}>
                {item.category.charAt(0).toUpperCase() +
                  item.category.slice(1).replaceAll("_", " ")}
              </Text>
            </View>
            {item.notification && (
              <View style={styles.detailRow}>
                <Ionicons
                  name="notifications-outline"
                  size={16}
                  color={colors.success}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, {backgroundColor: colors.background}]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.centerContainer, {backgroundColor: colors.background}]}
      >
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
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
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderSubscriptionCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
        ListHeaderComponent={() => (
          <>
            {/* Instruction Banner */}
            {showInstructions && (
              <View
                style={[
                  styles.instructionBanner,
                  {backgroundColor: colors.info},
                ]}
              >
                <View style={styles.instructionContent}>
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.instructionText}>
                    Tap to edit • Swipe left to delete
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowInstructions(false)}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
            {/* Search Bar */}
            <View
              style={[styles.searchContainer, {backgroundColor: colors.card}]}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.textMuted}
              />
              <TextInput
                style={[styles.searchInput, {color: colors.text}]}
                placeholder="Search subscriptions..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>
            {/* Category Filter */}
            <View style={styles.filterContainer}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={CATEGORIES}
                keyExtractor={(item) => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor:
                          selectedCategory === item
                            ? colors.primary
                            : colors.card,
                        borderColor: colors.borderLight,
                      },
                    ]}
                    onPress={() => setSelectedCategory(item)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color:
                            selectedCategory === item
                              ? colors.foregroundText
                              : colors.text,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {filteredSubscriptions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="file-tray-outline"
                  size={64}
                  color={colors.textMuted}
                />
                <Text style={[styles.emptyText, {color: colors.textMuted}]}>
                  {searchQuery || selectedCategory !== "All"
                    ? "No subscriptions found"
                    : "No subscriptions yet"}
                </Text>
                {searchQuery || selectedCategory !== "All" ? (
                  <Text
                    style={[styles.emptySubtext, {color: colors.textMuted}]}
                  >
                    Try adjusting your search or filter
                  </Text>
                ) : null}
              </View>
            ) : null}
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  instructionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  amount: {
    fontSize: 17,
    fontWeight: "700",
  },
  cardDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  deleteAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
});

export default AllSubscription;
