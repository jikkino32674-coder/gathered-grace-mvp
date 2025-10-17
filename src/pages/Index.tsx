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
      description: "A curated gift box for any occasion — filled with soothing essentials and an intentionally custom piece chosen just for them.",
      price: "$68",
      badge: "In stock",
      image: restReceiveImage,
      detailsLink: "/products/gathered-grace",
    },
    {
      title: "Handmade Lavender Eye Pillow",
      description: "A soothing handmade eye pillow crafted with natural flax seed and dried lavender. Designed to ease tension and encourage calm, it can be gently warmed or cooled for comfort. Perfect for quiet moments of rest, reflection, or renewal — grace, gathered in every stitch.",
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
