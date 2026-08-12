## 2026-08-06T16:32:48Z
You are Worker M2 (teamwork_preview_worker) for Milestone 2 (Home Page Redesign).
Your working directory is: /Users/anthony/Downloads/Bulldog Fluffy/.agents/worker_m2

MANDATORY INPUTS:
- Original Request: /Users/anthony/Downloads/Bulldog Fluffy/ORIGINAL_REQUEST.md
- Project Scope: /Users/anthony/Downloads/Bulldog Fluffy/PROJECT.md
- Explorer M2-1 Handoff: /Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_m2_1/handoff.md
- Explorer M2-2 Handoff: /Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_m2_2/handoff.md
- Explorer M2-3 Handoff: /Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_m2_3/handoff.md

OBJECTIVE:
Execute the complete redesign of the Home Page (`src/pages/index.astro`) and associated components using Aceternity UI:
1. Update `src/components/ui/hero-parallax.tsx`:
   - Refactor `Header` to render 100% of original `HeroCentered.astro` content: Badges (`📜 Pedigree Oficial AKC & FCI`, `🧬 ADN 100% Pura Raza`, `🏥 Garantía Genética 2 Años`), Title (`Perros Bulldog Francés Fluffy`), Lead Paragraph, CTAs (`Consultar Disponibilidad por WhatsApp`, `Ver Catálogo & Precios 2026`), and Stats Grid (`5 Variedades Exóticas`, `+100 Ciudades`, `100% Garantía Genética`, `+12 Países`).
2. Update `src/components/ui/infinite-moving-cards.tsx`:
   - Extend `InfiniteMovingCardItem` interface to support `img`, `avatar`, `colorBg`, `ciudad`, `variedad`, `rating`, `verified` so customer cards render real puppy photos and location badges.
3. Update `src/components/ui/lamp.tsx`:
   - Adjust gradient glow colors to brand lilac/purple (`from-purple-500 via-purple-300 to-indigo-400`) and dark background (`bg-[#090514]` / `#140e26`).
4. Update `src/components/BentoFeatures.astro`:
   - Use `BentoGrid` and `BentoGridItem` (`@/components/ui/bento-grid`) to render the 4 feature cards (Genetics, VIP Flight Nanny, AKC/FCI Pedigree, 2-Year Guarantee).
5. Update `src/components/ReviewsSection.astro`:
   - Integrate `InfiniteMovingCards` (`client:load`) using real customer review data from `fluffy.json` and preserve the `reviewsSchema` JSON-LD script.
6. Update `src/components/WhatsAppCTA.astro`:
   - Integrate `LampContainer` (`client:load`) and `BackgroundBeams` (`client:load`) while preserving WhatsApp link triggers (`wa.me`), context text, and affiliation badges.
7. Update `src/pages/index.astro`:
   - Replace `<HeroCentered />` with `<HeroParallax client:load products={heroProducts} whatsappHref={waHref} />`.
   - Retain `<BentoFeatures />`, 12 VIP cities grid, 5 exotic varieties gallery, `<ReviewsSection />`, `<CalculadoraComida />`, `<FaqSection />`, and `<WhatsAppCTA />`.
8. Verification:
   - Run `npx tsc --noEmit` and confirm 0 TypeScript errors.
   - Run `npm run build` and confirm exit code 0 (113 pages built).
