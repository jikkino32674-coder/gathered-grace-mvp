import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addB2CLead } from "@/lib/firebase";

interface DiscountPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiscountPopup = ({ open, onOpenChange }: DiscountPopupProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setEmail("");
      setName("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get email from both state and form data
    const formData = new FormData(e.currentTarget);
    const formEmail = (formData.get('email') as string) || '';
    const formName = (formData.get('name') as string) || '';
    
    const trimmedEmail = (email || formEmail).trim();
    const trimmedName = (name || formName).trim();

    console.log('Discount popup submission:', { email, formEmail, trimmedEmail });

    // Validate email
    if (!trimmedEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, save to database
      const { data, error } = await addB2CLead({
        email: trimmedEmail,
        full_name: trimmedName || null,
        lead_type: 'discount_popup',
        source_page: window.location.href,
        website_type: 'b2c',
        metadata: {
          discount_code: 'WELCOME10',
          discount_percent: 10,
        },
      });

      if (error) {
        console.error('Error saving discount lead:', error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Discount popup lead saved successfully:', data);

        // Send the discount email
        try {
          const emailResponse = await fetch('/api/send-discount-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: trimmedEmail,
              name: trimmedName || undefined,
            }),
          });

          const emailResult = await emailResponse.json();

          if (!emailResponse.ok) {
            console.error('Error sending discount email:', emailResult);
            // Don't show error to user - they're still in the system
          } else {
            console.log('Discount email sent successfully:', emailResult);
          }
        } catch (emailError) {
          console.error('Error calling email API:', emailError);
          // Don't show error to user - they're still in the system
        }

        toast({
          title: "Welcome! 🎉",
          description: "Check your email for your 10% off code: WELCOME10",
        });
        onOpenChange(false);
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            Get 10% Off Your First Order
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Join our community and receive an exclusive discount code delivered straight to your inbox.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discount-name">Name (optional)</Label>
            <Input
              id="discount-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-email">Email*</Label>
            <Input
              id="discount-email"
              name="email"
              type="email"
              required
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Maybe Later
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Getting Code..." : "Get My Code"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            We'll send you your discount code and occasional updates. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;

