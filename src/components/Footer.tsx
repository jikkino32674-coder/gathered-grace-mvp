const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 mb-8">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap text-sm text-muted-foreground">
          <small>© {currentYear} Gathered Grace</small>
          <small>Made with ♥ and Lovable</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
