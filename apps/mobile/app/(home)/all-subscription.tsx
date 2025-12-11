import {useAppTheme} from "@/providers/ThemeProvider";
import {FC} from "react";
import {View, StyleSheet, Text} from "react-native";

interface Props {}

const AllSubscription: FC<Props> = (props) => {
  const {colors} = useAppTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.text, {color: colors.text}]}>All Subscription</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
});

export default AllSubscription;
