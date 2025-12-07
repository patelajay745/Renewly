import {useSignIn} from "@clerk/clerk-expo";
import {Link, useRouter} from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";

import {semanticColors} from "../../constants/theme";
import SocialLoginButton from "@/components/social-login-button";

export default function Page() {
  const {signIn, setActive, isLoaded} = useSignIn();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const colors = semanticColors[colorScheme ?? "light"];

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({session: signInAttempt.createdSessionId});
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.textContainer}>
        <Text style={[styles.welcomeText, {color: colors.text}]}>
          Welcome to Renewly
        </Text>
        <Text style={[styles.description, {color: `${colors.textMuted}`}]}>
          Stay on top of your subscriptions… because missing a renewal is so
          last season 😏
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <SocialLoginButton strategy="google" />
        <SocialLoginButton strategy="apple" />
      </View>
      <Text style={[styles.footerText, {color: `${colors.textMuted}`}]}>
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  textContainer: {
    gap: 2,
  },
  buttonContainer: {
    gap: 2,
  },
  welcomeText: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
  },
});
