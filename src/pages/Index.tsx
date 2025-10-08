import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import restReceiveImage from "@/assets/rest-receive-kit.jpg";
import mendKitImage from "@/assets/mend-kit.jpg";
import grieveKitImage from "@/assets/grieve-kit.jpg";

const Index = () => {
  const products = [
    {
      title: "Gracefully Gathered",
      description: "A thoughtfully curated care kit designed to comfort and uplift. Includes a lavender eye pillow for gentle rest, a hardcover journal and pen for reflection, handmade unscented balm for healing, and a heartfelt message card. Every detail is gathered with intention and given in love.",
      price: "$68",
      badge: "In stock",
      image: restReceiveImage,
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
