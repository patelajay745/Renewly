import Header from "@/components/header";
import {FC} from "react";
import {View, StyleSheet, Text, Platform} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useAppTheme} from "@/providers/ThemeProvider";
import {SignOutButton} from "@/components/sign-out-button";

interface Props {}

const Settings: FC<Props> = (props) => {
  const {colors} = useAppTheme();

  console.log(colors);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {Platform.OS === "android" && <StatusBar style="auto" />}
      <Header showHeaderContent={false} />
      <View style={styles.contentContainer}>
        <SignOutButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  contentContainer: {
    flex: 1,
    padding: 10,
  },
});

export default Settings;
