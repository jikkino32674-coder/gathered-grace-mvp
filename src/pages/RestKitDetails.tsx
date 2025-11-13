import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RestKitDetails = () => {
  const navigate = useNavigate();

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
            <div className="bg-muted rounded-lg aspect-square flex items-center justify-center">
              <p className="text-muted-foreground">Product photos coming soon</p>
            </div>
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
              onClick={() => navigate("/payment")}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestKitDetails;
