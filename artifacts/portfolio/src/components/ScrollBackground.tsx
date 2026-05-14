import { useState, useEffect } from "react";
import bg1 from "@assets/file_000000008d8c71fa9daa5eefdf6aa3e6_1778783725373.png";
import bg2 from "@assets/file_00000000100071fa8a470af2919e3d29_1778784308644.png";
import bg3 from "@assets/file_000000002fd8720680bb9b4c69769fb8_1778784308797.png";

/*
  3 fixed background layers stacked on top of each other.
  Only one is visible at a time — controlled by CSS opacity with a smooth
  0.8s ease-in-out transition. No movement, no parallax, no scroll shifting.

  Section → background mapping:
    home              → bg1 (profile LEFT)
    about, education  → bg2 (glowing-eye CENTER)
    skills            → bg2
    projects, contact → bg3 (suited man RIGHT)
*/

const BACKGROUNDS = [
  {
    src: bg1,
    objectPosition: "left center",
    // Subject LEFT → text is on right → darken the right side for readability
    overlay:
      "linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.70) 100%)",
    sections: ["home"],
  },
  {
    src: bg2,
    objectPosition: "center center",
    // Subject CENTER → uniform dark overlay
    overlay: "rgba(0,0,0,0.50)",
    sections: ["about", "education", "skills"],
  },
  {
    src: bg3,
    objectPosition: "right center",
    // Subject RIGHT → text is on left → darken the left side for readability
    overlay:
      "linear-gradient(to left, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.70) 100%)",
    sections: ["projects", "contact"],
  },
];

// Map each section id → bg index
const SECTION_TO_BG: Record<string, number> = {};
BACKGROUNDS.forEach((bg, idx) => {
  bg.sections.forEach((id) => { SECTION_TO_BG[id] = idx; });
});

export function ScrollBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ratios: Record<string, number> = {};
    Object.keys(SECTION_TO_BG).forEach((id) => { ratios[id] = 0; });

    const pickActive = () => {
      const scores = [0, 0, 0];
      for (const [id, ratio] of Object.entries(ratios)) {
        scores[SECTION_TO_BG[id]] += ratio;
      }
      const best = scores.indexOf(Math.max(...scores));
      setActiveIndex(best);
    };

    let observers: IntersectionObserver[] = [];

    const attachObservers = () => {
      // Detach any previous observers
      observers.forEach((o) => o.disconnect());
      observers = [];

      Object.keys(SECTION_TO_BG).forEach((id) => {
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
    };

    // Retry every 200ms until all section elements are found in the DOM
    // (sections only render after the loading screen clears)
    const sectionIds = Object.keys(SECTION_TO_BG);
    const tryAttach = () => {
      const allFound = sectionIds.every((id) => !!document.getElementById(id));
      if (allFound) {
        attachObservers();
      } else {
        retryTimer = window.setTimeout(tryAttach, 200);
      }
    };

    let retryTimer = window.setTimeout(tryAttach, 200);

    return () => {
      clearTimeout(retryTimer);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    // Fixed to the viewport — never moves with scroll
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {BACKGROUNDS.map((bg, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            inset: 0,
            // Smooth fade: 0.8s ease-in-out on opacity only — no other transform
            transition: "opacity 0.8s ease-in-out",
            opacity: idx === activeIndex ? 1 : 0,
            // Prevent any pointer interaction or drag
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {/* Image — fixed-size, covers the layer, NEVER moves */}
          <img
            src={bg.src}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: bg.objectPosition,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />

          {/* Base dark veil — consistent across all images */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.32)",
            }}
          />

          {/* Directional gradient overlay for text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: bg.overlay,
            }}
          />
        </div>
      ))}
    </div>
  );
}
