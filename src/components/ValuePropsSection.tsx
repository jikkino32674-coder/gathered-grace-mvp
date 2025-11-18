const ValuePropsSection = () => {
  const valueProps = [
    {
      title: "For any occasion",
      description: "Celebration, healing, thank you, or simply because.",
    },
    {
      title: "Personal and Intentional",
      description: "Each box is thoughtfully gathered with care — complete with a personal message and a hand-selected gift, when chosen.",
    },
    {
      title: "Natural & Gentle",
      description: "Handmade lavender eye pillow with flax seed and dried lavender. Unscented balm that is artisan-crafted using natural emollients.",
    },
    {
      title: "Small-batch",
      description: "Assembled with care, packed by hand, and sent with love.",
    },
  ];

  return (
    <section className="py-12 md:py-16 border-t border-border bg-card" aria-label="Why choose us">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop) => (
            <div key={prop.title} className="p-6 rounded-2xl border border-border bg-muted">
              <h3 className="font-medium text-foreground">{prop.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropsSection;
