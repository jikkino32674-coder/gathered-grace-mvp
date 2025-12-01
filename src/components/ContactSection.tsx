import { Button } from "@/components/ui/button";
import { Instagram, Facebook } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="mt-8" aria-label="Contact">
      <div className="bg-card rounded-2xl shadow-soft border border-border/60 p-6 sm:p-8">
        <h3 className="text-2xl font-semibold mb-2">Have a question?</h3>
        <p className="text-muted-foreground mb-4">
          Email{" "}
          <a 
            href="mailto:gatheredgrace.giving@gmail.com" 
            className="text-accent hover:underline"
          >
            gatheredgrace.giving@gmail.com
          </a>{" "}
          or message us on social media.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            aria-label="Visit our Instagram"
            asChild
          >
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            aria-label="Visit our Facebook"
            asChild
          >
            <a href="https://www.facebook.com/GatheredGraceGifts/" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
