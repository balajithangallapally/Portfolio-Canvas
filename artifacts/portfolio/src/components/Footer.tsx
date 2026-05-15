import portfolioData from "@/data/portfolio.json";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-subtle font-mono">
          &copy; {currentYear} {portfolioData.name}. All rights reserved.
        </div>
        
        <div className="flex items-center gap-4 text-subtle">
          <a href={portfolioData.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
            <Github size={18} />
          </a>
          <a href={portfolioData.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
            <Linkedin size={18} />
          </a>
          <a href={`mailto:${portfolioData.links.email}`} className="hover:text-accent transition-colors duration-200">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
