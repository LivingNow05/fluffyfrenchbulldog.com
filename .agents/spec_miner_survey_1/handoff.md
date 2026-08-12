# Handoff Report — Specification Mining for Bulldog Fluffy Redesign

**Agent**: Spec Miner 1 (`teamwork_preview_spec_miner`)  
**Working Directory**: `/Users/anthony/Downloads/Bulldog Fluffy/.agents/spec_miner_survey_1`  
**Date**: 2026-08-06  

---

## 1. Observation

Direct examination of `/Users/anthony/Downloads/Bulldog Fluffy/ORIGINAL_REQUEST.md`, project source files (`src/pages/*`, `src/components/*`, `src/data/*`, `src/styles/*`, `src/layouts/*`), and data sets (`dataset_fluffy_stories.csv`, `dataset_enriched_stories.csv`, `fluffy.json`, `faqs.json`, `src/data/blog/*.md`) revealed the complete functional and visual architecture of the website:

1. **Pages & Routes (7 Page Groups)**:
   - **Home Page (`src/pages/index.astro`)**: Hero section, Bento feature grid, Cobertura Internacional VIP (12 quick-link city cards + CTA link to `/destinos/`), Exotic Varieties section (5 varieties), Real Customer Reviews section, Food Portion Calculator (`CalculadoraComida.astro`), FAQ section (`faqsData.general`), WhatsApp CTA banner (`WhatsAppCTA.astro`).
   - **Destinos Page (`src/pages/destinos.astro`)**: Instant city search with auto-complete (`#city-search`), filter buttons for 20+ countries, country-grouped grids rendering 100+ cities from `dataset_fluffy_stories.csv`, Logistical Travel Nanny Accordion (`ShippingAccordion.astro`), WhatsApp CTA.
   - **Dynamic City Landing Pages (`src/pages/[slug].astro`)**: Static route generation from 102 CSV entries (`dataset_fluffy_stories.csv` with fallback to `dataset_enriched_stories.csv`). Features AEO Quick Answer Box, EEAT Veterinary Medical Authority box (Reg. Prof. M.V. 14892), Local History (`item.historia`), Price Table for city, 5-variety gallery grid with badges, Shipping Accordion (`ShippingAccordion.astro`), Food Calculator, Customer Reviews, FAQ, WhatsApp CTA, and Quiz Modal.
   - **Precios Page (`src/pages/precios-bulldog-fluffy.astro`)**: Price breakdown ($2,300 USD to $6,800 USD), full flattened pricing matrix across 5 varieties and 11 sub-variants, 3-card influencing factors grid, FAQs, WhatsApp CTA.
   - **Sobre Nosotros Page (`src/pages/sobre-nosotros.astro`)**: Brand mission, 4-item medical and genetic spec list (Panel ADN, Salud Cardíaca & Articular, Socialización, Envíos Niñera Aérea), registration badges (AKC, FCI, ACCC, Pedigree Internacional), WhatsApp CTA.
   - **Blog Index & Post Pages (`src/pages/blog/index.astro` & `src/pages/blog/[slug].astro`)**: Grid of blog cards reading `src/data/blog/*.md` sorted by date; individual article reader with `BlogPosting` schema and markdown content.
   - **Colores & Variety Pages (`src/pages/colores/[slug].astro`)**: Dynamic page generation for 5 varieties (`fluffy-blue`, `fluffy-visual-isabella`, `fluffy-lilac`, `fluffy-fluffy-cocoa`, `fluffy-merle`), featuring `Product` Schema, quick answer box, price table, 7 spec traits with icons, detailed care text, variety FAQs, reviews, and 4 other recommended varieties.

2. **Global Components & Navigation**:
   - **Header/Navbar (`Base.astro` lines 126-197)**: Dual logo (dark/light theme PNGs), desktop navigation links (`Precios`, `Variedades`, `Ciudades` megamenu dropdown with 4 columns, `Blog`, `Criadero`), WhatsApp button (`nav-cta`), visual theme toggle (`#theme-toggle`), and mobile hamburger toggle (`#menu-toggle`).
   - **Footer (`Base.astro` lines 201-244)**: 4-column footer with brand summary, exotic varieties links, cities links, legal/info links, and copyright text referencing Colombian Animal Welfare Law 1774 of 2016.
   - **QuizModal (`src/components/QuizModal.astro` & `public/scripts/quiz-modal.js`)**: Interactive 3-step lead qualification modal for WhatsApp. Step 1: Budget range, Step 2: Sex preference, Step 3: Destination city input. Calculates best match from catalog (`fluffy.json`), presents top matches with prices and "MEJOR MATCH" badge, generates customized WhatsApp link. Intercepts all WhatsApp links on the site.
   - **CalculadoraComida (`src/components/CalculadoraComida.astro`)**: Weight range slider (2.0 to 16.0 kg), life stage selector, RER formula calculation `70 * (weight ^ 0.75)`, animated counter for recommended daily portion (grams).
   - **CalculadoraEdad (`src/components/CalculadoraEdad.astro`)**: Age slider (0.5 to 15.0 years), logarithmic canine age equivalence formula `16 * ln(age) + 31`.
   - **ShippingAccordion (`src/components/ShippingAccordion.astro`)**: 4 collapsible accordions (1. Viaje VIP en Cabina, 2. Certificados de Salud & PCR, 3. Garantía ADN 2 Años, 4. Trámites de Aduana & Entrega).
   - **WhatsAppCTA & Floating Button (`WhatsAppCTA.astro`, `WhatsAppIcon.astro`, `.whatsapp-float`)**: Persistent bottom-right floating button with tooltip and context-aware conversion banner.

3. **Aceternity UI Mapping Requirements**:
   - `hero-parallax`: `@aceternity/hero-parallax` mapped to Home (`src/pages/index.astro`).
   - `bento-grid`: `@aceternity/bento-grid` mapped to Home (`src/pages/index.astro`).
   - `infinite-moving-cards`: `@aceternity/infinite-moving-cards` mapped to Home (`src/pages/index.astro`) and `ReviewsSection.astro`.
   - `lamp`: `@aceternity/lamp` mapped to Home CTA (`src/pages/index.astro`).
   - `background-beams`: `@aceternity/background-beams` mapped to Home CTA & Footer (`src/pages/index.astro` & `Base.astro`).
   - `3d-card`: `@aceternity/3d-card` mapped to Destinos (`src/pages/destinos.astro`) & City pages (`[slug].astro`).
   - `card-hover-effect`: `@aceternity/card-hover-effect` mapped to Variety cards (`colores/` & `[slug].astro`), Destinos, Precios, and Blog.
   - `moving-border`: `@aceternity/moving-border` mapped to Variety cards, pricing cards, and high-priority CTA buttons.

---

## 2. Logic Chain

1. **Source Inspection & Requirement Extraction**:
   - By parsing `ORIGINAL_REQUEST.md` alongside every file in `src/pages/` and `src/components/`, we mapped 100% of website pages, dynamic routes, and UI components.
   - By analyzing `package.json` (`astro`, `shadcn`, `@fontsource-variable/inter`, `@fontsource-variable/space-grotesk`), we confirmed that font declarations for `Inter` and `Space Grotesk` must remain untouched while Aceternity UI components are installed via `npx shadcn@latest add @aceternity/...`.

2. **Aceternity UI Mapping Strategy**:
   - Each page component was evaluated against Aceternity UI capabilities to ensure a cohesive luxury dark theme overhaul:
     - `HeroCentered.astro` → Upgraded to `Hero Parallax` for dynamic 3D scroll immersion.
     - `BentoFeatures.astro` → Upgraded to `Bento Grid` with tilt and floating 3D elements.
     - `ReviewsSection.astro` → Upgraded to `Infinite Moving Cards` for smooth continuous testimonials.
     - `WhatsAppCTA.astro` → Enhanced with `Lamp Effect` and `Background Beams` for focal lighting.
     - `destinos.astro` & `[slug].astro` destination cards → Upgraded to `3D Card` + `Card Hover Effect`.
     - `colores/[slug].astro` variety cards → Upgraded to `Card Hover Effect` + `Moving Border`.

3. **Data Integrity & Content Preservation**:
   - Data files (`src/data/fluffy.json`, `src/data/faqs.json`, `dataset_fluffy_stories.csv`, `dataset_enriched_stories.csv`, `src/data/blog/*.md`) contain essential pricing ($2,300–$6,800 USD), pedigree registration records (AKC, FCI, ACCC), health guarantees (2 years written contract), and 102 city stories. Any loss of text or structure would break dynamic page generation in `src/pages/[slug].astro` and SEO rankings.

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Page | Home (`src/pages/index.astro`) | Main showcase landing page featuring Hero, Bento Features, 12 Featured Cities, 5 Exotic Varieties, Reviews, Calculator, FAQs, CTA. | `fluffy.json`, `faqs.json` | Rendered HTML home page | Fallback default values if JSON fields missing | Codebase Inspection (`src/pages/index.astro`) |
| 2 | Page | Destinos (`src/pages/destinos.astro`) | International destinations hub with instant city search and country filters (+100 cities). | `dataset_fluffy_stories.csv`, Search input query string | Filtered city card grid and instant dropdown | Displays "No se encontraron ciudades con ese nombre" | Codebase Inspection (`src/pages/destinos.astro`) |
| 3 | Page | Dynamic City Landing Pages (`src/pages/[slug].astro`) | 102 dynamic city landing pages with EEAT medical box, local history, price table, variety gallery, logistics. | CSV row parameters (`slug`, `ciudad`, `aeropuerto`, `historia`) | Individual city SEO page with schema | Falls back from `dataset_fluffy_stories.csv` to `dataset_enriched_stories.csv` | Codebase Inspection (`src/pages/[slug].astro`) |
| 4 | Page | Razas & Colores (`src/pages/colores/[slug].astro`) | Ficha técnica pages for 5 varieties (`fluffy-blue`, `fluffy-visual-isabella`, `fluffy-lilac`, `fluffy-fluffy-cocoa`, `fluffy-merle`). | `fluffy.json` (`variedades`), `faqs.json` (`variedades`) | Detailed variety page with specs and prices | Returns empty array for FAQs if slug not found in `faqsData` | Codebase Inspection (`src/pages/colores/[slug].astro`) |
| 5 | Page | Precios (`src/pages/precios-bulldog-fluffy.astro`) | Official 2026 price breakdown table for all 11 sub-variants across Colombia, Mexico, USA, and world. | `fluffy.json` (`variedades.variantes`) | Full price matrix table ($2.3k-$6.8k USD) | Renders empty table if varieties fail to parse | Codebase Inspection (`src/pages/precios-bulldog-fluffy.astro`) |
| 6 | Page | Sobre Nosotros (`src/pages/sobre-nosotros.astro`) | Brand history, ethical breeding philosophy, medical standards, and AKC/FCI affiliations. | `fluffy.json` (`site`) | Informational brand page | Renders default affiliation list | Codebase Inspection (`src/pages/sobre-nosotros.astro`) |
| 7 | Page | Blog (`src/pages/blog/` & `[slug].astro`) | Blog index and single article viewer reading markdown files in `src/data/blog/`. | Markdown files (`src/data/blog/*.md`) | Rendered article list and HTML post | Sorts by date; handles missing frontmatter gracefully | Codebase Inspection (`src/pages/blog/`) |
| 8 | Global Component | Header/Navbar (`Base.astro`) | Main site header with dual dark/light logo, links, megamenu for cities, WhatsApp CTA, theme toggle, mobile toggle. | `fluffy.json`, localStorage `theme` | Interactive responsive header | Defaults to dark theme if localStorage empty | Codebase Inspection (`src/layouts/Base.astro`) |
| 9 | Global Component | Footer (`Base.astro`) | Site footer with 4 navigation columns, brand info, affiliations, Colombian Ley 1774 animal welfare notice. | `fluffy.json` (`site`, `variedades`) | Rendered footer layout | Renders standard year and copyright notice | Codebase Inspection (`src/layouts/Base.astro`) |
| 10 | Global Component | QuizModal (`QuizModal.astro` & `quiz-modal.js`) | Lead qualification quiz modal collecting budget, sex, and destination city to recommend varieties. | User selections (budget, sex, city input) | Filtered recommendations & pre-filled WA link | Falls back to default WA message if inputs skipped | Codebase Inspection (`src/components/QuizModal.astro`) |
| 11 | Global Component | CalculadoraComida (`CalculadoraComida.astro`) | Daily food portion calculator using RER/DER canine nutritional formulas. | Weight (2-16 kg slider), activity stage select | Grams per day (animated integer count) | Calculates default at 10.0 kg if input unadjusted | Codebase Inspection (`src/components/CalculadoraComida.astro`) |
| 12 | Global Component | CalculadoraEdad (`CalculadoraEdad.astro`) | Human-equivalent canine age calculator using logarithmic formula `16 * ln(age) + 31`. | Dog age (0.5-15 years slider) | Human equivalent age in years | Uses linear multiplier `age * 15` for puppies under 1 year | Codebase Inspection (`src/components/CalculadoraEdad.astro`) |
| 13 | Global Component | ShippingAccordion (`ShippingAccordion.astro`) | 4-step accordion detailing Travel Nanny flight, health certificates, 2-year ADN guarantee, customs. | `ciudad`, `aeropuerto` strings | Interactive HTML details elements | Uses "tu ciudad" default if props omitted | Codebase Inspection (`src/components/ShippingAccordion.astro`) |
| 14 | Global Component | WhatsAppCTA & Floating Button | High-converting call-to-action banner with context text, badges, paw trail, plus floating bottom-right button. | `contexto` string, `site.whatsapp` | WhatsApp link trigger (opens QuizModal) | Intercepts click to launch QuizModal first | Codebase Inspection (`src/components/WhatsAppCTA.astro`) |
| 15 | Aceternity UI | `@aceternity/hero-parallax` | Dynamic 3D parallax scroll effect for Home hero section. | Hero images array & titles | Interactive 3D parallax showcase | Degrades gracefully on disabled JS | ORIGINAL_REQUEST.md & Spec Mining |
| 16 | Aceternity UI | `@aceternity/card-hover-effect` | Radial spotlight tracking cursor movement over grid cards. | Grid items | Interactive spotlight backdrop | Standard card fallback | ORIGINAL_REQUEST.md & Spec Mining |
| 17 | Aceternity UI | `@aceternity/3d-card` | Multi-layer 3D tilt perspective transform for destination and variety cards. | Card container & inner layers | 3D perspective tilt on hover | Flat card fallback | ORIGINAL_REQUEST.md & Spec Mining |
| 18 | Aceternity UI | `@aceternity/bento-grid` | Modular grid layout for features showcase. | Grid item components | Structured Bento grid | Flexbox/CSS grid fallback | ORIGINAL_REQUEST.md & Spec Mining |
| 19 | Aceternity UI | `@aceternity/lamp` | Overhead glowing spotlight effect for section headers. | Header text children | Dramatic visual beam effect | Static text heading fallback | ORIGINAL_REQUEST.md & Spec Mining |
| 20 | Aceternity UI | `@aceternity/background-beams` | Animated glowing background beam paths. | Section container | Background ambient animation | Static dark background fallback | ORIGINAL_REQUEST.md & Spec Mining |
| 21 | Aceternity UI | `@aceternity/infinite-moving-cards` | Continuous horizontal scrolling marquee for client testimonials. | Testimonial card array | Smooth infinite marquee | Static grid fallback | ORIGINAL_REQUEST.md & Spec Mining |
| 22 | Aceternity UI | `@aceternity/moving-border` | Animated glowing border tracing around featured cards/buttons. | Button/Card wrapper | Tracing border animation | Static border fallback | ORIGINAL_REQUEST.md & Spec Mining |

---

## 4. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Dynamic City Pages (`[slug].astro`) | Missing `dataset_fluffy_stories.csv` file | Fallbacks to `dataset_enriched_stories.csv` and rewrites `Maine Coon` / `felino` strings to `Bulldog Francés Fluffy` / `canino`. |
| 2 | City Search Bar (`destinos.astro`) | Query string under 2 characters or non-existent city name | Search container hidden when < 2 chars; displays "No se encontraron ciudades con ese nombre" when no matches found. |
| 3 | Quiz Modal (`quiz-modal.js`) | User submits empty destination input or closes modal early | Uses "No indicada" or title-detected city, falls back to default WhatsApp template without crashing. |
| 4 | Food Calculator (`CalculadoraComida.astro`) | Rapid slider movement across min (2.0kg) to max (16.0kg) values | Interval timer animates number transition smoothly without stacking multiple interval loops. |
| 5 | Canine Age Calculator (`CalculadoraEdad.astro`) | Age under 1.0 year (e.g. 0.5 years) | Switches from logarithmic formula to linear formula `Math.round(age * 15)` to avoid negative log values. |
| 6 | Theme Toggle (`Base.astro`) | Light mode active on high-contrast dark sections | `.hero`, `.cta-box`, `.site-footer` maintain explicit dark CSS variables (`--moon: #f5f3ff`, `--paper: #140e26`) while rest of page adapts to `.light-theme`. |
| 7 | Mobile Nav Menu (`Base.astro`) | User taps links or presses Escape key while menu is open | Toggles `active` class, removes `nav-active` from body to restore scrolling, sets `aria-expanded="false"`. |

---

## 5. Caveats

1. **Shadcn & Aceternity UI Installation**: The project currently has `shadcn` in `devDependencies` and `@aceternity` registry configured in `components.json`. Installing the 8 required Aceternity components (`hero-parallax`, `card-hover-effect`, `3d-card`, `bento-grid`, `lamp`, `background-beams`, `infinite-moving-cards`, `moving-border`) will add React/Framer Motion dependencies which must be configured cleanly with Astro (`@astrojs/react` or client directives `client:load` / `client:visible`).
2. **Text Preservation Integrity**: All data files (`fluffy.json`, `faqs.json`, CSVs, markdown posts) must remain intact. Any edits during UI component integration must be non-destructive to raw textual content.

---

## 6. Conclusion

The specification mining for the Bulldog Fluffy redesign project is 100% complete. Every page, component, data asset, Aceternity UI mapping, and hover state requirement has been cataloged. Implementation teams can execute R1 (Aceternity installation), R2 (visual overhaul & hover states), R3 (content & font preservation), and R4 (compilation verification) against this authoritative baseline.

---

## 7. Verification Method

1. **Source Inspection Verification**:
   - Run `ls -la src/pages/ src/components/ src/data/ dataset_fluffy_stories.csv` to confirm all source assets exist.
2. **Build Verification**:
   - Execute `npm run build` to verify clean Astro compilation without TypeScript or syntax errors.
3. **Data Integrity Verification**:
   - Verify that `fluffy.json`, `faqs.json`, and `dataset_fluffy_stories.csv` match raw contents without text truncation.
