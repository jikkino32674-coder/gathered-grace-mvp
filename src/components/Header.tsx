import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import logo from "@/assets/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: '#e8f0e8', borderColor: '#d0ddd0' }}>
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between gap-4" aria-label="Main navigation">
          <a 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo} 
              alt="Gathered Grace" 
              className="h-12 w-auto object-contain"
            />
            <strong className="font-serif text-xl text-foreground">Gathered Grace</strong>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 text-sm">
            <button 
              onClick={() => scrollToSection('products')} 
              className="hover:text-muted-foreground transition-colors font-medium"
            >
              Shop
            </button>
            <button 
              onClick={() => scrollToSection('how')} 
              className="hover:text-muted-foreground transition-colors font-medium"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('story')} 
              className="hover:text-muted-foreground transition-colors font-medium"
            >
              Our story
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="hover:text-muted-foreground transition-colors font-medium"
            >
              FAQ
            </button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <button 
                    onClick={() => scrollToSection('products')}
                    className="text-left text-lg font-medium hover:text-muted-foreground transition-colors py-2"
                  >
                    Shop
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button 
                    onClick={() => scrollToSection('how')}
                    className="text-left text-lg font-medium hover:text-muted-foreground transition-colors py-2"
                  >
                    How it works
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button 
                    onClick={() => scrollToSection('story')}
                    className="text-left text-lg font-medium hover:text-muted-foreground transition-colors py-2"
                  >
                    Our story
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button 
                    onClick={() => scrollToSection('faq')}
                    className="text-left text-lg font-medium hover:text-muted-foreground transition-colors py-2"
                  >
                    FAQ
                  </button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;
