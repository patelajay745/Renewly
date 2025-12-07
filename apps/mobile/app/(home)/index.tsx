import {SignedIn, SignedOut, useAuth, useUser} from "@clerk/clerk-expo";
import {Link, Redirect} from "expo-router";
import {Text, View} from "react-native";
import {SignOutButton} from "@/components/sign-out-button";

export default function Page() {
  const {user} = useUser();
  const {isSignedIn} = useUser();
  const {getToken} = useAuth();

  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  (async () => {
    const token = await getToken({template: "aj"});
    console.log("User Token:", token);
  })();

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
