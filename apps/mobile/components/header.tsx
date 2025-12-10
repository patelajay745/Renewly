import { FC } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import BackButton from "./back-button";
import { EditIcon, LinkIcon } from "lucide-react-native";
import { semanticColors } from "@/constants/theme";

interface Props {
  title?: string;
  showHeaderContent?: boolean;
  eventDetails?: boolean;
  handleShare?: () => void;
  handleEdit?: () => void;
}

const Header: FC<Props> = ({
  title,
  showHeaderContent = true,
  eventDetails = false,
  handleShare,
  handleEdit,
}) => {
  const minHeight = showHeaderContent
    ? Platform.OS === "ios"
      ? 110
      : 80
    : Platform.OS === "ios"
      ? 50
      : 30;

  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? "light"];

  return (
    <View
      style={[
        styles.header,
        { minHeight },
        showHeaderContent && { paddingBottom: 10 },
        {
          backgroundColor: colors.background,
          borderBottomColor: `${colors.borderLight}`,
          borderBottomWidth: 0.5,
        },
      ]}
    >
      {showHeaderContent && (
        <View
          style={[
            styles.headerTitleContainer,
            eventDetails && {
              flexDirection: "row",
              justifyContent: "space-between",
            },
          ]}
        >
          <BackButton
            style={[
              styles.backButton,
              ...(!eventDetails ? [{ position: "absolute" as const }] : []),
            ]}
          />
          <Text
            style={[
              styles.title,
              eventDetails && {
                flex: 1,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "left",
                marginHorizontal: 16,
                width: "auto",
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {eventDetails && (
            <View style={styles.headerRightSideView}>
              <TouchableOpacity onPress={handleShare}>
                <LinkIcon color="white" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit}>
                <EditIcon color="white" size={24} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 36,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    left: 0,
    zIndex: 10,
  },
  title: {
    fontFamily: "rubik",
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  headerRightSideView: {
    flexDirection: "row",
    gap: 20,
  },
});

export default Header;
