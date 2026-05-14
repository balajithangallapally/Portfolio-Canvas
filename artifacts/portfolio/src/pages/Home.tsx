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
  objectPosition: string;
  overlay: string;
  children: React.ReactNode;
}

/**
 * Wraps one or more sections with a static background image.
 * The image is absolutely positioned inside a relative container —
 * it never scrolls, shifts, or moves. Only content scrolls over it.
 */
function SectionBg({ src, objectPosition, overlay, children }: SectionBgProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background image layer — covers the full wrapper, never moves */}
      <div className="absolute inset-0 z-0">
        <img
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{ objectPosition }}
        />
        {/* Base dark veil for consistent readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Directional gradient overlay */}
        <div className="absolute inset-0" style={{ background: overlay }} />
      </div>

      {/* Content scrolls normally on top of the fixed-in-place background */}
      <div className="relative z-10">
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
              objectPosition="left center"
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
              objectPosition="center center"
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
              objectPosition="right center"
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
