import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import CustomCareForm from "@/components/CustomCareForm";
import DiscountPopup from "@/components/DiscountPopup";

import restKitImage from "@/assets/rest-kit.jpg";
import reflectKitImage from "@/assets/reflect-kit.jpg";
import restoreKitImage from "@/assets/restore-kit.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDiscountPopupOpen, setIsDiscountPopupOpen] = useState(false);

  // Auto-trigger discount popup after 3 seconds on first visit
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('discount_popup_seen');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsDiscountPopupOpen(true);
        localStorage.setItem('discount_popup_seen', 'true');
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const products = [
    {
      title: "🌿 Rest Kit",
      description: "A moment of ease. Includes a lavender eye pillow and soothing balm — a simple pairing to help quiet the mind and soften the day's edges.",
      price: "Coming soon",
      badge: "New",
      image: restKitImage,
    },
    {
      title: "✨ Reflect Kit",
      description: "For gentle pauses and personal moments. Includes a lavender eye pillow, soothing balm, and a notepad with pen — an invitation to unwind, breathe deeply, and put thoughts to paper.",
      price: "Coming soon",
      badge: "New",
      image: reflectKitImage,
    },
    {
      title: "💛 Restore Kit",
      description: "Grace, gathered in full. Includes a lavender eye pillow, soothing balm, notepad with pen, and a custom gift — a thoughtful collection to nurture body, heart, and spirit.",
      price: "Coming soon",
      badge: "New",
      image: restoreKitImage,
      onBuyClick: () => setIsFormOpen(true),
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

            <div className="grid md:grid-cols-3 gap-6">
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
      
      <CustomCareForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      <DiscountPopup open={isDiscountPopupOpen} onOpenChange={setIsDiscountPopupOpen} />
    </div>
  );
};

export default Index;
