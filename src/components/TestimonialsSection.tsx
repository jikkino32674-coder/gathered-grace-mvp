import { Heart } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Anne H.",
      giftedFor: "Mother going through cancer treatment",
      text: "Thank you so much for the basket you put together. So sweet! She was so surprised when she received it and so appreciative! Thank you!!!",
    },
    {
      name: "Jodi W.",
      giftedFor: "Gift for real estate agent at house closing",
      text: "I wore my house hustler custom shirt today! Thank you again! Everyone at the office loved it!",
    },
    {
      name: "Kim R.",
      giftedFor: "Male cousin going through cancer treatment",
      text: "Hi Nikki! He really enjoyed the kit and reached out to his grandma to show what he received. He was very thankful that we were thinking of him and that you put it all together for him. I am too! Thank you so much for the time and effort you spent putting this together for Jack and for other people too!",
    },
    {
      name: "Sally M.",
      giftedFor: "Sister in Law needing encouragement",
      text: "The kit was put together really pretty and neat little things to brighten her day!",
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
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-background rounded-2xl p-5 shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart 
                  className="w-4 h-4 flex-shrink-0 animate-pulse" 
                  fill="#fb7185"
                  color="#fb7185"
                  aria-hidden="true"
                />
                <p className="text-xs text-muted-foreground/80 italic">
                  {testimonial.giftedFor}
                </p>
              </div>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                "{testimonial.text}"
              </p>
              <p className="font-medium text-foreground text-sm">
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
