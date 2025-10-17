const HowItWorksSection = () => {
  const steps = [
    {
      number: "Step 1",
      title: "Choose your gift",
      description: "Pick the Gift Box or Lavender Eye Pillow. Add any notes about the recipient.",
    },
    {
      number: "Step 2",
      title: "Personalize",
      description: "We include a message card and a carefully selected custom item chosen just for them.",
    },
    {
      number: "Step 3",
      title: "We pack & send",
      description: "Thoughtfully assembled, beautifully wrapped, and shipped with care.",
    },
  ];

  return (
    <section id="how" className="py-16 md:py-20 bg-card" aria-label="How it works">
      <div className="container max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-3xl text-foreground">How it works</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="p-6 rounded-2xl border border-border bg-muted">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {step.number}
              </span>
              <h3 className="mt-2 font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
