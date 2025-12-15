import {Stack, useRouter} from "expo-router";
import {FC} from "react";
import {View, StyleSheet, TouchableOpacity, Platform} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useAppTheme} from "@/providers/ThemeProvider";
import {X} from "lucide-react-native";

interface Props {}

const Layout: FC<Props> = (props) => {
  const router = useRouter();
  const {colors} = useAppTheme();

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal",
          title: "Edit Subscription",
          headerBackButtonDisplayMode: "minimal",
          headerLeft: () =>
            Platform.OS === "ios" ? (
              <TouchableOpacity
                onPress={() => router.back()}
                style={[
                  styles.closeButton,
                  {backgroundColor: colors.background},
                ]}
              >
                <X size={28} color={colors.text} />
              </TouchableOpacity>
            ) : null,
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  container: {},
  closeButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 50,
  },
});

export default Layout;
