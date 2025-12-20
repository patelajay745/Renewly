import {createFileRoute} from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  HelpCircle,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import {Link} from "@tanstack/react-router";
import {useState} from "react";

export const Route = createFileRoute("/support")({
  component: Support,
});

function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Support form submitted:", formData);
    
  };

  return (
    <div className="min-h-screen bg-background">
      
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Support</h1>
            </div>
          </div>
        </div>
      </header>

      
      <div className="bg-linear-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-3">How can we help you?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get in touch with our support team. We're here to help with any
            questions or issues you might have.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
       
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get Support</h3>
              <div className="space-y-4">
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">Email Support</CardTitle>
                        <CardDescription className="mt-1">
                          Send us an email and we'll get back to you
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="mailto:patel.ajay745@gmail.com"
                      className="text-primary hover:underline font-medium"
                    >
                      patel.ajay745@gmail.com
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">
                      Response time: 24-48 hours
                    </p>
                  </CardContent>
                </Card>

               
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <HelpCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          Frequently Asked Questions
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Find answers to common questions
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to="/faq">
                      <Button variant="outline" className="w-full">
                        Browse FAQ
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

               
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">Documentation</CardTitle>
                        <CardDescription className="mt-1">
                          Learn how to use Renewly features
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive guides and tutorials coming soon
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Support Hours</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monday - Friday
                    </span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weekend</span>
                    <span className="font-medium">Limited Support</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  We aim to respond to all inquiries within 24-48 hours during
                  business days.
                </p>
              </CardContent>
            </Card>
          </div>

          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe your issue or question in detail..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Send Message
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>

            
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Join Our Community</CardTitle>
                </div>
                <CardDescription>
                  Connect with other Renewly users and share tips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our community forums to ask questions, share experiences,
                  and get help from other users.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Common Issues</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Login Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Having trouble signing in? Try resetting your password or
                  check your internet connection.
                </p>
                <Link to="/faq">
                  <Button variant="link" className="p-0">
                    Learn more →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sync Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Subscriptions not syncing? Make sure you're connected to the
                  internet and signed in.
                </p>
                <Link to="/faq">
                  <Button variant="link" className="p-0">
                    Learn more →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Not receiving reminders? Check your notification settings in
                  both the app and your device.
                </p>
                <Link to="/faq">
                  <Button variant="link" className="p-0">
                    Learn more →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    
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
              <Link to="/faq" className="hover:text-primary">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
