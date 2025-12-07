import {SignedIn, SignedOut, useAuth, useUser} from "@clerk/clerk-expo";
import {Link, Redirect} from "expo-router";
import {StyleSheet, Text, View} from "react-native";
import {SignOutButton} from "@/components/sign-out-button";
import Header from "@/components/header";

export default function Page() {
  const {user} = useUser();
  const {isSignedIn} = useUser();
  const {getToken} = useAuth();

  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  // (async () => {
  //   const token = await getToken({template: "aj"});
  //   console.log("User Token: from home/index.tsx", token);
  // })();

  return (
    <View style={{flex: 1}}>
      <Header showHeaderContent={false} />
      <View style={styles.container}>
        <SignedIn>
          <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <Link href="/(auth)/sign-in">
            <Text>Sign in</Text>
          </Link>
        </SignedOut>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
});
