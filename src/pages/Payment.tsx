import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Payment = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="font-serif text-3xl">Details Received</CardTitle>
              <CardDescription className="text-base">
                Thank you for sharing your gift details with us. We've received your information and will begin curating a special Gathered Grace gift.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Next Steps</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>We'll review your details and begin curating the perfect gift</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You'll receive a payment link via email within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Once payment is received, we'll ship your gift with care</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>We'll reach out if we need any clarification</span>
                  </li>
                </ul>
              </div>

              <div className="text-center space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Questions? Email us at{" "}
                  <a href="mailto:hello@gatheredgrace.com" className="text-primary hover:underline">
                    hello@gatheredgrace.com
                  </a>
                </p>
                <Link to="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
