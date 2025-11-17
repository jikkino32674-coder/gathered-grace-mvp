import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.png";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden" id="hero">
      <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
              Looking for the perfect gift? You just found it.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Curated gifts for any occasion - joyful, healing, or simply to show you care. Beautifully packaged, ready to ship, and guaranteed to be loved.
            </p>
            <div className="mt-8">
              <Button onClick={() => scrollToSection('products')}>
                Shop now
              </Button>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-soft">
            <img 
              src={heroImage} 
              alt="Gathered Grace care products including lavender eye pillow, balm, journal, and coffee on natural linen" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
