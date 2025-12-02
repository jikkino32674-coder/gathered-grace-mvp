import { Gift, Heart, Package } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Gift",
      description: "Choose from our curated care kits.",
      icon: Gift,
      color: "rose",
    },
    {
      number: "02",
      title: "Personalize",
      description: "Each kit includes a message card—write your own note, or let us craft one for you. The Restore Kit also includes a custom item lovingly chosen for the recipient based on what you tell us.",
      icon: Heart,
      color: "sage",
    },
    {
      number: "03",
      title: "We pack & send",
      description: "Thoughtfully assembled, beautifully wrapped, and shipped with care—complimentary US shipping included.",
      icon: Package,
      color: "gold",
    },
  ];

  return (
    <section id="how" className="py-16 md:py-24 bg-gradient-to-b from-background to-card" aria-label="How it works">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple, thoughtful process to create meaningful gifts for those you care about
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number} 
                className="relative group"
              >
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border"></div>
                  </div>
                )}
                
                <div className="relative bg-card rounded-3xl border-2 border-border/60 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-foreground/20">
                  {/* Step number badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-md">
                    <span className="font-serif text-lg font-semibold text-foreground">{step.number}</span>
                  </div>
                  
                  {/* Icon */}
                  <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    step.color === 'rose' ? 'bg-rose/10' : 
                    step.color === 'sage' ? 'bg-sage/10' : 
                    'bg-gold/10'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      step.color === 'rose' ? 'text-rose' : 
                      step.color === 'sage' ? 'text-sage' : 
                      'text-gold'
                    }`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
