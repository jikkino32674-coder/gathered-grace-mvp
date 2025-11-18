import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StandardKitForm from "@/components/StandardKitForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { STRIPE_PRODUCTS } from "@/config/stripe";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import restKitBalm from "@/assets/rest-kit-balm.png";
import restKitEyePillows from "@/assets/rest-kit-eye-pillows.png";
import restKitPillowWrapped from "@/assets/rest-kit-pillow-wrapped.png";
import restKitBoxed from "@/assets/rest-kit-boxed.jpg";
import restKitBoxContents from "@/assets/rest-kit-box-contents.png";

const RestKitDetails = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);

  const handleBackClick = () => {
    navigate("/#products");
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to kits
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={restKitBalm} 
                      alt="Handmade balm with natural ingredients in green container" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={restKitEyePillows} 
                      alt="Lavender eye pillows with floral pattern" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={restKitPillowWrapped} 
                      alt="Wrapped lavender eye pillow with twine" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={restKitBoxed} 
                      alt="Rest Kit beautifully packaged in a gift box" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={restKitBoxContents} 
                      alt="Rest Kit contents showing balm and lavender eye pillow in box" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif mb-2">🌿 Rest Kit</h1>
              <p className="text-2xl font-semibold">$39</p>
              <p className="text-lg italic text-muted-foreground mt-2">A moment of ease.</p>
            </div>

            <div className="space-y-4">
              <p className="text-lg">
                Includes a lavender eye pillow and soothing balm — a simple duo to ease tension and invite calm.
              </p>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Perfect for:</p>
                <p className="text-muted-foreground">
                  Quiet evenings, gentle self-care, or a thoughtful "thinking of you" gift.
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Product Description:</p>
                <p className="text-muted-foreground mb-2">
                  <strong>Lavender Eye Pillow:</strong> Made with cotton and includes dried lavender and whole flax seeds.
                </p>
                <div className="ml-4 space-y-2 mb-2">
                  <p className="text-muted-foreground">
                    <strong>Fabric Options:</strong> Eye pillows are premade in assorted fabrics. If you'd like us to choose a fabric within a specific theme (such as birds, florals, or sports), a custom selection is available for an additional $5. Please include your preferred fabric or print in the Notes section of the custom form.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Sustainability:</strong> We prioritize environmental care by using reclaimed fabric scraps from sewing artisans—giving beautiful materials a second life.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  <strong>Balm:</strong> Made using jojoba oil, shea butter, and beeswax.
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Complimentary U.S. shipping included.</strong>
                </p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full md:w-auto"
              onClick={() => setFormOpen(true)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <StandardKitForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        kitName="Rest Kit"
        paymentLink={STRIPE_PRODUCTS.REST_KIT.paymentLink}
      />
    </div>
  );
};

export default RestKitDetails;
