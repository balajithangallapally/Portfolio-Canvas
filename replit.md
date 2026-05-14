# Balaji Thangallapally — Portfolio

A modern personal portfolio website for Balaji Thangallapally, a Full Stack Developer and Data Science student. Features immersive dark UI, animated particle hero, smooth scroll animations, and interactive project cards.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, GSAP, HTML5 Canvas 2D particles
- UI: shadcn/ui, next-themes (dark/light mode), lucide-react, react-icons
- API: Express 5 (shared api-server, not used by portfolio)

## Where things live

- `artifacts/portfolio/src/data/portfolio.json` — all user data (name, skills, projects, links)
- `artifacts/portfolio/src/components/` — all UI components (Navbar, Hero, About, Skills, Projects, etc.)
- `artifacts/portfolio/src/components/HeroCanvas.tsx` — HTML5 Canvas 2D particle animation (mouse-reactive)
- `artifacts/portfolio/src/index.css` — full dark/light theme with CSS custom properties

## Architecture decisions

- Single-page app with no backend (static portfolio)
- All content driven from `portfolio.json` — no hardcoded strings in components
- HTML5 Canvas 2D used for particles instead of Three.js WebGL (WebGL not available in Replit sandbox)
- Dark-first theme with next-themes for light/dark toggle
- Framer Motion for scroll-triggered reveals and staggered animations; GSAP for navbar scroll effect

## Product

Full personal portfolio with: animated hero section with particle field, about section with glassmorphism cards, skills grid with hover animations, project cards with modal details, education timeline, and contact section with copy-to-clipboard email.

## User preferences

- No emojis in UI
- All external links open in new tabs
- Mobile-first responsive design

## Gotchas

- WebGL (Three.js WebGLRenderer) is not available in the Replit sandbox — use HTML5 Canvas 2D instead
- Google Font imports must come before `@import "tailwindcss"` in index.css

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
