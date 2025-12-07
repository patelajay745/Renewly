import {useRouter} from "expo-router";
import {FC} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
} from "react-native";
import {ChevronLeft} from "lucide-react-native";

interface Props {
  marginTop?: number;
  style?: ViewStyle | ViewStyle[];
}

const BackButton: FC<Props> = ({marginTop, style}) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[
        styles.backButton,
        Platform.OS === "android" && marginTop ? {marginTop} : null,
        style,
      ]}
    >
      <ChevronLeft color={"white"} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    marginLeft: -8,
    backgroundColor: "rgba(52, 52, 52, 0.12)",
    borderRadius: 9999,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BackButton;
