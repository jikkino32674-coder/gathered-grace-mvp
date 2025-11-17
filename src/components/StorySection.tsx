const StorySection = () => {
  return (
    <section id="story" className="py-16 md:py-20 bg-card" aria-label="Our story">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3">
            <p className="text-muted-foreground mb-4">
              The idea for Gathered Grace began when a family member was in cancer treatment. I searched for something that could offer real comfort—something soft, supportive, and genuinely meaningful. When I couldn't find it, I created it.
            </p>
            <h2 className="font-serif text-3xl text-foreground mb-4">
              Gracefully gathered, given in love.
            </h2>
            <p className="text-muted-foreground">
              Now, Gathered Grace is a small, heart-forward studio crafting thoughtful gifts for any season of life. Each piece is chosen with intention—gentle to the senses, useful, and made to be received with warmth.
            </p>
          </div>
          <div className="md:col-span-2 rounded-2xl overflow-hidden bg-muted h-56 flex items-center justify-center">
            <div className="text-center text-muted-foreground text-sm">
              [Story Image]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
