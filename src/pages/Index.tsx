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

import restReceiveImage from "@/assets/rest-receive-kit.jpg";
import lavenderEyePillowImage from "@/assets/lavender-eye-pillow.png";
import handmadeBalmImage from "@/assets/handmade-balm.png";
import journalPenImage from "@/assets/journal-pen.png";
import { STRIPE_PRODUCTS } from "@/config/stripe";

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
      title: "Gracefully Gathered Gift Box",
      description: "A meaningful way to mark any moment — joyful, healing, or simply in need of a little care. Includes lavender eye pillow, hardcover journal & pen, handmade unscented balm, heartfelt message card, and an intentionally chosen custom gift.",
      price: STRIPE_PRODUCTS.GATHERED_GRACE_GIFT_BOX.price,
      badge: "In stock",
      image: restReceiveImage,
      detailsLink: "/products/gathered-grace",
    },
    {
      title: "Handmade Lavender Eye Pillow",
      description: "A calming handmade eye pillow filled with flax seed and lavender — warm or cool for moments of gentle rest.",
      price: STRIPE_PRODUCTS.LAVENDER_EYE_PILLOW.price,
      badge: "In stock",
      image: lavenderEyePillowImage,
      detailsLink: "/products/lavender-eye-pillow",
    },
    {
      title: "Handmade Balm",
      description: "A soothing, all-purpose balm handcrafted with beeswax and natural oils — simple care, made with grace.",
      price: STRIPE_PRODUCTS.HANDMADE_BALM.price,
      badge: "In stock",
      image: handmadeBalmImage,
      detailsLink: "/products/handmade-balm",
    },
    {
      title: "Journal and Pen Set",
      description: "A timeless hardcover notebook and pen set — created for moments of reflection, gratitude, and quiet grace.",
      price: STRIPE_PRODUCTS.JOURNAL_PEN_SET.price,
      badge: "In stock",
      image: journalPenImage,
      detailsLink: "/products/journal-pen",
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
                  onBuyClick={
                    product.title === "Gracefully Gathered Gift Box" 
                      ? () => setIsFormOpen(true) 
                      : product.title === "Handmade Lavender Eye Pillow"
                      ? () => window.location.href = STRIPE_PRODUCTS.LAVENDER_EYE_PILLOW.paymentLink
                      : product.title === "Handmade Balm"
                      ? () => window.location.href = STRIPE_PRODUCTS.HANDMADE_BALM.paymentLink
                      : product.title === "Journal and Pen Set"
                      ? () => window.location.href = STRIPE_PRODUCTS.JOURNAL_PEN_SET.paymentLink
                      : undefined
                  }
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
