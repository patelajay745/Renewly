import Header from "@/components/header";
import SubscriptionCard from "@/components/subscriptioncard";
import {Text} from "@/components/text";
import {TextInput} from "@/components/text-input";
import {useAllSubscriptions} from "@/hooks/api/use-subscription";
import {useAppTheme} from "@/providers/ThemeProvider";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {
  BookText,
  CircleX,
  Cross,
  FileX,
  Search,
  TriangleAlert,
  X,
} from "lucide-react-native";
import {FC, useMemo, useState, useEffect} from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  Layout,
} from "react-native-reanimated";

const CATEGORIES = [
  {title: "All", value: "All"},
  {title: "Entertainment", value: "entertainment"},
  {title: "Utilities", value: "utilities"},
  {title: "Software", value: "software"},
  {title: "Health & Fitness", value: "health_fitness"},
  {title: "Education", value: "education"},
  {title: "Food & Drink", value: "food_drink"},
  {title: "Transportation", value: "transportation"},
  {title: "Other", value: "other"},
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

      {showInstructions && (
        <View
          style={[styles.instructionBanner, {backgroundColor: colors.info}]}
        >
          <View style={styles.instructionContent}>
            <BookText size={20} color={colors.white} />
            <Text style={styles.instructionText}>
              Tap to edit • Swipe left to delete
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowInstructions(false)}
            hitSlop={10}
          >
            <CircleX size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.searchContainer, {backgroundColor: colors.card}]}>
        <Search color={colors.textMuted} size={20} />
        <TextInput
          style={[styles.searchInput]}
          placeholder="Search subscriptions..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <CircleX size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categaryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.title}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === item.value
                      ? colors.primary
                      : colors.card,
                  borderColor: colors.borderLight,
                },
              ]}
              onPress={() => setSelectedCategory(item.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === item.value
                        ? colors.foregroundText
                        : colors.text,
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {filteredSubscriptions?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FileX size={64} color={colors.textMuted} />
          <Text style={[styles.emptyText]} muted>
            {searchQuery || selectedCategory === "All"
              ? "No Subscriptions found"
              : "No Subscriptions yet"}
          </Text>

          {searchQuery || selectedCategory !== "All" ? (
            <Text muted style={styles.emptySubText}>
              Try adjusting your search or filter
            </Text>
          ) : null}
        </View>
      ) : (
        <Animated.FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => (
            <Animated.View
              entering={SlideInDown.duration(400)
                .delay(index * 100)
                .springify()}
              layout={Layout.springify()}
            >
              <SubscriptionCard {...item} />
            </Animated.View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
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
  listContent: {gap: 10, paddingHorizontal: 16, paddingBottom: 16},
  instructionBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  instructionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categaryContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 14,
  },
});

export default AllSubscription;
