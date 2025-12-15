import {StyleSheet, View} from "react-native";
import React from "react";
import SocialLoginButton from "@/components/social-login-button";
import {useAppTheme} from "@/providers/ThemeProvider";
import { Text } from "@/components/text";

export default function Page() {
  const {colors} = useAppTheme();

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
