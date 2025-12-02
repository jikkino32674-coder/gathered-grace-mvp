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
import reflectKitBox from "@/assets/reflect-kit-box.png";
import reflectKitEyepillowUse from "@/assets/reflect-kit-eyepillow-use.png";
import reflectKitNotebook from "@/assets/reflect-kit-notebook.jpg";
import handmadeBalm from "@/assets/handmade-balm.png";
import lavenderEyePillow from "@/assets/lavender-eye-pillow.png";
import lavenderPillowWrapped from "@/assets/lavender-pillow-wrapped.png";
import journalPen from "@/assets/journal-pen.png";

const ReflectKitDetails = () => {
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
                      src={reflectKitBox} 
                      alt="Reflect Kit gift box with lavender eye pillow, balm, notebook, and pen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={reflectKitEyepillowUse} 
                      alt="Person relaxing with lavender eye pillow" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={reflectKitNotebook} 
                      alt="Blue notebook with pen, coffee, and lavender on cozy blanket" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={handmadeBalm} 
                      alt="Handmade balm with natural ingredients in green container" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={lavenderPillowWrapped} 
                      alt="Wrapped lavender eye pillow with twine" 
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
              <h1 className="text-4xl font-serif mb-2">✨ Reflect Kit</h1>
              <p className="text-2xl font-semibold">$49</p>
              <p className="text-lg italic text-muted-foreground mt-2">For gentle pauses and personal moments.</p>
            </div>

            <div className="space-y-4">
              <p className="text-lg">
                Includes a lavender eye pillow, soothing balm, notepad, and pen — an invitation to unwind, breathe deeply, and put thoughts to paper.
              </p>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Perfect for:</p>
                <p className="text-muted-foreground">
                  Journaling, reflection, or nurturing mindfulness.
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
                <p className="text-muted-foreground mb-2">
                  <strong>Balm:</strong> Made using jojoba oil, shea butter, and beeswax.
                </p>
                <p className="text-muted-foreground">
                  <strong>Notebook and Pen:</strong> Hardcover notebook with lay flat design, perfect for journaling and reflection. Includes a quality pen.
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
        kitName="Reflect Kit"
        paymentLink={STRIPE_PRODUCTS.REFLECT_KIT.paymentLink}
        customFabricPaymentLink={STRIPE_PRODUCTS.REFLECT_KIT.customFabricPaymentLink}
      />
    </div>
  );
};

export default ReflectKitDetails;
