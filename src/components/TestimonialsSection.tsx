import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      text: "The Rest Kit was exactly what my friend needed during a difficult time. The lavender eye pillow is so soothing, and the balm smells amazing. She told me it was the most thoughtful gift she'd ever received.",
      rating: 5,
    },
    {
      name: "Jennifer L.",
      text: "I ordered the Restore Kit for my sister who was going through cancer treatment. The custom gift was so perfectly chosen - you could tell real thought went into it. She was moved to tears. Thank you for making something so special.",
      rating: 5,
    },
    {
      name: "Michael T.",
      text: "Bought the Reflect Kit for my wife's birthday. The quality of everything is exceptional - the handmade items feel so personal and luxurious. She uses the eye pillow every night now.",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30" id="testimonials">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Real stories from people who have given and received Gathered Grace gifts.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-background rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 fill-primary text-primary" 
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              <p className="font-medium text-foreground">
                — {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
