import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface CustomCareFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomCareForm = ({ open, onOpenChange }: CustomCareFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    recipient_email: "",
    occasion: "",
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
    setError(false);

    try {
      const ENDPOINT = "https://script.google.com/macros/s/AKfycby2zEiokF8aNFXZSOVaXNJFUEhUjqGHo-PEPgR-_ttQflwgwMiNeH86afPWhe13EuE1/exec";
      
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
        onOpenChange(false);
        navigate("/payment");
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartAnother = () => {
    setShowSuccess(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {!showSuccess ? (
          <>
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
              <Select value={formData.state} onValueChange={(value) => updateField("state", value)} required>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AL">Alabama</SelectItem>
                  <SelectItem value="AK">Alaska</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                  <SelectItem value="AR">Arkansas</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="CO">Colorado</SelectItem>
                  <SelectItem value="CT">Connecticut</SelectItem>
                  <SelectItem value="DE">Delaware</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="HI">Hawaii</SelectItem>
                  <SelectItem value="ID">Idaho</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="IN">Indiana</SelectItem>
                  <SelectItem value="IA">Iowa</SelectItem>
                  <SelectItem value="KS">Kansas</SelectItem>
                  <SelectItem value="KY">Kentucky</SelectItem>
                  <SelectItem value="LA">Louisiana</SelectItem>
                  <SelectItem value="ME">Maine</SelectItem>
                  <SelectItem value="MD">Maryland</SelectItem>
                  <SelectItem value="MA">Massachusetts</SelectItem>
                  <SelectItem value="MI">Michigan</SelectItem>
                  <SelectItem value="MN">Minnesota</SelectItem>
                  <SelectItem value="MS">Mississippi</SelectItem>
                  <SelectItem value="MO">Missouri</SelectItem>
                  <SelectItem value="MT">Montana</SelectItem>
                  <SelectItem value="NE">Nebraska</SelectItem>
                  <SelectItem value="NV">Nevada</SelectItem>
                  <SelectItem value="NH">New Hampshire</SelectItem>
                  <SelectItem value="NJ">New Jersey</SelectItem>
                  <SelectItem value="NM">New Mexico</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="NC">North Carolina</SelectItem>
                  <SelectItem value="ND">North Dakota</SelectItem>
                  <SelectItem value="OH">Ohio</SelectItem>
                  <SelectItem value="OK">Oklahoma</SelectItem>
                  <SelectItem value="OR">Oregon</SelectItem>
                  <SelectItem value="PA">Pennsylvania</SelectItem>
                  <SelectItem value="RI">Rhode Island</SelectItem>
                  <SelectItem value="SC">South Carolina</SelectItem>
                  <SelectItem value="SD">South Dakota</SelectItem>
                  <SelectItem value="TN">Tennessee</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="UT">Utah</SelectItem>
                  <SelectItem value="VT">Vermont</SelectItem>
                  <SelectItem value="VA">Virginia</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                  <SelectItem value="WV">West Virginia</SelectItem>
                  <SelectItem value="WI">Wisconsin</SelectItem>
                  <SelectItem value="WY">Wyoming</SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Preferred budget for additional custom gift*</Label>
              <RadioGroup value={formData.budget} onValueChange={(value) => updateField("budget", value)} required>
                <div className="flex flex-wrap gap-2">
                  <Label className="flex items-center gap-2 border border-border rounded-full px-4 py-2 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="No custom gift" id="budget-none" />
                    <span>No custom gift</span>
                  </Label>
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
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="rose" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send my details and proceed to payment"}
              </Button>
            </div>
            {!isSubmitting && (
              <p className="text-sm text-muted-foreground text-center">
                We'll only use contact details for this gift. Never for marketing.
              </p>
            )}
            {error && (
              <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-lg" role="alert">
                Hmm, something went wrong submitting the form. Please try again, or email us directly.
              </div>
            )}
          </div>
        </form>
          </>
        ) : (
          <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-primary animate-in zoom-in duration-500">
              <Check className="w-12 h-12" strokeWidth={3} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Details received with care.</h3>
            <p className="text-muted-foreground mb-6">
              We'll begin curating your Gathered Grace gift and reach out if any clarification is needed. 💛
            </p>
            <Button variant="outline" onClick={handleStartAnother}>
              Start another submission
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomCareForm;
