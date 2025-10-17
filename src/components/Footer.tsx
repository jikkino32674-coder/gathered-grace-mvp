const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 border-t border-border bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-sm text-muted-foreground grid md:grid-cols-2 gap-6">
          <p>© {currentYear} Gathered Grace. All rights reserved.</p>
          <p className="md:text-right">Gracefully gathered, given in love.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
