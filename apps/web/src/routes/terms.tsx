import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: Terms,
});

function Terms() {
  const lastUpdated = "December 16, 2025";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Terms & Conditions</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-3">Terms & Conditions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using Renewly. By using our service, you agree to
            be bound by these terms.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By accessing or using the Renewly mobile application and web dashboard ("Service"),
                you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to
                these Terms, please do not use our Service.
              </p>
              <p className="text-muted-foreground">
                These Terms apply to all users of the Service, including both free and paid users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Renewly is a subscription management platform that helps users:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Track and manage recurring subscriptions</li>
                <li>Monitor subscription costs and renewal dates</li>
                <li>Receive notifications about upcoming renewals</li>
                <li>View subscription analytics and spending reports</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Renewly is a tracking and organizational tool. We do not process payments, manage
                subscriptions on your behalf, or cancel subscriptions for you. You are responsible for
                managing your actual subscription services directly with the respective providers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">3.1 Account Creation</h3>
                <p className="text-muted-foreground">
                  To use Renewly, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3.2 Account Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 13 years old to use Renewly. By creating an account, you
                  represent that you meet this age requirement and have the legal capacity to enter
                  into these Terms.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3.3 Account Termination</h3>
                <p className="text-muted-foreground">
                  You may delete your account at any time through the app settings. We reserve the
                  right to suspend or terminate accounts that violate these Terms or engage in
                  fraudulent or abusive behavior.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">As a user of Renewly, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Not use the Service to transmit malicious code or harmful content</li>
                <li>Not reverse engineer, decompile, or attempt to extract the source code</li>
                <li>Not use automated systems or bots to access the Service</li>
                <li>Not impersonate others or create fake accounts</li>
                <li>Maintain accurate subscription information in your account</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Subscription Plans and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">5.1 Free Tier</h3>
                <p className="text-muted-foreground">
                  Renewly offers a free tier with basic subscription tracking features. We reserve the
                  right to modify or discontinue the free tier at any time.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5.2 Premium Plans</h3>
                <p className="text-muted-foreground">
                  Premium subscription plans may be offered with additional features. Pricing and
                  features are subject to change with notice to users.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5.3 Billing</h3>
                <p className="text-muted-foreground">
                  If you subscribe to a paid plan, you agree to pay all applicable fees. Payments are
                  processed through secure third-party payment processors. All fees are non-refundable
                  except as required by law or as explicitly stated in our refund policy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5.4 Cancellation</h3>
                <p className="text-muted-foreground">
                  You may cancel your paid subscription at any time. Cancellation will take effect at
                  the end of your current billing period.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">6.1 Our Property</h3>
                <p className="text-muted-foreground">
                  Renewly and all related logos, trademarks, and content are the property of Renewly
                  or its licensors. You may not use our intellectual property without prior written
                  permission.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">6.2 Your Content</h3>
                <p className="text-muted-foreground">
                  You retain ownership of the subscription data and information you input into Renewly.
                  By using the Service, you grant us a license to use, store, and process your data
                  solely to provide and improve the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Disclaimers and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">7.1 Service "As Is"</h3>
                <p className="text-muted-foreground">
                  Renewly is provided "as is" and "as available" without warranties of any kind. We do
                  not guarantee that the Service will be uninterrupted, error-free, or completely
                  secure.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">7.2 No Financial Advice</h3>
                <p className="text-muted-foreground">
                  Renewly is a tracking tool only. We do not provide financial advice or
                  recommendations about which subscriptions to keep or cancel. All decisions regarding
                  your subscriptions are your own responsibility.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">7.3 Third-Party Services</h3>
                <p className="text-muted-foreground">
                  Renewly may integrate with or reference third-party services. We are not responsible
                  for the content, privacy practices, or terms of service of any third-party services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">7.4 Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, Renewly shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages, including loss of profits,
                  data, or other intangible losses resulting from your use of the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless Renewly, its officers, directors, employees,
                and agents from any claims, damages, losses, liabilities, and expenses (including
                attorney fees) arising from your use of the Service or violation of these Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Data Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your use of Renewly is also governed by our Privacy Policy. Please review our{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of
                significant changes via email or in-app notification. Your continued use of Renewly
                after changes are posted constitutes acceptance of the modified Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your access to Renewly at any time,
                without notice, for conduct that we believe violates these Terms or is harmful to other
                users, us, or third parties, or for any other reason in our sole discretion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of your
                jurisdiction, without regard to its conflict of law provisions. Any disputes arising
                from these Terms or your use of Renewly shall be resolved in the courts of your
                jurisdiction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Severability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining
                provisions shall continue in full force and effect.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:legal@renewly.app" className="text-primary hover:underline">
                    legal@renewly.app
                  </a>
                </p>
                <p>
                  <strong>Support:</strong>{" "}
                  <a href="mailto:support@renewly.app" className="text-primary hover:underline">
                    support@renewly.app
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground text-center">
                By using Renewly, you acknowledge that you have read, understood, and agree to be
                bound by these Terms and Conditions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Renewly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
