## 2026-08-06T11:53:00Z
Task Assignment:
Implement Milestone 5 Redesign for Precios, Sobre Nosotros & Blog Pages (`src/pages/precios-bulldog-fluffy.astro`, `src/pages/sobre-nosotros.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`):

1. **Pricing Page (`src/pages/precios-bulldog-fluffy.astro`)**:
   - Create `src/components/precios/PriceFactorsHoverGrid.tsx` wrapping `src/components/ui/card-hover-effect.tsx` hover background spotlight logic.
   - Use `Button` / `MovingBorderBox` from `@/components/ui/moving-border` for the official price guide box and reservation CTA button (`client:visible`).
   - Retain `PriceTable.astro`, `ShippingAccordion.astro`, `FaqSection.astro`, and `WhatsAppCTA.astro`.
   - Preserve 100% of price figures ($2,300 - $6,800 USD, MXN equivalents), flight nanny notice ($1,000 USD), and health guarantees.

2. **Sobre Nosotros Page (`src/pages/sobre-nosotros.astro`)**:
   - Create `src/components/sobre-nosotros/MissionMovingBorder.tsx` for the mission highlight (`moving-border.tsx`).
   - Create `src/components/sobre-nosotros/Affiliations3DGrid.tsx` for 3D tilt cards on AKC, FCI, ACCC, Pedigree Internacional (`3d-card.tsx`).
   - Create `src/components/sobre-nosotros/VeterinaryStandardsGrid.tsx` for 3D cards on medical & genetic standards (`3d-card.tsx`).
   - Create `src/components/sobre-nosotros/FacilityShowcase3D.tsx` for 3D facility & breeding standards (`3d-card.tsx`).
   - Refactor `sobre-nosotros.astro` using these hydrated components (`client:visible`), preserving 100% of original text.

3. **Blog Index & Article Pages (`src/pages/blog/index.astro` and `src/pages/blog/[slug].astro`)**:
   - Create `src/components/blog/BlogHoverGrid.tsx` for the blog article grid using `card-hover-effect.tsx` (`client:visible`).
   - Add VIP Newsletter / Consultation CTA section in `blog/index.astro` using `MovingBorderBox`.
   - Redesign `blog/[slug].astro` with dark high-contrast editorial typography (`#140e26` background, glowing category badges, reading time, author, date), `MovingBorderBox` footer CTA, and 100% preservation of `BlogPosting` JSON-LD schema and Markdown post content (`src/data/blog/*.md`).

VERIFICATION REQUIREMENT:
- Execute `npx tsc --noEmit` to verify 0 TypeScript errors.
- Execute `npm run build` from project root to verify all 113 static pages build clean without errors.
- Document build results in `/Users/anthony/Downloads/Bulldog Fluffy/.agents/worker_m5/handoff.md`.
