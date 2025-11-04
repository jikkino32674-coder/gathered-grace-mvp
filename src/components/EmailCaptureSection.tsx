import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const EmailCaptureSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        toast({
          title: "Thank you for subscribing!",
          description: "You'll be the first to know about new releases.",
        });
        setEmail("");
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
        <h2 className="font-serif text-2xl text-foreground">Be the first to know</h2>
        <p className="mt-2 text-muted-foreground">
          Occasional notes with new releases and restocks — no spam.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex max-w-md mx-auto gap-2">
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
        </form>
      </div>
    </section>
  );
};

export default EmailCaptureSection;
