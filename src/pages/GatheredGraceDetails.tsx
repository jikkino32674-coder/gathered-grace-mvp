import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCareForm from "@/components/CustomCareForm";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import restReceiveImage from "@/assets/rest-receive-kit.jpg";

const GatheredGraceDetails = () => {
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="container max-w-6xl mx-auto px-6 py-12">
          <Link 
            to="/" 
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="aspect-square rounded-2xl overflow-hidden border border-border/60 shadow-soft">
                <img 
                  src={restReceiveImage} 
                  alt="Gathered Grace Gift Box"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block text-sm text-gold border border-border/40 rounded-full px-4 py-1.5 mb-4">
                  In stock
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
                  Gathered Grace Gift Box
                </h1>
                <p className="text-xl font-semibold text-foreground mb-6">
                  Starting at $68
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Whether it's to celebrate, to comfort, or simply to remind someone they're loved, the Gathered Grace Gift Box is a meaningful way to mark any moment — joyful, healing, or simply in need of a little care. Each piece is chosen with intention — a lavender eye pillow for gentle rest, a hardcover journal and pen for reflection, a handmade unscented balm for soothing care, and a heartfelt message card — along with a carefully selected custom gift chosen especially for the recipient. Gracefully gathered, given in love.
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/40">
                <h2 className="text-2xl font-serif font-semibold">What's Included</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Handmade lavender eye pillow for gentle rest</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Hardcover journal and pen for reflection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Handmade unscented balm for soothing care</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Heartfelt message card</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Carefully selected custom gift, chosen especially for the recipient</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-6">
                <Button variant="rose" size="lg" className="flex-1" onClick={() => setFormOpen(true)}>
                  Buy Now
                </Button>
                <Button variant="sage" size="lg" className="flex-1" asChild>
                  <a href="mailto:gatheredgrace.giving@gmail.com">
                    Contact Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
      <CustomCareForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};

export default GatheredGraceDetails;
