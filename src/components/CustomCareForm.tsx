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
import { addB2CLead } from "@/lib/firebase";
import { STRIPE_PRODUCTS } from "@/config/stripe";

interface CustomCareFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialFormData = {
  recipient_name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  recipient_email: "",
  occasion: "",
  comforts: "",
  card_message: "",
  name_on_card: "Include my name",
  budget: "",
  custom_fabric: "no",
  fabric_theme: "",
  sender_name: "",
  sender_email: "",
  website: "", // honeypot
};

const CustomCareForm = ({ open, onOpenChange }: CustomCareFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setShowSuccess(false);
      setError(false);
      setIsSubmitting(false);
      setRedirectUrl(null);
      setIsRedirecting(false);
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
    if (!formData.recipient_name || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.sender_name || !formData.sender_email || !formData.budget) {
      console.error('❌ Missing required fields');
      setError(true);
      alert('Please fill in all required fields (marked with *), including the budget selection.');
      return;
    }
    
    setIsSubmitting(true);
    setError(false);
    console.log('📤 Submitting form...', { recipient_name: formData.recipient_name, sender_email: formData.sender_email });

    try {
      // Save to Firestore as B2C lead (optional - continue even if this fails)
      try {
        const firestoreResult = await addB2CLead({
          email: formData.sender_email.trim(),
          full_name: formData.sender_name.trim(),
          lead_type: 'custom_care_form',
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
            comforts: formData.comforts || null,
            card_message: formData.card_message || null,
            name_on_card: formData.name_on_card,
            budget: formData.budget || null,
            custom_fabric: formData.custom_fabric,
            fabric_theme: formData.fabric_theme || null,
          },
        });

        if (firestoreResult.error) {
          console.error('⚠️ Error saving to Firestore (non-blocking):', firestoreResult.error);
        } else {
          console.log('✅ Form data saved to Firestore database:', firestoreResult.data?.id);
        }
      } catch (firestoreErr) {
        console.error('⚠️ Firestore error (non-blocking):', firestoreErr);
      }

      // Submit to Vercel API endpoint (sends email notification via Resend)
      const apiEndpoint = import.meta.env.VITE_API_URL || '/api/submit-form';
      
      const payload = {
        ...formData,
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
        
        // Create dynamic Stripe checkout session with budget added
        try {
          const checkoutEndpoint = '/api/create-checkout-session';
          
          console.log('💳 Creating Restore Kit checkout session');
          console.log('   Budget selected:', formData.budget);
          console.log('   Custom fabric:', formData.custom_fabric);
          
          const checkoutResponse = await fetch(checkoutEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kitType: 'restore',
              customFabric: formData.custom_fabric === "yes",
              customBudget: formData.budget, // $10, $20, $40, $50, $75, $100+
              formData: formData,
            }),
          });

          console.log('💳 Checkout response status:', checkoutResponse.status);

          if (!checkoutResponse.ok) {
            const checkoutErrorText = await checkoutResponse.text().catch(() => 'Unknown error');
            console.error('❌ Checkout API Error:', checkoutErrorText);
            throw new Error(`Checkout error: ${checkoutResponse.status} - ${checkoutErrorText}`);
          }

          const checkoutData = await checkoutResponse.json().catch((parseErr) => {
            console.error('❌ Failed to parse checkout response:', parseErr);
            throw new Error('Invalid checkout response');
          });

          console.log('💳 Checkout data:', checkoutData);

          if (checkoutData.url) {
            console.log('🔗 Redirecting to Stripe checkout:', checkoutData.url);
            const stripeUrl = checkoutData.url;
            
            // Store URL for fallback and show redirecting state
            setRedirectUrl(stripeUrl);
            setIsRedirecting(true);
            setIsSubmitting(false);
            
            // Use setTimeout to ensure redirect happens after state updates
            // This helps with Chromebook and other strict browser policies
            setTimeout(() => {
              try {
                console.log('🔗 Attempting redirect with window.location.assign...');
                window.location.assign(stripeUrl);
              } catch (redirectErr) {
                console.error('⚠️ Redirect failed, fallback link available:', redirectErr);
              }
            }, 150);
            return;
          } else {
            throw new Error('No checkout URL returned');
          }
        } catch (checkoutErr: any) {
          console.error('⚠️ Error creating checkout session:', checkoutErr);
          const errorMsg = checkoutErr.message || 'Could not create checkout session';
          alert(`Error creating checkout: ${errorMsg}. Your form was submitted successfully - we'll contact you with payment details.`);
          onOpenChange(false);
          setShowSuccess(true);
        }
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

  const handleStartAnother = () => {
    setShowSuccess(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isRedirecting && redirectUrl ? (
          <div className="text-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg font-medium">Redirecting to payment...</p>
            <p className="text-sm text-muted-foreground">
              If you're not redirected automatically,{" "}
              <a 
                href={redirectUrl} 
                className="text-primary underline hover:text-primary/80"
                onClick={() => console.log('🔗 Manual redirect clicked')}
              >
                click here to continue to payment
              </a>
            </p>
          </div>
        ) : !showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Gathered Grace — Custom Care Gift</DialogTitle>
              <DialogDescription>
                Let's create something special. Share a few details so we can curate a gift that feels personal and meaningful.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
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

            <div className="space-y-2">
              <Label>Do you want a custom themed fabric for the eye pillow?</Label>
              <RadioGroup value={formData.custom_fabric} onValueChange={(value) => updateField("custom_fabric", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="fabric-no" />
                  <Label htmlFor="fabric-no" className="font-normal">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="fabric-yes" />
                  <Label htmlFor="fabric-yes" className="font-normal">Yes (+$5)</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.custom_fabric === "yes" && (
              <div>
                <Label htmlFor="fabric_theme">What theme of fabric would you like?</Label>
                <Textarea
                  id="fabric_theme"
                  name="fabric_theme"
                  rows={2}
                  placeholder="e.g., birds, florals, sports, etc."
                  value={formData.fabric_theme}
                  onChange={(e) => updateField("fabric_theme", e.target.value)}
                />
              </div>
            )}
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
              <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20" role="alert">
                <strong>Error submitting form.</strong> Please check that all required fields are filled (including budget selection) and try again. If the problem persists, please email us at gatheredgrace.giving@gmail.com
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
