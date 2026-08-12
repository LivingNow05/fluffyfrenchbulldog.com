# Handoff Report — Milestone 2: Home Page Redesign Investigation

## 1. Observation

### Codebase & Component State
- **Source Page**: `src/pages/index.astro` (117 lines) currently renders:
  - Header & Layout wrapper: `<Base title="..." description="...">` (`src/layouts/Base.astro`)
  - Hero Section: `<HeroCentered />` inside `.hero.hero--centered-only` with gold/emerald ambient orbs.
  - Features Section: `<BentoFeatures />`
  - VIP Cities Grid: Inline 12-city grid section (`#ciudades`) mapping:
    1. Bogotá (`bulldog-frances-fluffy-bogota`)
    2. Medellín (`bulldog-frances-fluffy-medellin`)
    3. Cali (`bulldog-frances-fluffy-cali`)
    4. Barranquilla (`bulldog-frances-fluffy-barranquilla`)
    5. CDMX (`bulldog-frances-fluffy-cdmx`)
    6. Guadalajara (`bulldog-frances-fluffy-guadalajara`)
    7. Monterrey (`bulldog-frances-fluffy-monterrey`)
    8. Buenos Aires (`bulldog-frances-fluffy-buenos-aires`)
    9. Santiago (`bulldog-frances-fluffy-santiago`)
    10. Lima (`bulldog-frances-fluffy-lima`)
    11. São Paulo (`bulldog-frances-fluffy-sao-paulo`)
    12. Panamá (`bulldog-frances-fluffy-panama`)
  - Exotic Varieties Section: Grid mapping `fluffy.variedades` (5 varieties: Fluffy Blue, Visual Isabella, Lilac, Fluffy Cocoa, Merlé) linking to `/colores/[slug]/`.
  - Testimonials: `<ReviewsSection />` (`src/components/ReviewsSection.astro`)
  - Food Calculator: `<CalculadoraComida />` (`src/components/CalculadoraComida.astro`)
  - FAQ Section: `<FaqSection title="..." faqs={faqsData.general} />` (`src/components/FaqSection.astro`)
  - WhatsApp CTA: `<WhatsAppCTA title="..." subtitle="..." />` (`src/components/WhatsAppCTA.astro`)

- **Installed Aceternity UI Components** (`src/components/ui/`):
  1. `hero-parallax.tsx`: `HeroParallax` component (requires `products` array with at least 15 items).
  2. `bento-grid.tsx`: `BentoGrid` and `BentoGridItem`.
  3. `infinite-moving-cards.tsx`: `InfiniteMovingCards` (requires `items` array with `quote`, `name`, `title`).
  4. `lamp.tsx`: `LampContainer` / `LampDemo`.
  5. `background-beams.tsx`: `BackgroundBeams`.
  6. `card-hover-effect.tsx`: `HoverEffect`.
  7. `3d-card.tsx`: `CardContainer`, `CardBody`, `CardItem`.
  8. `moving-border.tsx`: `Button`.

- **Current Build Baseline**:
  - `npm run build` executed successfully producing 113 static pages in `dist/` with 0 compilation errors.

## 2. Logic Chain

### A. Component & Layout Integration
1. **`HeroParallax`**: Needs 15 product items to populate 3 rows (5 items per row). Data should be constructed from 5 exotic varieties + 10 top VIP cities with local thumbnails (`/images/variedades/*.jpg`, `/images/testimonios/*.jpg`, `/images/fluffy-showcase-hero.jpg`).
   - *Crucial Finding*: `hero-parallax.tsx` currently hardcodes boilerplate text ("The Ultimate development studio") inside its internal `<Header />` subcomponent. `hero-parallax.tsx` must be updated to accept `title` and `description` props (or render custom title/description) to preserve 100% of the Bulldog Fluffy branding text ("Perros Bulldog Francés Fluffy", AKC/FCI badges, lead copy, WhatsApp & catalog buttons).
2. **`BentoGrid` & `BentoGridItem`**: Integrate seamlessly into `BentoFeatures.astro` or directly in `index.astro` to showcase the 4 core pillars: Genética Fluffy (L4), Envíos VIP en Cabina, Pedigree AKC/FCI, and Garantía Genética 2 Años.
3. **`InfiniteMovingCards`**: Fed directly by `fluffy.json` (`testimonios` dataset). Maps `quote: t.texto`, `name: `${t.nombre} (${t.ciudad})``, and `title: `✓ Verificado · Variedad ${t.variedad}``.
4. **`LampContainer` & `BackgroundBeams`**: Wrap the final CTA section. Must be styled with brand purple/lilac glow gradients instead of default cyan.
5. **Preserved Content Checklist**:
   - 12 VIP Cities grid with airport codes, links, and VIP CABIN badges.
   - 5 Exotic Varieties grid with price badges and links to `/colores/[slug]/`.
   - `<CalculadoraComida />` (RER portion calculator).
   - `<FaqSection />` with JSON-LD schema.
   - `<Base />` layout contract with header megamenu, theme toggle, footer, QuizModal, GSAP scripts, and WhatsApp floating CTA.

### B. CSS Conflict & Styling Diagnostics
1. **Dark/Light Theme Class Mapping Conflict**:
   - `Base.astro` line 110 manages theme by adding `.light-theme` to `document.documentElement` for light mode and removing it for dark mode (default = dark theme `#140e26`).
   - `tailwind.config.mjs` line 3 specifies `darkMode: ['class', '.light-theme']`.
   - *Impact*: In standard Tailwind usage, `dark:` classes apply when the configured class is present. If `darkMode: ['class', '.light-theme']` is active, standard Aceternity classes like `bg-white dark:bg-black` will render white in dark mode and black in light mode.
   - *Resolution for Worker M2*: Update Aceternity component color classes to use project design tokens (`var(--surface)`, `var(--paper)`, `var(--ink)`, `var(--border)`, `bg-[#1d1536]`, `bg-[#140e26]`, `border-[#3b2a6b]`) or explicit Tailwind classes matched to the dark theme baseline.
2. **Color Palette Alignment**:
   - `lamp.tsx` defaults to `bg-slate-950` and `from-cyan-500` / `bg-cyan-400`.
   - *Resolution*: Change gradients to brand lilac/purple (`from-purple-500`, `via-purple-600`, `to-purple-400`, `#c084fc`, `#a855f7`) and background to `#140e26`.
3. **Typography**:
   - All components inherit `Inter` (sans) and `Space Grotesk` (display) from `global.css` and `Base.astro`.

## 3. Caveats
- `HeroParallax` relies on mouse scroll height (`h-[300vh]`). `client:load` directive is required for proper React state hydration in Astro.
- Image paths passed to `HeroParallax` must exist in `public/images/` to prevent broken image renders during scroll.

## 4. Conclusion & Worker M2 Checklist

### Concrete Checklist for Worker M2:
1. **Update `src/components/ui/hero-parallax.tsx`**:
   - Add optional `title` and `description` props to `HeroParallax` / `Header`.
   - Replace boilerplate header text with props/Bulldog Fluffy branding.
2. **Update `src/components/ui/lamp.tsx`**:
   - Replace `slate-950` with `#140e26` (`bg-night`).
   - Replace cyan gradients with brand purple/lilac gradients (`#c084fc`, `#a855f7`, `purple-500`).
3. **Update `src/components/ui/infinite-moving-cards.tsx`**:
   - Style card background with `#1d1536` (dark surface) and border `rgba(192, 132, 252, 0.2)`.
4. **Update `src/components/ui/bento-grid.tsx`**:
   - Ensure card background and text colors use theme variables (`var(--surface)`, `var(--ink)`).
5. **Redesign `src/pages/index.astro`**:
   - Integrate `<HeroParallax client:load products={heroProducts} />` with 15 product cards + headline text + action buttons + stats grid.
   - Integrate `<BentoGrid>` & `<BentoGridItem>` for features.
   - Retain 12 VIP Cities grid section (`#ciudades`).
   - Retain 5 Exotic Varieties section (`#variedades`).
   - Integrate `<InfiniteMovingCards client:load items={testimonialItems} />` for reviews.
   - Retain `<CalculadoraComida />`.
   - Retain `<FaqSection title="..." faqs={faqsData.general} />`.
   - Integrate `<LampContainer>` and `<BackgroundBeams>` around WhatsApp CTA.
   - Retain `<Base>` wrapper and layout structure.
6. **Verify Build**:
   - Run `npm run build` and ensure 113 pages compile cleanly with 0 errors.

## 5. Verification Method

To verify independent execution of Milestone 2:
1. Run build command:
   ```bash
   npm run build
   ```
   *Expected result*: `113 page(s) built` with 0 errors.
2. Inspect `dist/index.html` to confirm presence of:
   - `HeroParallax` markup and product cards.
   - Bento grid feature items.
   - All 12 VIP cities (Bogotá, Medellín, Cali, Barranquilla, CDMX, Guadalajara, Monterrey, Buenos Aires, Santiago, Lima, São Paulo, Panamá).
   - All 5 varieties (Fluffy Blue, Visual Isabella, Lilac, Fluffy Cocoa, Merlé).
   - Food calculator HTML (`calculadora-comida`).
   - FAQ HTML and JSON-LD schema (`FAQPage`).
   - Infinite moving cards / testimonials.
   - Lamp container & background beams CTA.
