import portfolioData from "@/data/portfolio.json";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground font-mono">
          &copy; {currentYear} {portfolioData.name}. All rights reserved.
        </div>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <a href={portfolioData.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Github size={18} />
          </a>
          <a href={portfolioData.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
            <Linkedin size={18} />
          </a>
          <a href={`mailto:${portfolioData.links.email}`} className="hover:text-accent transition-colors">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
