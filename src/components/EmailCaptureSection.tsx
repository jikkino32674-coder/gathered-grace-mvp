import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EmailCaptureSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for subscribing!",
      description: "You'll be the first to know about new releases.",
    });
    setEmail("");
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
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
};

export default EmailCaptureSection;
