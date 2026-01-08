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
              I'm Nikki, the heart behind Gathered Grace. Born and raised in the Midwest, I've always been shaped by a deep appreciation for community, simplicity, and showing up for people in quiet, meaningful ways. I'm a Mom to two grown boys, a dog lover with two always-underfoot companions, and someone who believes that care is often found in the small, thoughtful details.
            </p>
            <p className="text-muted-foreground">
              Gathered Grace grew from a desire to offer better gifts — ones that feel personal, comforting, and intentional, especially during life's harder seasons. Each care kit is carefully gathered with tenderness and purpose, meant to offer a soft place to land and a reminder that someone is cared for.
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
