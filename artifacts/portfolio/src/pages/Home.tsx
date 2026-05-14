import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScrollBackground } from "@/components/ScrollBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force dark mode on body just in case next-themes hasn't kicked in
    document.documentElement.classList.add('dark');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollBackground />
      <LoadingScreen isLoading={isLoading} />
      <CustomCursor />

      <AnimatePresence>
        {!isLoading && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen relative selection:bg-primary/30 font-sans"
          >
            <Navbar />
            <Hero />
            <About />
            <Education />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
