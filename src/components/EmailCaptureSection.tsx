import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Heart, CheckCircle } from "lucide-react";

const EmailCaptureSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get email from both state and form data
    const formData = new FormData(e.currentTarget);
    const formEmail = (formData.get('email') as string) || '';
    const trimmedEmail = (email || formEmail).trim();
    
    console.log('Email signup submission:', { email, formEmail, trimmedEmail });
    
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

    console.log('Submitting email signup:', trimmedEmail);

    try {
      const { data, error } = await supabase
        .from('b2c_leads')
        .insert({
          email: trimmedEmail,
          lead_type: 'email_signup',
          source_page: window.location.href,
          website_type: 'b2c',
        })
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Error saving email:', error);
        toast({
          title: "Error",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Email signup saved successfully:', data);
        setShowSuccess(true);
        toast({
          title: "Thank you for subscribing!",
          description: "You'll be the first to know about new releases.",
        });
        setEmail("");
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
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
    <section className="py-16 bg-card" aria-label="Newsletter signup">
      <div className="container max-w-3xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-4">
          <Heart className="w-6 h-6 text-primary/40 animate-pulse" />
        </div>
        <h2 className="font-serif text-2xl text-foreground">Stay connected with us</h2>
        <p className="mt-2 text-muted-foreground">
          Receive occasional notes from Gathered Grace about new products, gentle reminders for self-care, and thoughtful inspiration for gifting — no spam, just warmth.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex max-w-md mx-auto gap-2">
          {showSuccess ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-2 text-primary animate-scale-in">
              <CheckCircle className="w-5 h-5 animate-scale-in" />
              <span className="font-medium">Successfully subscribed!</span>
            </div>
          ) : (
            <>
              <Input
                name="email"
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default EmailCaptureSection;
