import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, ChevronDown } from "lucide-react";
import { HeroCanvas } from "./HeroCanvas";
import portfolioData from "@/data/portfolio.json";
import profileImg from "@assets/file_00000000a5847208acf1d5dfa0346074_1778781548461.png";

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [12, -12]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-12, 12]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(e.clientX - cx);
    mouseY.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
    }
  };

  const nameVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.3 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
    >
      <HeroCanvas />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

          {/* ── Left: text content ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl flex-1"
          >
            <div className="inline-block px-3 py-1 mb-6 border border-primary/30 rounded-full bg-primary/10 text-primary font-mono text-sm">
              Hi there, I am
            </div>

            <motion.h1
              variants={nameVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-foreground flex flex-wrap"
              data-testid="text-hero-name"
            >
              {portfolioData.name.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className={char === " " ? "mr-3" : ""}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-xl md:text-3xl font-semibold text-muted-foreground mb-6"
            >
              {portfolioData.role}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed"
            >
              {portfolioData.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all"
                onClick={() => scrollToSection("projects")}
                data-testid="button-view-projects"
              >
                View Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent/10 px-8 py-6 rounded-full"
                onClick={() => scrollToSection("contact")}
                data-testid="button-contact-me"
              >
                Contact Me
              </Button>

              <div className="flex items-center gap-2 ml-2">
                <a
                  href={portfolioData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  data-testid="link-github-hero"
                >
                  <Github size={18} />
                </a>
                <a
                  href={portfolioData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary hover:bg-secondary/10 transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  data-testid="link-linkedin-hero"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: profile image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="flex-shrink-0 flex justify-center"
          >
            {/* Floating wrapper */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* 3D tilt wrapper */}
              <motion.div
                ref={imageRef}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="relative cursor-pointer"
              >
                {/*
                  Animated gradient ring — the outer div clips the
                  spinning conic-gradient so its rotating corners
                  never escape the rounded shape.
                */}
                <div
                  className="relative rounded-2xl p-[3px] transition-all duration-500"
                  style={{
                    boxShadow: isHovered
                      ? "0 0 40px rgba(0,240,255,0.4)"
                      : "0 0 20px rgba(0,240,255,0.15)",
                  }}
                >
                  {/* Spinning conic-gradient — clipped by overflow:hidden on parent */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
                      style={{
                        background:
                          "conic-gradient(from 0deg, #00f0ff, #818cf8, #a78bfa, #60a5fa, #00f0ff)",
                        animation: "profile-spin 4s linear infinite",
                      }}
                    />
                  </div>

                  {/* Inner card — sits on top of the spinning gradient */}
                  <div className="relative rounded-[13px] overflow-hidden bg-background/30 backdrop-blur-sm">
                    <motion.img
                      src={profileImg}
                      alt="Balaji Thangallapally"
                      loading="lazy"
                      animate={
                        isHovered
                          ? { scale: 1.04 }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.35 }}
                      className="w-52 h-64 md:w-64 md:h-80 object-cover object-top block"
                      data-testid="img-profile"
                    />

                    {/* Name + role overlay */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-background/95 via-background/70 to-transparent">
                      <p className="text-sm font-bold text-foreground leading-tight truncate">
                        {portfolioData.name}
                      </p>
                      <p className="text-xs text-primary font-mono mt-0.5 leading-tight truncate">
                        {portfolioData.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors z-10"
        onClick={() => scrollToSection("about")}
        data-testid="button-scroll-down"
      >
        <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes profile-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
