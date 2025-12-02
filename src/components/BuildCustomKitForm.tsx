import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

const initialFormData = {
  // Selected items
  items_eye_pillow: false,
  items_balm: false,
  items_journal: false,
  items_custom_gift: false,
  
  // Custom gift details
  custom_gift_details: "",
  
  // Custom fabric
  custom_fabric: "no",
  fabric_theme: "",
  
  // Recipient info
  recipient_name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  recipient_email: "",
  
  // About the custom gift
  occasion: "",
  occasion_other: "",
  comforts: "",
  custom_gift_budget: "",
  
  // Card message
  card_message: "",
  name_on_card: "Include my name",
  
  // Sender info
  sender_name: "",
  sender_email: "",
  
  // Special requests
  special_requests: "",
  
  // Honeypot
  website: "",
};

const BuildCustomKitForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // Reset form when component mounts (page loads/refreshes)
  useEffect(() => {
    setFormData(initialFormData);
    setShowSuccess(false);
    setError(false);
    setIsSubmitting(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.website) return;
    
    setIsSubmitting(true);
    setError(false);

    try {
      // Save to Supabase (optional - non-blocking)
      try {
        const supabaseResult = await supabase
          .from('b2c_leads')
          .insert({
            email: formData.sender_email.trim(),
            full_name: formData.sender_name.trim(),
            lead_type: 'build_custom_kit',
            source_page: window.location.href,
            website_type: 'b2c',
            metadata: {
              selected_items: {
                eye_pillow: formData.items_eye_pillow,
                balm: formData.items_balm,
                journal: formData.items_journal,
                custom_gift: formData.items_custom_gift,
              },
              custom_gift_details: formData.custom_gift_details || null,
              custom_fabric: formData.custom_fabric,
              fabric_theme: formData.fabric_theme || null,
              recipient_name: formData.recipient_name,
              recipient_email: formData.recipient_email || null,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
              occasion: formData.occasion === "Other" ? formData.occasion_other : formData.occasion,
              custom_gift_budget: formData.custom_gift_budget || null,
              comforts: formData.comforts || null,
              card_message: formData.card_message || null,
              name_on_card: formData.name_on_card,
              special_requests: formData.special_requests || null,
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

      // Submit to API endpoint (sends email)
      const apiEndpoint = import.meta.env.VITE_API_URL || '/api/submit-form';
      
      const payload = {
        ...formData,
        form_type: 'build_custom',
        occasion: formData.occasion === "Other" ? formData.occasion_other : formData.occasion,
        source_page: window.location.href,
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({ ok: false, error: 'Failed to parse response' }));

      if (response.ok && data.ok) {
        console.log('✅ Form submitted successfully');
        
        // If custom budget is selected, create a Stripe checkout session
        if (formData.custom_gift_budget && formData.items_custom_gift) {
          try {
            const checkoutEndpoint = '/api/create-checkout-session';
            
            // Calculate base price based on selected items
            let basePrice = 0;
            if (formData.items_eye_pillow) basePrice += 2200; // $22
            if (formData.items_balm) basePrice += 1500; // $15
            if (formData.items_journal) basePrice += 1800; // $18
            if (formData.custom_fabric === "yes") basePrice += 500; // $5
            
            const checkoutResponse = await fetch(checkoutEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                kitType: 'build_custom',
                basePrice: basePrice,
                customFabric: formData.custom_fabric === "yes",
                customBudget: formData.custom_gift_budget,
                items_eye_pillow: formData.items_eye_pillow,
                items_balm: formData.items_balm,
                items_journal: formData.items_journal,
                items_custom_gift: formData.items_custom_gift,
                formData: formData,
              }),
            });

            const checkoutData = await checkoutResponse.json().catch(() => ({ error: 'Failed to parse checkout response' }));

            if (checkoutResponse.ok && checkoutData.url) {
              // Redirect to Stripe checkout
              window.location.href = checkoutData.url;
              return;
            } else {
              console.warn('⚠️ Could not create checkout session, showing success message instead');
            }
          } catch (checkoutErr) {
            console.warn('⚠️ Error creating checkout session:', checkoutErr);
            // Continue to show success message even if checkout fails
          }
        }
        
        // Reset form data after successful submission
        setFormData(initialFormData);
        setShowSuccess(true);
      } else {
        console.error('Form submission error:', data);
        setError(true);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReturnHome = () => {
    window.location.href = "/";
  };

  if (showSuccess) {
    return (
      <Card className="p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Thank You!</h2>
        <p className="text-muted-foreground">
          We've received your custom kit request and will send you a personalized quote within 24-48 hours.
        </p>
        <Button onClick={handleReturnHome} className="mt-4">
          Return Home
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
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

      {/* Item Selection */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-xl mb-4">Select Your Items</h2>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="items_eye_pillow"
              checked={formData.items_eye_pillow}
              onCheckedChange={(checked) => updateField("items_eye_pillow", checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="items_eye_pillow" className="cursor-pointer font-medium">
                Lavender Eye Pillow
              </Label>
              <p className="text-sm text-muted-foreground">Handmade with cotton, dried lavender, and flax seeds</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="items_balm"
              checked={formData.items_balm}
              onCheckedChange={(checked) => updateField("items_balm", checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="items_balm" className="cursor-pointer font-medium">
                Handmade Balm
              </Label>
              <p className="text-sm text-muted-foreground">Unscented balm with jojoba oil, shea butter, and beeswax</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="items_journal"
              checked={formData.items_journal}
              onCheckedChange={(checked) => updateField("items_journal", checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="items_journal" className="cursor-pointer font-medium">
                Journal and Pen Set
              </Label>
              <p className="text-sm text-muted-foreground">Hardcover journal with quality pen</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="items_custom_gift"
              checked={formData.items_custom_gift}
              onCheckedChange={(checked) => updateField("items_custom_gift", checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="items_custom_gift" className="cursor-pointer font-medium">
                Custom Gift
              </Label>
              <p className="text-sm text-muted-foreground">A thoughtfully chosen gift personalized for the recipient</p>
            </div>
          </div>
        </div>

        {formData.items_custom_gift && (
          <div className="mt-4">
            <Label htmlFor="custom_gift_details">Tell us about the recipient and what kind of custom gift might suit them</Label>
            <Textarea
              id="custom_gift_details"
              rows={4}
              placeholder="Share their interests, hobbies, preferences, or anything that would help us choose the perfect gift..."
              value={formData.custom_gift_details}
              onChange={(e) => updateField("custom_gift_details", e.target.value)}
              className="mt-2"
            />
          </div>
        )}
      </Card>

      {/* Custom Fabric Option */}
      {formData.items_eye_pillow && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-xl mb-4">Eye Pillow Customization</h2>
          
          <div>
            <Label>Do you want a custom themed fabric for the eye pillow?</Label>
            <RadioGroup
              value={formData.custom_fabric}
              onValueChange={(value) => updateField("custom_fabric", value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="fabric-no" />
                <Label htmlFor="fabric-no" className="font-normal cursor-pointer">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="fabric-yes" />
                <Label htmlFor="fabric-yes" className="font-normal cursor-pointer">Yes (+$5)</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.custom_fabric === "yes" && (
            <div>
              <Label htmlFor="fabric_theme">What theme of fabric would you like?</Label>
              <Textarea
                id="fabric_theme"
                rows={2}
                placeholder="e.g., birds, florals, sports, etc."
                value={formData.fabric_theme}
                onChange={(e) => updateField("fabric_theme", e.target.value)}
                className="mt-2"
              />
            </div>
          )}
        </Card>
      )}

      {/* Recipient Information */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-xl mb-4">Recipient Information</h2>
        
        <div>
          <Label htmlFor="recipient_name">Recipient's Full Name*</Label>
          <Input
            id="recipient_name"
            required
            value={formData.recipient_name}
            onChange={(e) => updateField("recipient_name", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="address">Shipping Address*</Label>
          <Input
            id="address"
            required
            placeholder="Street address"
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_1fr] gap-4">
          <div>
            <Label htmlFor="city">City*</Label>
            <Input
              id="city"
              required
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="state">State*</Label>
            <Select value={formData.state} onValueChange={(value) => updateField("state", value)} required>
              <SelectTrigger id="state">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AL">AL</SelectItem>
                <SelectItem value="AK">AK</SelectItem>
                <SelectItem value="AZ">AZ</SelectItem>
                <SelectItem value="AR">AR</SelectItem>
                <SelectItem value="CA">CA</SelectItem>
                <SelectItem value="CO">CO</SelectItem>
                <SelectItem value="CT">CT</SelectItem>
                <SelectItem value="DE">DE</SelectItem>
                <SelectItem value="FL">FL</SelectItem>
                <SelectItem value="GA">GA</SelectItem>
                <SelectItem value="HI">HI</SelectItem>
                <SelectItem value="ID">ID</SelectItem>
                <SelectItem value="IL">IL</SelectItem>
                <SelectItem value="IN">IN</SelectItem>
                <SelectItem value="IA">IA</SelectItem>
                <SelectItem value="KS">KS</SelectItem>
                <SelectItem value="KY">KY</SelectItem>
                <SelectItem value="LA">LA</SelectItem>
                <SelectItem value="ME">ME</SelectItem>
                <SelectItem value="MD">MD</SelectItem>
                <SelectItem value="MA">MA</SelectItem>
                <SelectItem value="MI">MI</SelectItem>
                <SelectItem value="MN">MN</SelectItem>
                <SelectItem value="MS">MS</SelectItem>
                <SelectItem value="MO">MO</SelectItem>
                <SelectItem value="MT">MT</SelectItem>
                <SelectItem value="NE">NE</SelectItem>
                <SelectItem value="NV">NV</SelectItem>
                <SelectItem value="NH">NH</SelectItem>
                <SelectItem value="NJ">NJ</SelectItem>
                <SelectItem value="NM">NM</SelectItem>
                <SelectItem value="NY">NY</SelectItem>
                <SelectItem value="NC">NC</SelectItem>
                <SelectItem value="ND">ND</SelectItem>
                <SelectItem value="OH">OH</SelectItem>
                <SelectItem value="OK">OK</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
                <SelectItem value="PA">PA</SelectItem>
                <SelectItem value="RI">RI</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="SD">SD</SelectItem>
                <SelectItem value="TN">TN</SelectItem>
                <SelectItem value="TX">TX</SelectItem>
                <SelectItem value="UT">UT</SelectItem>
                <SelectItem value="VT">VT</SelectItem>
                <SelectItem value="VA">VA</SelectItem>
                <SelectItem value="WA">WA</SelectItem>
                <SelectItem value="WV">WV</SelectItem>
                <SelectItem value="WI">WI</SelectItem>
                <SelectItem value="WY">WY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="zip">ZIP*</Label>
            <Input
              id="zip"
              required
              pattern="\d{5}(-\d{4})?"
              value={formData.zip}
              onChange={(e) => updateField("zip", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="recipient_email">Recipient's Email (optional)</Label>
          <Input
            id="recipient_email"
            type="email"
            placeholder="For delivery updates only"
            value={formData.recipient_email}
            onChange={(e) => updateField("recipient_email", e.target.value)}
          />
        </div>
      </Card>

      {/* About the Custom Gift */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-xl mb-4">About the Custom Gift</h2>
        
        <div>
          <Label htmlFor="occasion">Occasion / Reason</Label>
          <Select value={formData.occasion} onValueChange={(value) => updateField("occasion", value)}>
            <SelectTrigger id="occasion">
              <SelectValue placeholder="Select..." />
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
              value={formData.occasion_other}
              onChange={(e) => updateField("occasion_other", e.target.value)}
            />
          </div>
        )}

        <div>
          <Label htmlFor="custom_gift_budget">Preferred budget for custom gift</Label>
          <Select value={formData.custom_gift_budget} onValueChange={(value) => updateField("custom_gift_budget", value)}>
            <SelectTrigger id="custom_gift_budget">
              <SelectValue placeholder="Select a budget range..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="$10-$20">$10 - $20</SelectItem>
              <SelectItem value="$20-$30">$20 - $30</SelectItem>
              <SelectItem value="$30-$50">$30 - $50</SelectItem>
              <SelectItem value="$50+">$50+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="comforts">What comforts or uplifts them most?</Label>
          <Textarea
            id="comforts"
            rows={3}
            placeholder="Lavender, music, journaling, cozy textures, time outdoors..."
            value={formData.comforts}
            onChange={(e) => updateField("comforts", e.target.value)}
          />
        </div>
      </Card>

      {/* Card Message */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-xl mb-4">Card Message</h2>
        
        <div>
          <Label htmlFor="card_message">Would you like to include a personal note inside the box?</Label>
          <Textarea
            id="card_message"
            rows={3}
            placeholder="Write your message here..."
            value={formData.card_message}
            onChange={(e) => updateField("card_message", e.target.value)}
          />
        </div>

        <div>
          <Label>Should your name appear on the card?</Label>
          <RadioGroup
            value={formData.name_on_card}
            onValueChange={(value) => updateField("name_on_card", value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Include my name" id="include-name" />
              <Label htmlFor="include-name" className="font-normal cursor-pointer">Include my name</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Remain anonymous" id="anonymous" />
              <Label htmlFor="anonymous" className="font-normal cursor-pointer">I'd like to remain anonymous</Label>
            </div>
          </RadioGroup>
        </div>
      </Card>

      {/* Your Information */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-xl mb-4">Your Information</h2>
        
        <div>
          <Label htmlFor="sender_name">Your Name*</Label>
          <Input
            id="sender_name"
            required
            value={formData.sender_name}
            onChange={(e) => updateField("sender_name", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="sender_email">Your Email*</Label>
          <Input
            id="sender_email"
            type="email"
            required
            value={formData.sender_email}
            onChange={(e) => updateField("sender_email", e.target.value)}
          />
        </div>
      </Card>

      {/* Special Requests */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-xl mb-4">Special Requests</h2>
        
        <div>
          <Label htmlFor="special_requests">Any additional notes or requests? (optional)</Label>
          <Textarea
            id="special_requests"
            rows={4}
            placeholder="Share any special instructions, preferences, or questions..."
            value={formData.special_requests}
            onChange={(e) => updateField("special_requests", e.target.value)}
          />
        </div>
      </Card>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded">
          There was an error submitting your request. Please try again.
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-w-[200px]"
          asChild
        >
          <Link to="/">Cancel</Link>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="min-w-[200px]"
        >
          {isSubmitting ? "Submitting..." : "Request Custom Quote"}
        </Button>
      </div>
    </form>
  );
};

export default BuildCustomKitForm;
