import Header from "@/components/header";
import {FC} from "react";
import {View, StyleSheet, Text} from "react-native";

interface Props {}

const CreateSubscription: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Header showHeaderContent={false} />
      <View style={styles.contentContainer}>
        <Text> create subscription page</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
});

export default CreateSubscription;
