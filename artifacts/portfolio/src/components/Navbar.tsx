import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Contact", id: "contact" },
];

export function Navbar() {
  const activeId = useScrollSpy(navLinks.map((link) => link.id), 100);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const overDark = !isScrolled;

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 flex items-center justify-between py-5 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg py-3"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div
        className={`font-mono text-xl font-bold tracking-tighter cursor-pointer flex items-center gap-2 transition-colors duration-300 ${
          overDark ? "text-white" : "text-foreground"
        }`}
        onClick={() => scrollToSection("home")}
        data-testid="nav-logo"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          B
        </div>
        <span>Thangallapally</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <ul className="flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollToSection(link.id)}
                data-testid={`nav-link-${link.id}`}
                className={`text-sm font-medium transition-colors hover:text-primary relative py-2 ${
                  activeId === link.id
                    ? "text-primary"
                    : overDark
                    ? "text-white/75"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
                {activeId === link.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </div>

      <div className="md:hidden flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-foreground"
          aria-label="Toggle menu"
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                data-testid={`mobile-nav-link-${link.id}`}
                className={`text-left text-lg font-medium py-2 ${
                  activeId === link.id ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
