import {createFileRoute} from "@tanstack/react-router";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Shield} from "lucide-react";
import {Link} from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
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
              <Shield className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-3">Privacy Policy</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your personal information.
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
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1.1 Personal Information</h3>
                <p className="text-muted-foreground">
                  When you create an account with Renewly, we collect:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Name and email address</li>
                  <li>Account credentials (encrypted)</li>
                  <li>Profile information you choose to provide</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">1.2 Subscription Data</h3>
                <p className="text-muted-foreground">
                  To provide our service, we collect and store:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Subscription names and descriptions</li>
                  <li>Billing amounts and cycles</li>
                  <li>Renewal dates</li>
                  <li>Payment categories</li>
                </ul>
                <p className="text-muted-foreground mt-2 text-sm italic">
                  Note: We do not store actual payment card details or process
                  payments directly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">1.3 Usage Information</h3>
                <p className="text-muted-foreground">
                  We automatically collect certain information about your device
                  and how you interact with our app:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Device type and operating system</li>
                  <li>App usage statistics and features accessed</li>
                  <li>Log data and error reports</li>
                  <li>IP address and general location data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Service Delivery:</strong> To provide, maintain, and
                  improve the Renewly subscription tracking service
                </li>
                <li>
                  <strong>Notifications:</strong> To send you renewal reminders
                  and important updates about your subscriptions
                </li>
                <li>
                  <strong>Account Management:</strong> To authenticate your
                  identity and manage your account
                </li>
                <li>
                  <strong>Analytics:</strong> To understand usage patterns and
                  improve our app's performance and features
                </li>
                <li>
                  <strong>Customer Support:</strong> To respond to your
                  inquiries and provide technical assistance
                </li>
                <li>
                  <strong>Security:</strong> To detect and prevent fraud, abuse,
                  or security issues
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable
                  laws and regulations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We respect your privacy and do not sell your personal
                information. We may share your data only in the following
                circumstances:
              </p>

              <div>
                <h3 className="font-semibold mb-2">3.1 Service Providers</h3>
                <p className="text-muted-foreground">
                  We work with trusted third-party service providers who help us
                  operate our service:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Cloud hosting and storage providers</li>
                  <li>Authentication services</li>
                  <li>Analytics and performance monitoring tools</li>
                  <li>Email and notification services</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3.2 Legal Requirements</h3>
                <p className="text-muted-foreground">
                  We may disclose your information if required by law or in
                  response to valid legal processes such as subpoenas or court
                  orders.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3.3 Business Transfers</h3>
                <p className="text-muted-foreground">
                  In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred to the acquiring entity.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>End-to-end encryption for data in transit (HTTPS/TLS)</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Regular security audits and monitoring</li>
                <li>Secure authentication with Clerk</li>
                <li>Limited employee access to personal data</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                While we strive to protect your data, no method of transmission
                over the internet is 100% secure. We cannot guarantee absolute
                security but are committed to protecting your information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You have the following rights regarding your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Access:</strong> Request a copy of the personal
                  information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct your personal
                  information through your account settings
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and associated data
                </li>
                <li>
                  <strong>Opt-out:</strong> Disable push notifications or
                  marketing communications
                </li>
                <li>
                  <strong>Data Portability:</strong> Request your data in a
                  portable format
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@renewly.app"
                  className="text-primary hover:underline"
                >
                  privacy@renewly.app
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We retain your personal information for as long as your account
                is active or as needed to provide our services. If you request
                account deletion, we will delete or anonymize your data within
                30 days, except where we are required to retain it for legal or
                compliance purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Renewly is not intended for users under the age of 13. We do not
                knowingly collect personal information from children. If you
                believe we have collected information from a child, please
                contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in
                countries other than your own. We ensure that appropriate
                safeguards are in place to protect your data in compliance with
                applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by posting the new policy
                on this page and updating the "Last Updated" date. Your
                continued use of Renewly after changes are posted constitutes
                your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@renewly.app"
                    className="text-primary hover:underline"
                  >
                    privacy@renewly.app
                  </a>
                </p>
                <p>
                  <strong>Support:</strong>{" "}
                  <a
                    href="mailto:support@renewly.app"
                    className="text-primary hover:underline"
                  >
                    support@renewly.app
                  </a>
                </p>
              </div>
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
