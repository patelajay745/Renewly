import {useAppTheme} from "@/providers/ThemeProvider";
import {useClerk} from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import {Text, TouchableOpacity} from "react-native";
import {useQueryClient} from "@tanstack/react-query";

export const SignOutButton = () => {
  const {colors} = useAppTheme();
  // Use `useClerk()` to access the `signOut()` function
  const {signOut} = useClerk();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    try {
      // Clear all cached queries
      queryClient.clear();

      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <TouchableOpacity
      onPress={handleSignOut}
      style={{
        backgroundColor: colors.foreground,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{textAlign: "center"}}>Sign out</Text>
    </TouchableOpacity>
  );
};
