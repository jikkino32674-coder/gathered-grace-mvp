import { Button } from "@/components/ui/button";

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
              Thoughtful care, beautifully gathered.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Curated gifts for any occasion — joyful, healing, or simply to show you care. Each
              piece is chosen with intention and given in love.
            </p>
            <div className="mt-8">
              <Button onClick={() => scrollToSection('products')}>
                Shop gift boxes
              </Button>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-muted to-background shadow-soft flex items-center justify-center overflow-hidden">
            <div className="text-center text-muted-foreground text-sm">
              [Hero Image]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
