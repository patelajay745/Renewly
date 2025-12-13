import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";

export const Route = createFileRoute("/auth/")({
  component: SignInPage,
});

export function SignInPage() {

  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useUser()
  const navigate = useNavigate();

  if (isSignedIn) {

    navigate({ to: "/dashboard" });
    return null;
  }

  const signInWith = async (strategy: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/auth/callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-900 to-black px-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription className="text-gray-300">
            Sign in to continue to Renewly
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            <Button
              variant="default"
              className="bg-gray-800 hover:bg-gray-900 text-white"
              onClick={() => signInWith("oauth_google")}
            >
              <FcGoogle /> Continue with Google
            </Button>

            <Button
              variant="default"
              className="bg-gray-800 hover:bg-gray-900 text-white"
              onClick={() => signInWith("oauth_apple")}
            >
              <FaApple /> Continue with Apple
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
