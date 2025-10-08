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
      title: "Rest & Receive Kit",
      description: "A gentle, restorative kit for quiet moments: lavender eye pillow, hard journal and pen, and a message card.",
      price: "$58",
      badge: "In stock",
      image: restReceiveImage,
    },
    {
      title: "Mend Kit",
      description: "Support for physical healing—heat/cold lavender eye pillow, handmade unscented balm, and a hopeful message card.",
      price: "$64",
      badge: "Ships in 2–3 days",
      image: mendKitImage,
    },
    {
      title: "Custom Care Kit",
      description: "A personalized care kit curated to comfort and uplift. Includes a lavender eye pillow, a hardcover journal and pen, and a meaningful custom gift chosen specifically for the recipient. Every detail is gathered with intention and given in love.",
      price: "$62",
      badge: "Limited",
      image: grieveKitImage,
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
