import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import heroGiftBox from "@/assets/hero-gift-box.png";
import heroNotebook from "@/assets/hero-notebook.png";
import heroLotionBar from "@/assets/hero-lotion-bar.png";
import heroEyePillow from "@/assets/hero-eye-pillow.png";

const Hero = () => {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden" id="hero">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
              Looking for the perfect gift? We've gathered something special for you.
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
          <div className="rounded-2xl overflow-hidden shadow-soft bg-muted/30">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="flex items-center justify-center min-h-[300px]">
                    <img 
                      src={heroGiftBox} 
                      alt="Gathered Grace gift box with lavender eye pillow, balm, and heartfelt message card" 
                      className="w-full h-auto"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex items-center justify-center min-h-[300px]">
                    <img 
                      src={heroNotebook} 
                      alt="Cozy scene with notebook, candle, tea, and lavender" 
                      className="w-full h-auto"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex items-center justify-center min-h-[300px]">
                    <img 
                      src={heroLotionBar} 
                      alt="Handmade lotion bar enjoyed outdoors in natural sunlight" 
                      className="w-full h-auto"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex items-center justify-center min-h-[300px]">
                    <img 
                      src={heroEyePillow} 
                      alt="Lavender eye pillow with herbal tea and dried lavender on wooden tray" 
                      className="w-full h-auto"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
