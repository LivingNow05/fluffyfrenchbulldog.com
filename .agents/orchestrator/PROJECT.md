# Project: Bulldog Fluffy Redesign with Aceternity UI

## Architecture
- **Framework**: Astro v5.0.0 (Static Site Generator) + React 18 integration (`@astrojs/react`).
- **Styling**: Tailwind CSS v3 + `global.css` (custom variables & design tokens) + Framer Motion.
- **Component System**: Shadcn UI + Aceternity UI React TSX components in `src/components/ui/`.
- **Data Flow**: Static CSV dataset (`dataset_fluffy_stories.csv`) & JSON datasets (`fluffy.json`, `faqs.json`) loaded at build time to generate 113 static pages.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Dependencies & Setup | React, Tailwind, Framer Motion, utils, configs | M1 | Survey Explorer 2 |
| 2 | Aceternity UI Components | Install 8 required Aceternity UI components in `src/components/ui/` | M1 | Survey Explorer 2 |
| 3 | Hero Parallax (Home) | Dynamic 3D parallax scroll hero for `index.astro` | M2 | Spec Miner 1 |
| 4 | Bento Grid (Home) | Feature showcase grid with tilt & 3D cards | M2 | Spec Miner 1 |
| 5 | Infinite Moving Cards (Home) | Continuous testimonial carousel for `index.astro` & `ReviewsSection.astro` | M2 | Spec Miner 1 |
| 6 | Lamp Effect & Beams (Home CTA) | Glowing lamp heading & ambient background beams | M2 | Spec Miner 1 |
| 7 | 3D Cards (Destinos) | 3D perspective tilt cards for international shipping cities | M3 | Spec Miner 1 |
| 8 | Card Hover Effect (Destinos) | Radial spotlight backdrop on country & city grids | M3 | Spec Miner 1 |
| 9 | City Landing Pages (`[slug].astro`) | 102 dynamic city pages with 3D cards, logistics & calculators | M4 | Spec Miner 1 |
| 10 | Variety Color Pages (`colores/[slug].astro`) | 5 exotic color variety pages with Hover Effect & Moving Border | M4 | Spec Miner 1 |
| 11 | Pricing Page (`precios-bulldog-fluffy.astro`) | Renovated price table matrix, factors cards & accordions | M5 | Spec Miner 1 |
| 12 | Sobre Nosotros Page (`sobre-nosotros.astro`) | Brand history, ADN standards & pedigree registration badges | M5 | Spec Miner 1 |
| 13 | Blog Index & Article Pages (`blog/`) | Markdown blog cards with stylized borders & hover effects | M5 | Spec Miner 1 |
| 14 | Header & Navbar (`Base.astro`) | Navigation links, megamenu, theme toggle, mobile drawer hover polish | M6 | Spec Miner 1 |
| 15 | Footer (`Base.astro`) | 4-column footer layout with legal info & background beams | M6 | Spec Miner 1 |
| 16 | Quiz Modal (`QuizModal.astro`) | Lead qualification 3-step modal with Aceternity polish | M6 | Spec Miner 1 |
| 17 | Food Calculator (`CalculadoraComida.astro`) | Interactive RER food portion calculator | M6 | Spec Miner 1 |
| 18 | Age Calculator (`CalculadoraEdad.astro`) | Logarithmic canine-human age calculator | M6 | Spec Miner 1 |
| 19 | Shipping Accordion (`ShippingAccordion.astro`) | Flight nanny logistics accordion with glowing borders | M6 | Spec Miner 1 |
| 20 | WhatsApp CTA & Floating Button | Contextual CTA banner & floating button hover state | M6 | Spec Miner 1 |
| 21 | Site-wide Hover States | Hover polish on all interactive cards, links, tabs, buttons | M6 | Spec Miner 1 |
| 22 | Clean Build & Audit Verification | 100% clean compilation via `npm run build` + Forensic Audit | M7 | Original Request |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Setup & Aceternity UI Installation | React, Tailwind, Framer Motion, `cn()`, configs & 8 Aceternity UI components | None | DONE |
| M2 | Home Page Redesign | `index.astro` (Hero Parallax, Bento Grid, Moving Cards, Lamp, Beams) | M1 | DONE |
| M3 | Destinos Page Redesign | `destinos.astro` (3D Cards, Card Hover Effect, City Search) | M1 | PLANNED |
| M4 | Razas & Colores Pages Redesign | `colores/[slug].astro` & `[slug].astro` (Hover Effect, Moving Border) | M1 | PLANNED |
| M5 | Precios, Sobre Nosotros & Blog Redesign | `precios-bulldog-fluffy.astro`, `sobre-nosotros.astro`, `blog/` | M1 | PLANNED |
| M6 | Global Components & Navigation Polish | Header, Footer, QuizModal, Calculators, ShippingAccordion, WA Float, Hover polish | M1 | PLANNED |
| M7 | E2E Build Verification & Forensic Audit | `npm run build` verification (113 pages), Reviewers, Challengers, Forensic Auditor | M1-M6 | PLANNED |

## Interface Contracts
### Aceternity Components ↔ Astro Pages
- TSX components in `src/components/ui/` imported in `.astro` files must use appropriate client directives (`client:load` for interactive scroll/hover components).
- Utility `cn()` in `src/lib/utils.ts` handles class merging for Tailwind + custom styles.

## Code Layout
- `src/components/ui/`: Aceternity UI React components (`hero-parallax.tsx`, `card-hover-effect.tsx`, `3d-card.tsx`, `bento-grid.tsx`, `lamp.tsx`, `background-beams.tsx`, `infinite-moving-cards.tsx`, `moving-border.tsx`).
- `src/lib/utils.ts`: Helper utility `cn()` using `clsx` and `tailwind-merge`.
- `tailwind.config.mjs`: Tailwind CSS configuration with brand dark theme tokens (`#140e26`, `#a855f7`, `#c084fc`, `#9333ea`).
- `src/pages/`: Astro pages and dynamic routes.
- `src/components/`: Astro component wrappers and legacy widgets.
- `src/layouts/Base.astro`: Site layout, fonts, header, footer, global theme.
