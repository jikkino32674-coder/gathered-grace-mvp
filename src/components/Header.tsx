import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container max-w-6xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-between gap-4" aria-label="Main navigation">
          <a href="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Gathered Grace" 
              className="h-10 w-auto object-contain"
            />
            <strong className="font-serif text-xl text-foreground hidden sm:block">Gathered Grace</strong>
          </a>
          <div className="hidden md:flex gap-6 text-sm">
            <button onClick={() => scrollToSection('products')} className="hover:text-muted-foreground transition-colors">
              Shop
            </button>
            <button onClick={() => scrollToSection('how')} className="hover:text-muted-foreground transition-colors">
              How it works
            </button>
            <button onClick={() => scrollToSection('story')} className="hover:text-muted-foreground transition-colors">
              Our story
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-muted-foreground transition-colors">
              FAQ
            </button>
          </div>
          <Button onClick={() => scrollToSection('products')} size="sm">
            Shop now
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
