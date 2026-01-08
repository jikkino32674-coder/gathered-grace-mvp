import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import lavenderEyePillowImage from "@/assets/lavender-eye-pillow.png";
import lavenderPillowSingle from "@/assets/lavender-pillow-single.png";
import lavenderPillowVariety from "@/assets/lavender-pillow-variety.png";
import reflectKitEyepillowUse from "@/assets/reflect-kit-eyepillow-use.png";
import { STRIPE_PRODUCTS } from "@/config/stripe";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const LavenderEyePillowDetails = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [wantsCustomFabric, setWantsCustomFabric] = useState<string>("no");
  const [fabricTheme, setFabricTheme] = useState<string>("");
  
  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        handleCloseModal();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="container max-w-6xl mx-auto px-6 py-12">
          <Link 
            to="/" 
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div 
                className="aspect-square rounded-2xl overflow-hidden border border-border/60 shadow-soft cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => handleImageClick(lavenderEyePillowImage)}
              >
                <img 
                  src={lavenderEyePillowImage} 
                  alt="Handmade Lavender Eye Pillow"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className="aspect-square rounded-xl overflow-hidden border border-border/60 shadow-soft cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handleImageClick(lavenderPillowSingle)}
                >
                  <img 
                    src={lavenderPillowSingle} 
                    alt="Lavender Eye Pillow with instructions tag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="aspect-square rounded-xl overflow-hidden border border-border/60 shadow-soft cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handleImageClick(lavenderPillowVariety)}
                >
                  <img 
                    src={lavenderPillowVariety} 
                    alt="Lavender Eye Pillow fabric variety"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="aspect-square rounded-xl overflow-hidden border border-border/60 shadow-soft cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handleImageClick(reflectKitEyepillowUse)}
                >
                  <img 
                    src={reflectKitEyepillowUse} 
                    alt="Person relaxing with lavender eye pillow"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block text-sm text-gold border border-border/40 rounded-full px-4 py-1.5 mb-4">
                  In stock
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
                  Handmade Lavender Eye Pillow
                </h1>
                <p className="text-xl font-semibold text-foreground mb-6">
                  {STRIPE_PRODUCTS.LAVENDER_EYE_PILLOW.price}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  A soothing handmade eye pillow crafted with natural flax seed and dried lavender. Designed to ease tension and encourage calm, it can be gently warmed or cooled for comfort. Perfect for quiet moments of rest, reflection, or renewal — grace, gathered in every stitch.
                </p>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Do you want a custom themed fabric? (+$5)</Label>
                  <RadioGroup
                    value={wantsCustomFabric}
                    onValueChange={setWantsCustomFabric}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="fabric-no" />
                      <Label htmlFor="fabric-no" className="cursor-pointer">No, assorted is fine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="fabric-yes" />
                      <Label htmlFor="fabric-yes" className="cursor-pointer">Yes, custom theme</Label>
                    </div>
                  </RadioGroup>
                  
                  {wantsCustomFabric === "yes" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Label htmlFor="fabric-theme">Preferred fabric theme (e.g., birds, florals, sports)</Label>
                      <Textarea
                        id="fabric-theme"
                        placeholder="Describe your preferred fabric theme or pattern..."
                        value={fabricTheme}
                        onChange={(e) => setFabricTheme(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Sustainability:</strong> We prioritize environmental care by using reclaimed fabric scraps from sewing artisans—giving beautiful materials a second life.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button 
                  variant="rose" 
                  size="lg" 
                  className="flex-1"
                  onClick={() => {
                    const paymentLink = wantsCustomFabric === "yes" 
                      ? STRIPE_PRODUCTS.LAVENDER_EYE_PILLOW.customFabricPaymentLink 
                      : STRIPE_PRODUCTS.LAVENDER_EYE_PILLOW.paymentLink;
                    window.location.href = paymentLink;
                  }}
                >
                  Buy Now — {wantsCustomFabric === "yes" ? STRIPE_PRODUCTS.LAVENDER_EYE_PILLOW.customFabricPrice : STRIPE_PRODUCTS.LAVENDER_EYE_PILLOW.price}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={handleModalBackdropClick}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close image"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={selectedImage}
                alt="Full size view"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LavenderEyePillowDetails;
