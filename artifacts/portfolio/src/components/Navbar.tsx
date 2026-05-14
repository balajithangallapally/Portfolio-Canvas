import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

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

  useEffect(() => {
    if (isScrolled) {
      gsap.to("#navbar", {
        backgroundColor: "hsl(var(--background) / 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid hsl(var(--border))",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        duration: 0.3,
      });
    } else {
      gsap.to("#navbar", {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        borderBottom: "1px solid transparent",
        paddingTop: "1.25rem",
        paddingBottom: "1.25rem",
        duration: 0.3,
      });
    }
  }, [isScrolled]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 flex items-center justify-between"
    >
      <div className="font-mono text-xl font-bold tracking-tighter cursor-pointer flex items-center gap-2" onClick={() => scrollToSection("home")}>
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
                className={`text-sm font-medium transition-colors hover:text-primary relative py-2 ${
                  activeId === link.id ? "text-primary" : "text-muted-foreground"
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
