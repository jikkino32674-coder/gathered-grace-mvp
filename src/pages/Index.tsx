import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValuePropsSection from "@/components/ValuePropsSection";
import ProductCard from "@/components/ProductCard";
import HowItWorksSection from "@/components/HowItWorksSection";
import StorySection from "@/components/StorySection";
import FAQSection from "@/components/FAQSection";
import EmailCaptureSection from "@/components/EmailCaptureSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import restReceiveImage from "@/assets/rest-receive-kit.jpg";
import lavenderEyePillowImage from "@/assets/lavender-eye-pillow.png";

const Index = () => {
  const products = [
    {
      title: "Gracefully Gathered Gift Box",
      description: "A meaningful way to mark any moment — joyful, healing, or simply in need of a little care. Includes lavender eye pillow, hardcover journal & pen, handmade unscented balm, heartfelt message card, and an intentionally chosen custom gift.",
      price: "$68",
      badge: "In stock",
      image: restReceiveImage,
      detailsLink: "/products/gathered-grace",
    },
    {
      title: "Handmade Lavender Eye Pillow",
      description: "A calming handmade eye pillow filled with flax seed and lavender — warm or cool for moments of gentle rest.",
      price: "$22",
      badge: "In stock",
      image: lavenderEyePillowImage,
      detailsLink: "/products/lavender-eye-pillow",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <ValuePropsSection />
        
        <section id="products" className="py-16 md:py-20 bg-background" aria-label="Featured products">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-serif text-3xl text-foreground">Featured gifts</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.title}
                  {...product}
                />
              ))}
            </div>
          </div>
        </section>

        <HowItWorksSection />
        
        <StorySection />
        
        <FAQSection />
        
        <EmailCaptureSection />

        <div className="container max-w-6xl mx-auto px-6 py-8">
          <ContactSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
