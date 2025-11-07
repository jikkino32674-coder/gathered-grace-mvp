import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import handmadeBalmImage from "@/assets/handmade-balm.png";

const HandmadeBalmDetails = () => {
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
                  src={handmadeBalmImage} 
                  alt="Handmade Balm"
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
                  Handmade Balm
                </h1>
                <p className="text-xl font-semibold text-foreground mb-6">
                  Price TBD
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Crafted in small batches with natural ingredients and a touch of beeswax, this balm softens and soothes dry skin while offering the quiet comfort of something made by hand. Its natural texture melts on contact, leaving behind a subtle, grounded calm — a reminder to pause and tend to yourself with grace.
                </p>
              </div>

              <div className="flex gap-3 pt-6">
                <Button variant="rose" size="lg" className="flex-1">
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
    </div>
  );
};

export default HandmadeBalmDetails;

