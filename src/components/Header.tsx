import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between gap-4" aria-label="Main navigation">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Gathered Grace" 
              className="h-12 w-auto object-contain"
            />
            <strong className="text-lg hidden sm:block">Gathered Grace</strong>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => scrollToSection('products')}
              className="text-sm"
            >
              Shop
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="text-sm"
            >
              Contact
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
