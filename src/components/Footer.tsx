const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 border-t" style={{ backgroundColor: '#e8f0e8', borderColor: '#d0ddd0' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-sm text-muted-foreground grid md:grid-cols-2 gap-6">
          <p>© {currentYear} Gathered Grace. All rights reserved.</p>
          <p className="md:text-right">Gracefully gathered, given in love.</p>
        </div>
        <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: '#c8d8c8' }}>
          <a
            href="https://greenloop.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
          >
            Powered by GreenLoop
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
