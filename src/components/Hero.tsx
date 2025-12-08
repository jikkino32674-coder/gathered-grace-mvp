import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import heroNotebook from "@/assets/hero-notebook.png";
import heroLotionBar from "@/assets/hero-lotion-bar.png";
import heroGiftBox from "@/assets/hero-gift-box.png";

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
                  <div className="flex items-center justify-center aspect-[4/3] overflow-hidden">
                    <img 
                      src={heroNotebook} 
                      alt="Cozy scene with notebook, candle, tea, and lavender" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center aspect-[4/3] bg-[#e8f0e8] p-8 text-center">
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">For any occasion</h3>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xs">Celebration, healing, thank you, or simply because.</p>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex items-center justify-center aspect-[4/3] overflow-hidden">
                    <img 
                      src={heroLotionBar} 
                      alt="Handmade lotion bar enjoyed outdoors in natural sunlight" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center aspect-[4/3] bg-[#e8f0e8] p-8 text-center">
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">Personal and Intentional</h3>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xs">Each box is thoughtfully gathered with care — complete with a personal message and a hand-selected gift, when chosen.</p>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex items-center justify-center aspect-[4/3] overflow-hidden">
                    <img 
                      src={heroGiftBox} 
                      alt="Beautifully wrapped gift box" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center aspect-[4/3] bg-[#e8f0e8] p-8 text-center">
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">Natural & Gentle</h3>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xs">Handmade lavender eye pillow with flax seed and dried lavender. Unscented balm that is artisan-crafted using natural emollients.</p>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center aspect-[4/3] bg-[#e8f0e8] p-8 text-center">
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">Small-batch</h3>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xs">Assembled with care, packed by hand, and sent with love.</p>
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
