import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import bg1 from "@assets/file_000000008d8c71fa9daa5eefdf6aa3e6_1778783725373.png";
import bg2 from "@assets/file_00000000100071fa8a470af2919e3d29_1778783725218.png";
import bg3 from "@assets/file_000000002fd8720680bb9b4c69769fb8_1778783725288.png";

/*
  Background config:
  - bg1 (LEFT subject, profile view)   → Hero section
  - bg2 (CENTER subject, glowing eye)  → About + Skills sections
  - bg3 (RIGHT subject, suited/city)   → Projects + Contact sections
*/
const BACKGROUNDS = [
  {
    src: bg1,
    objectPosition: "left center",
    // Subject is LEFT → text is RIGHT → darken the right side
    overlay:
      "linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.30) 40%, rgba(0,0,0,0.72) 100%)",
    sections: ["home"],
  },
  {
    src: bg2,
    objectPosition: "center center",
    // Subject is CENTER → uniform dark overlay
    overlay: "rgba(0,0,0,0.52)",
    sections: ["about", "education", "skills"],
  },
  {
    src: bg3,
    objectPosition: "right center",
    // Subject is RIGHT → text is LEFT → darken the left side
    overlay:
      "linear-gradient(to left, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.30) 40%, rgba(0,0,0,0.72) 100%)",
    sections: ["projects", "contact"],
  },
];

export function ScrollBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollY } = useScroll();
  // Parallax: background moves at 40% of scroll speed
  const bgY = useTransform(scrollY, [0, 3000], ["0%", "40%"]);

  useEffect(() => {
    const sectionIds = BACKGROUNDS.flatMap((b) => b.sections);

    const observers: IntersectionObserver[] = [];

    // Map each section id → which background index it belongs to
    const sectionToBg: Record<string, number> = {};
    BACKGROUNDS.forEach((bg, idx) => {
      bg.sections.forEach((id) => {
        sectionToBg[id] = idx;
      });
    });

    // Track visibility ratios per section
    const ratios: Record<string, number> = {};
    sectionIds.forEach((id) => (ratios[id] = 0));

    const pickActive = () => {
      // Pick the background group whose sections have the highest combined visibility
      const scores = [0, 0, 0];
      for (const [id, ratio] of Object.entries(ratios)) {
        scores[sectionToBg[id]] += ratio;
      }
      const best = scores.indexOf(Math.max(...scores));
      setActiveIndex(best);
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios[id] = entry.intersectionRatio;
          pickActive();
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {BACKGROUNDS.map((bg, idx) => (
        <motion.div
          key={idx}
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: idx === activeIndex ? 1 : 0,
            scale: idx === activeIndex ? 1 : 1.04,
          }}
          transition={{
            opacity: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
            scale: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          {/* Parallax image wrapper */}
          <motion.div
            className="absolute inset-[-8%]"
            style={{ y: bgY }}
          >
            <img
              src={bg.src}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ objectPosition: bg.objectPosition }}
              draggable={false}
            />
          </motion.div>

          {/* Base dark veil */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Directional gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: bg.overlay }}
          />

          {/* Bottom fade so section transitions feel grounded */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      ))}
    </div>
  );
}
