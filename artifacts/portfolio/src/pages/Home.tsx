import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

import bg1 from "@assets/file_000000008d8c71fa9daa5eefdf6aa3e6_1778783725373.png";
import bg2 from "@assets/file_00000000100071fa8a470af2919e3d29_1778784308644.png";
import bg3 from "@assets/file_000000002fd8720680bb9b4c69769fb8_1778784308797.png";

interface SectionBgProps {
  src: string;
  position: string;
  overlay: string;
  children: React.ReactNode;
}

/**
 * Each section group gets its own background image locked to the viewport
 * using CSS background-attachment: fixed. The background never moves —
 * only the section content scrolls over it. Each section is independent.
 */
function SectionBg({ src, position, overlay, children }: SectionBgProps) {
  return (
    <div
      style={{
        position: "relative",
        backgroundImage: `url(${src})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: position,
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Consistent dark veil across all sections */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.42)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {/* Directional gradient for text readability */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: overlay,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {/* Content — scrolls normally above the locked background */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
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

            {/*
              Section 1 — Hero
              Subject aligned LEFT, text flows right
              Gradient darkens the right side for text readability
            */}
            <SectionBg
              src={bg1}
              position="left center"
              overlay="linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.72) 100%)"
            >
              <Hero />
            </SectionBg>

            {/*
              Section 2 — About + Education + Skills
              Subject aligned CENTER, uniform dark overlay
            */}
            <SectionBg
              src={bg2}
              position="center center"
              overlay="rgba(0,0,0,0.45)"
            >
              <About />
              <Education />
              <Skills />
            </SectionBg>

            {/*
              Section 3 — Projects + Contact + Footer
              Subject aligned RIGHT, text flows left
              Gradient darkens the left side for text readability
            */}
            <SectionBg
              src={bg3}
              position="right center"
              overlay="linear-gradient(to left, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.72) 100%)"
            >
              <Projects />
              <Contact />
              <Footer />
            </SectionBg>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
