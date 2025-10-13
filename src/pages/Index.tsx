import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import restReceiveImage from "@/assets/rest-receive-kit.jpg";
import mendKitImage from "@/assets/mend-kit.jpg";
import grieveKitImage from "@/assets/grieve-kit.jpg";
import lavenderEyePillowImage from "@/assets/lavender-eye-pillow.png";

const Index = () => {
  const products = [
    {
      title: "Gathered Grace Gift Box",
      description: "Whether it's to celebrate, to comfort, or simply to remind someone they're loved, the Gracefully Gathered Gift Box offers a moment of grace. Each piece is chosen with intention — a lavender eye pillow for gentle rest, a hardcover journal and pen for reflection, a handmade unscented balm for soothing care, and a heartfelt message card — along with a carefully selected custom gift, chosen especially for the recipient. Gracefully gathered, given in love.",
      price: "$68",
      badge: "In stock",
      image: restReceiveImage,
    },
    {
      title: "Handmade Lavender Eye Pillow – Flax & Lavender for Gentle Rest",
      description: "A soothing handmade eye pillow crafted with natural flax seed and dried lavender. Designed to ease tension and encourage calm, it can be gently warmed or cooled for comfort. Perfect for quiet moments of rest, reflection, or renewal — grace, gathered in every stitch.",
      price: "$22",
      badge: "In stock",
      image: lavenderEyePillowImage,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <section 
          id="products" 
          className="container max-w-6xl mx-auto px-6 pb-8"
          aria-label="Products"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.title}
                {...product}
              />
            ))}
          </div>
        </section>

        <div className="container max-w-6xl mx-auto px-6">
          <ContactSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
