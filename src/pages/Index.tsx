import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

import ProductCard from "@/components/ProductCard";
import HowItWorksSection from "@/components/HowItWorksSection";
import StorySection from "@/components/StorySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import EmailCaptureSection from "@/components/EmailCaptureSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CustomCareForm from "@/components/CustomCareForm";
import DiscountPopup from "@/components/DiscountPopup";

import restKitImage from "@/assets/rest-kit.jpg";
import reflectKitImage from "@/assets/reflect-kit.jpg";
import restoreKitImage from "@/assets/restore-kit.jpg";
import lavenderEyePillowImage from "@/assets/lavender-eye-pillow.png";
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

  const kits = [
    {
      emoji: "🌿",
      title: "Rest Kit",
      price: "$39",
      tagline: "A moment of ease.",
      description: "Includes a lavender eye pillow and soothing balm — a simple duo to ease tension and invite calm.",
      perfectFor: "quiet evenings, gentle self-care, or a thoughtful \"thinking of you\" gift.",
      href: "/products/rest-kit",
      bgColor: "#e8f0e8",
      borderColor: "#d0ddd0",
    },
    {
      emoji: "✨",
      title: "Reflect Kit",
      price: "$49",
      tagline: "For gentle pauses and personal moments.",
      description: "Includes a lavender eye pillow, soothing balm, notepad, and pen — an invitation to unwind, breathe deeply, and put thoughts to paper.",
      perfectFor: "journaling, reflection, or nurturing mindfulness.",
      href: "/products/reflect-kit",
      bgColor: "#e8f0e8",
      borderColor: "#d0ddd0",
    },
    {
      emoji: "💛",
      title: "Restore Kit",
      price: "starting at $69",
      tagline: "Grace, gathered in full.",
      description: "Includes a lavender eye pillow, soothing balm, notepad, pen, and a custom gift — a complete collection to nurture rest and renewal.",
      perfectFor: "meaningful care, recovery, or special occasions.",
      href: "/products/restore-kit",
      bgColor: "#e8f0e8",
      borderColor: "#d0ddd0",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <HowItWorksSection />
        
        <section id="products" className="py-16 md:py-20 bg-background" aria-label="Gathered Grace Kits" style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
          <header style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '28px', letterSpacing: '.2px' }} className="font-serif">Gathered Grace Kits</h2>
            <p style={{ margin: 0, opacity: .85 }}>Choose the level of care that feels right. Each kit is mindfully assembled and ships beautifully packaged — <strong>complimentary U.S. shipping included.</strong></p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="gg-grid">
            {kits.map((kit) => (
              <article 
                key={kit.title}
                className="relative group rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-foreground/20"
                style={{ 
                  background: kit.bgColor, 
                  border: `1px solid ${kit.borderColor}`, 
                }}
              >
                <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>
                  <span aria-hidden="true">{kit.emoji} </span>
                  <strong>{kit.title} — {kit.price}</strong>
                </h3>
                <em style={{ display: 'block', margin: '0 0 10px', opacity: .8 }}>{kit.tagline}</em>
                <p style={{ margin: '0 0 16px' }}>{kit.description}</p>
                <a 
                  href={kit.href}
                  style={{ 
                    display: 'inline-block', 
                    textDecoration: 'none', 
                    background: '#2f3a34', 
                    color: '#fff', 
                    padding: '10px 14px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 0 rgba(0,0,0,.08)' 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  Shop {kit.title.split(' ')[0]}
                </a>
              </article>
            ))}
            
            {/* Build Your Own Kit Option */}
            <article 
              className="relative group rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-foreground/20"
              style={{ 
                background: "#e8f0e8", 
                border: "1px solid #d0ddd0", 
              }}
            >
              <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>
                <span aria-hidden="true">🎨 </span>
                <strong>Build Your Own</strong>
              </h3>
              <em style={{ display: 'block', margin: '0 0 10px', opacity: .8 }}>Custom Quote</em>
              <p style={{ margin: '0 0 16px' }}>Want something unique? Choose exactly what goes in your kit and we'll create a custom quote for you.</p>
              <a 
                href="/build-custom"
                style={{ 
                  display: 'inline-block', 
                  textDecoration: 'none', 
                  background: '#2f3a34', 
                  color: '#fff', 
                  padding: '10px 14px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 0 rgba(0,0,0,.08)' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              >
                Build Your Own →
              </a>
            </article>
          </div>

          <div style={{ height: '8px' }}></div>

          <style>{`
            @media (min-width: 640px) {
              .gg-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
            }
            @media (min-width: 900px) {
              .gg-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
            }
          `}</style>
        </section>

        {/* Featured Gifts Section */}
        <section className="py-16 md:py-20 bg-background" aria-label="Featured Gifts" style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
          <header style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '28px', letterSpacing: '.2px' }} className="font-serif">Featured Gifts</h2>
            <p style={{ margin: 0, opacity: .85 }}>Individual items for thoughtful giving.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="featured-gifts-grid">
            <article 
              className="relative group rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              style={{ 
                background: "#e8f0e8", 
                border: "1px solid #d0ddd0", 
              }}
            >
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-48 aspect-[4/3] md:aspect-square rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={lavenderEyePillowImage} 
                    alt="Calming Lavender Eye Pillow"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>
                    <span aria-hidden="true">🌸 </span>
                    <strong>Calming Lavender Eye Pillow — $22</strong>
                  </h3>
                  <em style={{ display: 'block', margin: '0 0 10px', opacity: .8 }}>For moments of quiet and rest</em>
                  <p style={{ margin: '0 0 16px' }}>A handmade lavender eye pillow for rest and relaxation, stress relief, or a calming sensory experience.</p>
                  <div className="flex gap-3">
                    <a 
                      href={STRIPE_PRODUCTS.LAVENDER_EYE_PILLOW.paymentLink}
                      style={{ 
                        display: 'inline-block', 
                        textDecoration: 'none', 
                        background: '#2f3a34', 
                        color: '#fff', 
                        padding: '10px 14px', 
                        borderRadius: '12px', 
                        boxShadow: '0 2px 0 rgba(0,0,0,.08)' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                    >
                      Buy Now
                    </a>
                    <a 
                      href="/products/lavender-eye-pillow"
                      style={{ 
                        display: 'inline-block', 
                        textDecoration: 'none', 
                        background: 'transparent', 
                        color: '#2f3a34', 
                        padding: '10px 14px', 
                        borderRadius: '12px', 
                        border: '1px solid #2f3a34'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(47, 58, 52, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Details
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <style>{`
            @media (min-width: 640px) {
              .featured-gifts-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        <TestimonialsSection />
        
        {/* Decorative Divider */}
        <div className="py-12 bg-background overflow-hidden">
          <div className="container max-w-3xl mx-auto px-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <Heart className="w-6 h-6 text-primary/40 animate-pulse" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
          </div>
        </div>
        
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
