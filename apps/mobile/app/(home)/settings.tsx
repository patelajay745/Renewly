import Header from "@/components/header";
import {FC, useState} from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  Linking,
  Modal,
  Pressable,
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useAppTheme} from "@/providers/ThemeProvider";
import {useCurrency} from "@/providers/CurrencyProvider";
import {useClerk, useUser} from "@clerk/clerk-expo";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import {Text} from "@/components/text";
import {useDeleteAccount} from "@/hooks/api/use-account";

interface Props {}

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  colors: any;
}

const SettingItem: FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = false,
  rightElement,
  colors,
}) => {
  return (
    <TouchableOpacity
      style={[styles.settingItem, {backgroundColor: colors.card}]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={20} color={colors.text} />
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, {color: colors.text}]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, {color: colors.textMuted}]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement ||
        (showArrow && (
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        ))}
    </TouchableOpacity>
  );
};

interface SectionHeaderProps {
  title: string;
  colors: any;
}

const SectionHeader: FC<SectionHeaderProps> = ({title, colors}) => {
  return (
    <Text
      style={[styles.sectionHeader, {color: colors.textMuted}]}
      variant="title"
    >
      {title}
    </Text>
  );
};

const Settings: FC<Props> = (props) => {
  const {colors, mode, toggleTheme} = useAppTheme();
  const {selectedCurrency, setSelectedCurrency, currencies} = useCurrency();
  const {signOut} = useClerk();
  const {user} = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const {mutate: deleteAccount} = useDeleteAccount();

  const handleSignOut = async () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/sign-in");
          } catch (err) {
            console.error("Sign out error:", err);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            Alert.alert(
              "Final Confirmation",
              "This will permanently delete your account and all associated data. Are you absolutely sure?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Yes, Delete",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      setIsDeleting(true);
                      deleteAccount();
                      await user?.delete();
                      router.replace("/(auth)/sign-in");
                    } catch (err) {
                      console.error("Delete account error:", err);
                      Alert.alert(
                        "Error",
                        "Failed to delete account. Please try again or contact support."
                      );
                    } finally {
                      setIsDeleting(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleFeedback = () => {
    Linking.openURL("mailto:patel.ajay745@gmail.com?subject=App Feedback");
  };

  const handleFAQ = () => {
    Linking.openURL("https://www.renewly.cc/faq");
  };

  const handlePrivacyTerms = () => {
    Linking.openURL("https://www.renewly.cc/privacy");
  };

  const handleTermsConditions = () => {
    Linking.openURL("https://www.renewly.cc/terms");
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {Platform.OS === "android" && <StatusBar style="auto" />}
      <Header showHeaderContent={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="General" colors={colors} />
        <View style={styles.section}>
          <SettingItem
            icon="cash-outline"
            title="Currency"
            subtitle={`${selectedCurrency.name} (${selectedCurrency.symbol})`}
            onPress={() => setShowCurrencyModal(true)}
            showArrow
            colors={colors}
          />
          <SettingItem
            icon="chatbox-outline"
            title="Leave feedback"
            subtitle="Let's know what feature do you want to add in."
            onPress={handleFeedback}
            colors={colors}
          />
          <SettingItem
            icon="color-palette-outline"
            title="Switch themes"
            rightElement={
              <Switch
                value={mode === "dark"}
                onValueChange={toggleTheme}
                trackColor={{false: colors.disabled, true: colors.success}}
                thumbColor={colors.foreground}
              />
            }
            colors={colors}
          />

          <SettingItem
            icon="help-circle-outline"
            title="FAQ"
            onPress={handleFAQ}
            showArrow
            colors={colors}
          />
        </View>

        
        <SectionHeader title="Legal" colors={colors} />
        <View style={styles.section}>
          <SettingItem
            icon="document-text-outline"
            title="Data Privacy Terms"
            onPress={handlePrivacyTerms}
            showArrow
            colors={colors}
          />
          <SettingItem
            icon="reader-outline"
            title="Terms and Conditions"
            onPress={handleTermsConditions}
            showArrow
            colors={colors}
          />
        </View>

        <View style={[styles.section, styles.accountSection]}>
          <TouchableOpacity
            style={[
              styles.dangerButton,
              {backgroundColor: colors.error + "15"},
            ]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.dangerButtonText, {color: colors.error}]}>
              Sign out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dangerButton,
              {backgroundColor: colors.error + "15"},
            ]}
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text style={[styles.dangerButtonText, {color: colors.error}]}>
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, {color: colors.textMuted}]}>
          Version 1.0.0
        </Text>
      </ScrollView>

      <Modal
        visible={showCurrencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowCurrencyModal(false)}
          />
          <View style={[styles.modalContent, {backgroundColor: colors.card}]}>
            <View
              style={[styles.modalHeader, {borderBottomColor: colors.border}]}
            >
              <Text style={[styles.modalTitle, {color: colors.text}]}>
                Select Currency
              </Text>
              <TouchableOpacity
                onPress={() => setShowCurrencyModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.currencyList}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyItem,
                    {borderBottomColor: colors.border},
                    selectedCurrency.code === currency.code && {
                      backgroundColor: colors.primary + "15",
                    },
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency);
                    setShowCurrencyModal(false);
                  }}
                >
                  <View style={styles.currencyInfo}>
                    <Text style={[styles.currencySymbol, {color: colors.text}]}>
                      {currency.symbol}
                    </Text>
                    <View>
                      <Text style={[styles.currencyCode, {color: colors.text}]}>
                        {currency.code}
                      </Text>
                      <Text
                        style={[styles.currencyName, {color: colors.textMuted}]}
                      >
                        {currency.name}
                      </Text>
                    </View>
                  </View>
                  {selectedCurrency.code === currency.code && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  section: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  accountSection: {
    marginTop: 32,
    gap: 12,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  currencyList: {
    maxHeight: 500,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 0.5,
  },
  currencyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    width: 40,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "600",
  },
  currencyName: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default Settings;
