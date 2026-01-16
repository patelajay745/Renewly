import {createFileRoute} from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Smartphone, Download, HelpCircle} from "lucide-react";
import {Link} from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  component: FAQ,
});

interface FAQItem {
  question: string;
  answer: string | React.ReactElement;
}

const faqData: {category: string; items: FAQItem[]}[] = [
  {
    category: "Getting Started",
    items: [
      {
        question: "What is Renewly?",
        answer:
          "Renewly is a subscription management app that helps you track and manage all your recurring subscriptions in one place. Keep track of renewal dates, costs, and never miss a payment again.",
      },
      {
        question: "How do I download the Renewly mobile app?",
        answer: (
          <div>
            <p className="mb-2">
              The Renewly mobile app is available for both iOS and Android
              devices:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>iOS: Download from the Apple App Store</li>
              <li>Android: Download from the Google Play Store</li>
            </ul>
          </div>
        ),
      },
      {
        question: "Is Renewly free to use?",
        answer:
          "Yes, Renewly offers a free tier that allows you to track your subscriptions. Additional premium features may be available with paid plans.",
      },
      {
        question: "Do I need an account to use Renewly?",
        answer:
          "Yes, you need to create an account to use Renewly. This allows you to sync your subscriptions across devices and keep your data secure in the cloud.",
      },
    ],
  },
  {
    category: "Managing Subscriptions",
    items: [
      {
        question: "How do I add a new subscription?",
        answer: (
          <div>
            <p className="mb-2">Adding a subscription is easy:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Open the Renewly app</li>
              <li>Tap the '+' button on the home screen</li>
              <li>
                Fill in the subscription details (name, cost, billing cycle,
                start date)
              </li>
              <li>Tap 'Save' to add the subscription</li>
            </ol>
          </div>
        ),
      },
      {
        question: "Can I edit or delete a subscription?",
        answer:
          "Yes! Tap on any subscription to view its details. From there, you can edit the information by tapping the edit button or delete it by tapping the delete option.",
      },
      {
        question: "What billing cycles are supported?",
        answer:
          "Renewly supports various billing cycles including monthly, quarterly, semi-annually, and annually. You can also set custom billing periods for unique subscription types.",
      },
      {
        question: "Can I track multiple currencies?",
        answer:
          "Currently, Renewly tracks subscriptions in your default currency. Multi-currency support may be added in future updates.",
      },
    ],
  },
  {
    category: "Notifications & Reminders",
    items: [
      {
        question: "Will I receive notifications for upcoming renewals?",
        answer:
          "Yes! Renewly sends push notifications to remind you before your subscriptions renew. You can customize when you receive these reminders in the app settings.",
      },
      {
        question: "How do I enable or disable notifications?",
        answer: (
          <div>
            <p className="mb-2">To manage notifications:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Go to Settings in the app</li>
              <li>Tap on 'Notifications'</li>
              <li>Toggle notifications on or off</li>
              <li>
                Customize reminder timing (e.g., 1 day before, 1 week before)
              </li>
            </ol>
          </div>
        ),
      },
      {
        question:
          "Can I set different reminder times for different subscriptions?",
        answer:
          "Currently, notification settings apply to all subscriptions. Individual subscription reminders may be added in future updates.",
      },
    ],
  },
  {
    category: "Account & Security",
    items: [
      {
        question: "How do I reset my password?",
        answer:
          "On the login screen, tap 'Forgot Password' and follow the instructions sent to your email to reset your password.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes, we take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account from the Settings menu. Please note that this action is irreversible and will permanently delete all your subscription data.",
      },
      {
        question: "How do I sign out of the app?",
        answer:
          "Go to Settings and tap 'Sign Out' at the bottom of the screen. You'll need to sign in again to access your subscriptions.",
      },
    ],
  },
  {
    category: "Features & Functionality",
    items: [
      {
        question: "Can I see my total monthly spending?",
        answer:
          "Yes! The dashboard displays your total monthly and annual spending across all subscriptions, helping you understand your recurring costs at a glance.",
      },
      {
        question: "Does the app work offline?",
        answer:
          "You can view your subscriptions offline, but adding or editing subscriptions requires an internet connection to sync with the cloud.",
      },
      {
        question: "Can I export my subscription data?",
        answer:
          "Data export functionality may be available in future updates. Currently, you can view all your subscriptions within the app.",
      },
      {
        question: "Does Renewly support dark mode?",
        answer:
          "Yes! Renewly supports both light and dark themes. The app automatically adapts to your device's system settings, or you can manually switch in Settings.",
      },
    ],
  },
  {
    category: "Troubleshooting",
    items: [
      {
        question: "The app isn't syncing my subscriptions. What should I do?",
        answer: (
          <div>
            <p className="mb-2">Try these steps:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Check your internet connection</li>
              <li>Make sure you're signed in to your account</li>
              <li>Force close the app and reopen it</li>
              <li>If the issue persists, sign out and sign back in</li>
            </ol>
          </div>
        ),
      },
      {
        question: "I'm not receiving notifications. How can I fix this?",
        answer: (
          <div>
            <p className="mb-2">Check the following:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Ensure notifications are enabled in the Renewly app settings
              </li>
              <li>
                Check your device settings to allow Renewly to send
                notifications
              </li>
              <li>
                Make sure Do Not Disturb mode is not enabled on your device
              </li>
              <li>Try uninstalling and reinstalling the app</li>
            </ul>
          </div>
        ),
      },
      {
        question: "The app keeps crashing. What should I do?",
        answer:
          "First, try restarting your device. If that doesn't work, uninstall and reinstall the app. Make sure you have the latest version from the app store. If problems persist, contact our support team.",
      },
      {
        question: "How do I contact support?",
        answer:
          "You can reach our support team through the 'Help & Support' section in the app settings, or email us directly at support@renewly.app. We typically respond within 24-48 hours.",
      },
    ],
  },
];

function FAQ() {
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
              <HelpCircle className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Renewly Mobile App FAQ</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <Smartphone className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about the Renewly mobile app. Can't
            find what you're looking for? Contact our support team.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {faqData.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="text-xl">{section.category}</CardTitle>
                <CardDescription>
                  Common questions about {section.category.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.items.map((item, itemIndex) => (
                    <AccordionItem
                      key={itemIndex}
                      value={`item-${sectionIndex}-${itemIndex}`}
                    >
                      <AccordionTrigger className="text-base">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Need Help Section */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>
              Can't find the answer you're looking for? Our support team is here
              to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button variant="default" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Mobile App
            </Button>
            <Button variant="outline">Contact Support</Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Renewly. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
