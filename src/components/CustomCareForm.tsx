import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CustomCareFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomCareForm = ({ open, onOpenChange }: CustomCareFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    recipient_email: "",
    occasion: "",
    occasion_other: "",
    season: "",
    comforts: "",
    card_message: "",
    name_on_card: "Include my name",
    budget: "",
    sender_name: "",
    sender_email: "",
    website: "", // honeypot
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.website) return;
    
    setIsSubmitting(true);

    try {
      // Replace with your actual endpoint
      const ENDPOINT = "YOUR_WEB_APP_URL";
      
      const payload = {
        ...formData,
        source_page: window.location.href,
      };

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({ ok: false }));

      if (response.ok && data.ok) {
        toast({
          title: "Thank you!",
          description: "Your details have been received with care. We'll begin curating your Gathered Grace gift and reach out if we need any clarification. 💛",
        });
        setFormData({
          recipient_name: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          recipient_email: "",
          occasion: "",
          occasion_other: "",
          season: "",
          comforts: "",
          card_message: "",
          name_on_card: "Include my name",
          budget: "",
          sender_name: "",
          sender_email: "",
          website: "",
        });
        onOpenChange(false);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again, or email us directly at gatheredgrace.giving@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Gathered Grace — Custom Care Gift</DialogTitle>
          <DialogDescription>
            Let's create something special. Share a few details so we can curate a gift that feels personal and meaningful.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Details */}
          <fieldset className="space-y-4">
            <legend className="font-semibold text-lg mb-2">Recipient Details</legend>

            <div>
              <Label htmlFor="recipient_name">Recipient's Full Name*</Label>
              <Input
                id="recipient_name"
                name="recipient_name"
                required
                value={formData.recipient_name}
                onChange={(e) => updateField("recipient_name", e.target.value)}
                autoComplete="name"
              />
            </div>

            <div>
              <Label htmlFor="address">Shipping Address*</Label>
              <Input
                id="address"
                name="address"
                required
                placeholder="Street address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                autoComplete="address-line1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_1fr] gap-4">
              <div>
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <Label htmlFor="state">State*</Label>
                <Input
                  id="state"
                  name="state"
                  required
                  maxLength={2}
                  placeholder="NE"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value.toUpperCase())}
                  autoComplete="address-level1"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP*</Label>
                <Input
                  id="zip"
                  name="zip"
                  required
                  pattern="\d{5}(-\d{4})?"
                  value={formData.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="recipient_email">Recipient's Email (optional)</Label>
              <Input
                id="recipient_email"
                name="recipient_email"
                type="email"
                placeholder="For delivery updates only"
                value={formData.recipient_email}
                onChange={(e) => updateField("recipient_email", e.target.value)}
                autoComplete="email"
              />
            </div>
          </fieldset>

          {/* About the Recipient */}
          <fieldset className="space-y-4">
            <legend className="font-semibold text-lg mb-2">About the Recipient</legend>

            <div>
              <Label htmlFor="occasion">Occasion / Reason</Label>
              <Select value={formData.occasion} onValueChange={(value) => updateField("occasion", value)}>
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recovery">Recovery</SelectItem>
                  <SelectItem value="Grief">Grief</SelectItem>
                  <SelectItem value="Encouragement">Encouragement</SelectItem>
                  <SelectItem value="Celebration">Celebration</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.occasion === "Other" && (
              <div>
                <Label htmlFor="occasion_other">Please specify the occasion</Label>
                <Input
                  id="occasion_other"
                  name="occasion_other"
                  placeholder="Enter the occasion or reason"
                  value={formData.occasion_other}
                  onChange={(e) => updateField("occasion_other", e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="season">How would you describe their current season or situation?</Label>
              <Textarea
                id="season"
                name="season"
                rows={3}
                placeholder="She's recovering from surgery and feeling a little discouraged."
                value={formData.season}
                onChange={(e) => updateField("season", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="comforts">What comforts or uplifts them most?</Label>
              <Textarea
                id="comforts"
                name="comforts"
                rows={3}
                placeholder="Lavender, music, journaling, cozy textures, time outdoors…"
                value={formData.comforts}
                onChange={(e) => updateField("comforts", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="card_message">Would you like to include a personal note inside the box?</Label>
              <Textarea
                id="card_message"
                name="card_message"
                rows={3}
                placeholder="Write your message here…"
                value={formData.card_message}
                onChange={(e) => updateField("card_message", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Should your name appear on the card?</Label>
              <RadioGroup value={formData.name_on_card} onValueChange={(value) => updateField("name_on_card", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Include my name" id="include-name" />
                  <Label htmlFor="include-name" className="font-normal">Include my name</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Remain anonymous" id="anonymous" />
                  <Label htmlFor="anonymous" className="font-normal">I'd like to remain anonymous</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Preferred Budget for Additional Custom Gift*</Label>
              <RadioGroup value={formData.budget} onValueChange={(value) => updateField("budget", value)} required>
                <div className="flex flex-wrap gap-2">
                  <Label className="flex items-center gap-2 border border-border rounded-full px-4 py-2 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="$10" id="budget-10" />
                    <span>$10</span>
                  </Label>
                  <Label className="flex items-center gap-2 border border-border rounded-full px-4 py-2 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="$20" id="budget-20" />
                    <span>$20</span>
                  </Label>
                  <Label className="flex items-center gap-2 border border-border rounded-full px-4 py-2 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="$40" id="budget-40" />
                    <span>$40</span>
                  </Label>
                  <Label className="flex items-center gap-2 border border-border rounded-full px-4 py-2 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="$50" id="budget-50" />
                    <span>$50</span>
                  </Label>
                  <Label className="flex items-center gap-2 border border-border rounded-full px-4 py-2 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="$75" id="budget-75" />
                    <span>$75</span>
                  </Label>
                  <Label className="flex items-center gap-2 border border-border rounded-full px-4 py-2 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="$100+" id="budget-100" />
                    <span>$100+</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </fieldset>

          {/* Sender Info */}
          <fieldset className="space-y-4">
            <legend className="font-semibold text-lg mb-2">Your Information</legend>

            <div>
              <Label htmlFor="sender_name">Your Name*</Label>
              <Input
                id="sender_name"
                name="sender_name"
                required
                value={formData.sender_name}
                onChange={(e) => updateField("sender_name", e.target.value)}
                autoComplete="name"
              />
            </div>

            <div>
              <Label htmlFor="sender_email">Your Email*</Label>
              <Input
                id="sender_email"
                name="sender_email"
                type="email"
                required
                value={formData.sender_email}
                onChange={(e) => updateField("sender_email", e.target.value)}
                autoComplete="email"
              />
            </div>
          </fieldset>

          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={(e) => updateField("website", e.target.value)}
            className="absolute left-[-9999px]"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="space-y-3">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Send My Details"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              We'll only use contact details for this gift. Never for marketing.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomCareForm;
