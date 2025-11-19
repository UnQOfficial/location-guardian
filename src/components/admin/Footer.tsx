const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            Built with <span className="text-destructive">❤️</span> by{' '}
            <span className="text-foreground font-medium hover:text-primary transition-colors cursor-pointer">
              Sandeep Gaddam
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
