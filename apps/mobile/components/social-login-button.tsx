import {useOAuth, useUser} from "@clerk/clerk-expo";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import React, {useState} from "react";
import {semanticColors} from "@/constants/theme";
import {useAppTheme} from "@/providers/ThemeProvider";

const SocialLoginButton = ({
  strategy,
}: {
  strategy: "facebook" | "google" | "apple";
}) => {
  const getStrategy = () => {
    if (strategy === "facebook") {
      return "oauth_facebook";
    } else if (strategy === "google") {
      return "oauth_google";
    } else if (strategy === "apple") {
      return "oauth_apple";
    }
    return "oauth_facebook";
  };

  const {colors, mode} = useAppTheme();

  const {startOAuthFlow} = useOAuth({strategy: getStrategy()});
  const {user} = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const buttonText = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (strategy === "facebook") {
      return "Continue with Facebook";
    } else if (strategy === "google") {
      return "Continue with Google";
    } else if (strategy === "apple") {
      return "Continue with Apple";
    }
  };

  const buttonIcon = () => {
    if (strategy === "facebook") {
      return <Ionicons name="logo-facebook" size={24} color="#1977F3" />;
    } else if (strategy === "google") {
      return <Ionicons name="logo-google" size={24} color="#DB4437" />;
    } else if (strategy === "apple") {
      return (
        <Ionicons
          name="logo-apple"
          size={24}
          color={mode === "light" ? "dark" : "white"}
        />
      );
    }
  };

  const onSocialLoginPress = async () => {
    console.log("pressed");
    try {
      setIsLoading(true);
      const {createdSessionId, setActive} = await startOAuthFlow({
        redirectUrl: Linking.createURL("(home)"),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        // console.log("Session created", createdSessionId);
        setActive!({session: createdSessionId});
        await user?.reload();
        router.replace("/(home)");
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, {borderColor: colors.border}]}
      onPress={onSocialLoginPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        buttonIcon()
      )}
      <Text style={[styles.buttonText, {color: colors.text}]}>
        {buttonText()}
      </Text>
      <View />
    </TouchableOpacity>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    borderRadius: 50,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "rubik",
    fontWeight: "medium",
  },
});
