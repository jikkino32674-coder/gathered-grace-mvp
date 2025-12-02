import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { STRIPE_PRODUCTS } from "@/config/stripe";

interface StandardKitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kitName: string;
  paymentLink: string;
  customFabricPaymentLink?: string;
}

const initialFormData = {
  recipient_name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  recipient_email: "",
  occasion: "",
  custom_fabric: "no",
  fabric_theme: "",
  card_message: "",
  name_on_card: "Include my name",
  sender_name: "",
  sender_email: "",
  website: "", // honeypot
};

const StandardKitForm = ({ open, onOpenChange, kitName, paymentLink, customFabricPaymentLink }: StandardKitFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setShowSuccess(false);
      setError(false);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.website) {
      console.warn('⚠️ Honeypot field filled - likely spam');
      return;
    }
    
    // Validate required fields
    if (!formData.recipient_name || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.sender_name || !formData.sender_email) {
      console.error('❌ Missing required fields');
      setError(true);
      alert('Please fill in all required fields (marked with *)');
      return;
    }
    
    setIsSubmitting(true);
    setError(false);
    console.log('📤 Submitting form...', { recipient_name: formData.recipient_name, sender_email: formData.sender_email });

    try {
      // Save to Supabase as B2C lead (optional - continue even if this fails)
      try {
        const supabaseResult = await supabase
          .from('b2c_leads')
          .insert({
            email: formData.sender_email.trim(),
            full_name: formData.sender_name.trim(),
            lead_type: `${kitName.toLowerCase()}_form`,
            source_page: window.location.href,
            website_type: 'b2c',
            metadata: {
              recipient_name: formData.recipient_name,
              recipient_email: formData.recipient_email || null,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
              occasion: formData.occasion || null,
              custom_fabric: formData.custom_fabric,
              fabric_theme: formData.fabric_theme || null,
              card_message: formData.card_message || null,
              name_on_card: formData.name_on_card,
              kit_type: kitName,
            },
          })
          .select();

        if (supabaseResult.error) {
          console.error('⚠️ Error saving to Supabase (non-blocking):', supabaseResult.error);
        } else {
          console.log('✅ Form data saved to Supabase database:', supabaseResult.data?.[0]?.id);
        }
      } catch (supabaseErr) {
        console.error('⚠️ Supabase error (non-blocking):', supabaseErr);
      }

      // Submit to Vercel API endpoint (sends email notification via Resend)
      const apiEndpoint = import.meta.env.VITE_API_URL || '/api/submit-form';
      
      const payload = {
        ...formData,
        kit_type: kitName,
        source_page: window.location.href,
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json().catch((parseErr) => {
        console.error('❌ Failed to parse JSON response:', parseErr);
        throw new Error('Invalid response from server');
      });

      console.log('📦 API Response data:', data);

      if (data.ok) {
        console.log('✅ Form submitted successfully');
        onOpenChange(false);
        // Redirect to Stripe payment link
        // If custom fabric is selected, use the custom fabric payment link
        const finalPaymentLink = formData.custom_fabric === "yes" && customFabricPaymentLink
          ? customFabricPaymentLink
          : paymentLink;
        console.log('🔗 Redirecting to:', finalPaymentLink);
        window.location.href = finalPaymentLink;
      } else {
        const errorMsg = data.error || data.message || 'Unknown error';
        console.error('❌ Form submission failed:', errorMsg);
        setError(true);
        alert(`Error: ${errorMsg}. Please try again or contact us directly.`);
      }
    } catch (err: any) {
      console.error('❌ Form submission error:', err);
      const errorMessage = err.message || 'Network error. Please check your internet connection and try again.';
      setError(true);
      alert(`Error submitting form: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Complete Your Order</DialogTitle>
          <DialogDescription>
            Tell us a little about the recipient and your preferences.
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Thank you!</h3>
            <p className="text-muted-foreground">
              We've received your request and will be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* Honeypot field */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => updateField("website", e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Recipient Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Recipient Information</h3>
              
              <div>
                <Label htmlFor="recipient_name">Recipient Name *</Label>
                <Input
                  id="recipient_name"
                  required
                  value={formData.recipient_name}
                  onChange={(e) => updateField("recipient_name", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
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
              </div>

              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  required
                  value={formData.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="recipient_email">Recipient Email (optional)</Label>
                <Input
                  id="recipient_email"
                  type="email"
                  value={formData.recipient_email}
                  onChange={(e) => updateField("recipient_email", e.target.value)}
                />
              </div>
            </div>

            {/* Occasion & Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Tell Us More</h3>
              
              <div>
                <Label htmlFor="occasion">What's the occasion? (optional)</Label>
                <Input
                  id="occasion"
                  placeholder="Birthday, get well, sympathy, etc."
                  value={formData.occasion}
                  onChange={(e) => updateField("occasion", e.target.value)}
                />
              </div>

              <div>
                <Label>Do you want a custom themed fabric for the eye pillow?</Label>
                <RadioGroup
                  value={formData.custom_fabric}
                  onValueChange={(value) => updateField("custom_fabric", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="fabric-no" />
                    <Label htmlFor="fabric-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="fabric-yes" />
                    <Label htmlFor="fabric-yes" className="font-normal cursor-pointer">
                      Yes (+$5)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.custom_fabric === "yes" && (
                <div>
                  <Label htmlFor="fabric_theme">What theme of fabric would you like?</Label>
                  <Textarea
                    id="fabric_theme"
                    placeholder="e.g., birds, florals, sports, etc."
                    value={formData.fabric_theme}
                    onChange={(e) => updateField("fabric_theme", e.target.value)}
                    rows={2}
                  />
                </div>
              )}
            </div>

            {/* Card Message */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Gift Card Message</h3>
              
              <div>
                <Label htmlFor="card_message">Your message (optional)</Label>
                <Textarea
                  id="card_message"
                  placeholder="Write a personal message..."
                  value={formData.card_message}
                  onChange={(e) => updateField("card_message", e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label>Include your name on the card?</Label>
                <RadioGroup
                  value={formData.name_on_card}
                  onValueChange={(value) => updateField("name_on_card", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Include my name" id="name-yes" />
                    <Label htmlFor="name-yes" className="font-normal cursor-pointer">
                      Include my name
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Keep it anonymous" id="name-no" />
                    <Label htmlFor="name-no" className="font-normal cursor-pointer">
                      Keep it anonymous
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Sender Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Your Information</h3>
              
              <div>
                <Label htmlFor="sender_name">Your Name *</Label>
                <Input
                  id="sender_name"
                  required
                  value={formData.sender_name}
                  onChange={(e) => updateField("sender_name", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="sender_email">Your Email *</Label>
                <Input
                  id="sender_email"
                  type="email"
                  required
                  value={formData.sender_email}
                  onChange={(e) => updateField("sender_email", e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded border border-destructive/20" role="alert">
                <strong>Error submitting form.</strong> Please check that all required fields are filled and try again. If the problem persists, please email us at gatheredgrace.giving@gmail.com
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Continue to Payment"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StandardKitForm;
