import { Button } from "@/components/ui/button";

const NominateSection = () => {
  return (
    <section id="nominate" className="py-16 md:py-20 bg-muted" aria-label="Nominate someone">
      <div className="container max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl text-foreground">
          Know someone who could use a little care?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Nominate a recipient and we'll follow up with simple next steps. No pressure — just a
          soft place to land.
        </p>
        <Button 
          className="mt-6"
          onClick={() => window.scrollTo({ top: document.getElementById('contact')?.offsetTop, behavior: 'smooth' })}
        >
          Open nomination form
        </Button>
      </div>
    </section>
  );
};

export default NominateSection;
