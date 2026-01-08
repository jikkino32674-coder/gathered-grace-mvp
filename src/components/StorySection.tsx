import founderPhoto from "@/assets/founder-photo.jpg";

const StorySection = () => {
  return (
    <section id="story" className="py-16 md:py-20 bg-card" aria-label="Our story">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">
            Our Story
          </h2>
        </div>
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3">
            <p className="text-muted-foreground mb-4">
              Gathered Grace was created during a time when a loved one was in cancer treatment, inspiring a desire to offer comfort in meaningful, tangible ways. I looked for something that felt soft, supportive, and truly heartfelt. When I couldn't find it, I created it.
            </p>
            <h3 className="font-serif text-3xl text-foreground mb-4">
              Gracefully gathered, given in love.
            </h3>
            <p className="text-muted-foreground">
              Now, Gathered Grace is a small, heart-forward studio crafting thoughtful gifts for any season of life. Each piece is chosen with intention—gentle to the senses, useful, and made to be received with warmth.
            </p>
          </div>
          <div className="md:col-span-2 flex justify-center">
            <img 
              src={founderPhoto} 
              alt="Founder of Gathered Grace" 
              className="w-56 h-56 md:w-64 md:h-64 rounded-full object-cover border-4 border-primary/20 shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
