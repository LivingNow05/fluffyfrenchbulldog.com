## 2026-08-06T16:59:05Z
You are Worker M6 for the Bulldog Fluffy redesign project.
Your working directory is: /Users/anthony/Downloads/Bulldog Fluffy/.agents/worker_m6

MANDATORY INPUTS & SPECIFICATIONS:
- Project Root: /Users/anthony/Downloads/Bulldog Fluffy
- Original Request: /Users/anthony/Downloads/Bulldog Fluffy/ORIGINAL_REQUEST.md
- Project Scope: /Users/anthony/Downloads/Bulldog Fluffy/PROJECT.md
- Explorer 1 Report (Header, Navbar, Footer, Base Layout): /Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_m6_1/handoff.md
- Explorer 2 Report (Modals & Calculators): /Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_m6_2/handoff.md
- Explorer 3 Report (Accordions, WhatsApp CTAs & Hover Polish): /Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_m6_3/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

TASK ASSIGNMENT:
Implement Milestone 6 Redesign for Global Components, Navigation, Modals, Calculators, and Site-wide Hover Polish:

1. **Header, Navbar & Footer (`src/layouts/Base.astro`, `src/styles/global.css`)**:
   - Refactor Header & Navbar with Aceternity UI glowing border accents and enhanced megamenu hover states.
   - Integrate `<BackgroundBeams client:load />` (from `@/components/ui/background-beams`) into `<footer class="site-footer">`.
   - Preserve 100% of 33 navigation links, logo, legal text, affiliations (AKC, FCI, ACCC, Pedigree Internacional), price verification notice (`julio 2026`), Law 1774 of 2016 copyright, and `Inter` & `Space Grotesk` fonts.

2. **Interactive Modals & Calculators (`src/components/QuizModal.astro`, `src/components/CalculadoraComida.astro`, `src/components/CalculadoraEdad.astro`)**:
   - Redesign `QuizModal.astro` with dark glassmorphic styling (`backdrop-blur-2xl bg-[#08080c]/90`), `MovingBorder` glowing accents, and smooth 3-step transitions.
   - Redesign `CalculadoraComida.astro` & `CalculadoraEdad.astro` with illuminated sliders, dark velvet cards, and glowing purple-gold gradient numbers.
   - Preserve 100% of calculation math: RER food portions (RER = 70 * weight^0.75, DER factors), logarithmic canine age (16 * ln(age) + 31), and quiz recommendation scoring.

3. **Shipping Accordion & WhatsApp Widgets (`src/components/ShippingAccordion.astro`, `src/components/WhatsAppCTA.astro`, `src/components/WhatsAppFloat.astro`)**:
   - Enhance `ShippingAccordion.astro` with glowing border container (`moving-border.tsx` / `MovingBorderBox`) and smooth accordion open/close animations.
   - Update `WhatsAppCTA.astro` using `Button` from `@/components/ui/moving-border` (`as="a"`, emerald radial gradient).
   - Create/refactor `WhatsAppFloat.astro` for floating WhatsApp widget with pulse animation, emerald aura, and hover tooltip.
   - Preserve 100% of flight nanny logistics text, $1,000 USD flight nanny notice, medical certificates, and WhatsApp phone links (`https://wa.me/573128375043`).

4. **Site-wide Hover Polish**:
   - Standardize hover states across all interactive buttons, cards, links, tabs, and widgets site-wide in `global.css`.

VERIFICATION REQUIREMENT:
- Execute `npx tsc --noEmit` to verify 0 TypeScript errors.
- Execute `npm run build` from project root to verify all 113 static pages build clean without errors.
- Document build results in `/Users/anthony/Downloads/Bulldog Fluffy/.agents/worker_m6/handoff.md`.

Report back via send_message when done.
