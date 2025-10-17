import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Can I add a personalized note?",
      answer: "Yes — each box includes a message card. Add your note at checkout and we'll handwrite it.",
    },
    {
      question: "Do you ship directly to the recipient?",
      answer: "Absolutely. We pack with care and never include pricing inside the box.",
    },
    {
      question: "Are the products scented?",
      answer: "The balm is unscented. The eye pillow contains natural dried lavender and flax seed.",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-20 bg-background" aria-label="Frequently asked questions">
      <div className="container max-w-3xl mx-auto px-6">
        <h2 className="font-serif text-3xl text-foreground">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
