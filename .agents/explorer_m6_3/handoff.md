# Handoff Report — Explorer M6 3: Shipping Accordions, WhatsApp CTAs, Floating Widgets, & Site-wide Hover Polish

**Agent ID**: `explorer_m6_3`  
**Milestone**: Milestone 6 — Global Components & Navigation Polish  
**Working Directory**: `/Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_m6_3`  
**Date**: 2026-08-06  

---

## 1. Observation

### 1.1 Inspected Files & Locations

1. **`src/components/ShippingAccordion.astro`** (170 lines):
   - **Props**: `ciudad` (default `'tu ciudad'`), `aeropuerto` (default `'Aeropuerto Internacional'`).
   - **Logistics Content Array (`pasosLogistica`)**:
     - Item 1: `titulo`: `'✈️ 1. Viaje VIP en Cabina con Travel Nanny'`, `resumen`: `'Tu cachorro nunca viaja en bodega de carga. Viaja en cabina de pasajeros al cuidado exclusivo de nuestra niñera aérea profesional.'`, `detalle`: `'Cada entrega para ${ciudad} se realiza mediante una Travel Nanny certificada que mantiene al cachorro en cabina climatizada con atención médica veterinaria, alimentación programada y monitoreo de temperatura constante durante todo el vuelo hacia ${aeropuerto}.'`
     - Item 2: `titulo`: `'🩺 2. Certificados de Salud Internacional & PCR'`, `resumen`: `'Documentación médica completa avalada por médicos veterinarios con registro profesional.'`, `detalle`: `'El cachorro se entrega con examen clínico reciente, test PCR de salud negativo, certificado de vacunación al día (parvovirus, moquillo, rabia según edad), desparasitación interna/externa y microchip de identificación ISO 11784/11785.'`
     - Item 3: `titulo`: `'🧬 3. Garantía de Salud & Pureza Genética ADN'`, `resumen`: `'Certificado de registro de pedigree internacional y garantía genética escrita por 2 años.'`, `detalle`: `'Respaldamos la pureza de manto (Gen L4/L1 Lh) y la salud de cada ejemplar con prueba de filiación genética por ADN y garantía de salud por escrito frente a enfermedades congénitas.'`
     - Item 4: `titulo`: `'📦 4. Trámites de Aduana & Entrega en Mano'`, `resumen`: `'Gestión aduanera y sanitaria simplificada para recibir en el aeropuerto o en tu domicilio.'`, `detalle`: `'Nos encargamos de los permisos de exportación/importación ICA / SAG / SENASA / SAGARPA según el país de destino. Te entregamos al cachorro personalmente en el ${aeropuerto} o coordinamos el traslado final directo a tu puerta.'`
   - **Current Markup & Styling**:
     - Wrapper `.shipping-accordion-wrapper` uses static CSS `border: 1px solid rgba(168, 85, 247, 0.3)` and `box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(168, 85, 247, 0.15)`.
     - Items use native `<details class="shipping-details">` with `<summary class="shipping-summary">`.

2. **`src/components/WhatsAppCTA.astro`** (62 lines):
   - **Imports**: `LampContainer` from `@/components/ui/lamp`, `BackgroundBeams` from `@/components/ui/background-beams`, `WhatsAppIcon` from `./WhatsAppIcon.astro`, `fluffy` from `../data/fluffy.json`.
   - **Props**: `contexto?: string` (default `'tu cachorro Bulldog Fluffy'`), `title?: string`, `subtitle?: string`.
   - **Copy & Parameters**:
     - `headerTitle`: `title || "¿Buscas " + contexto + "?"`
     - `headerSubtitle`: `subtitle || "Escríbenos directamente por WhatsApp y te compartiremos fotos, videos en vivo, certificados de pedigree y detalles del envío seguro a tu ciudad (el valor del transporte suele rondar los $1.000 USD según la ubicación)."`
     - `numero`: `fluffy.site.whatsapp.replace(/[^\d]/g, '')` (resolves to `573128375043`).
     - `waHref`: `https://wa.me/573128375043?text=${encodeURIComponent('Hola, me interesa ' + contexto + '. Quisiera ver fotos y detalles.')}`.
     - CTA text: `Consultar disponibilidad inmediata por WhatsApp`.
   - **Current CTA Button**: Static HTML `<a>` tag with Tailwind classes `bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40`.

3. **Floating WhatsApp Widget** (`src/layouts/Base.astro`, lines 301–304 & `src/styles/global.css`, lines 2700–2734):
   - Markup currently inline in `Base.astro`:
     ```html
     <a class="whatsapp-float" href={`https://wa.me/${site.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener" aria-label="Hablar por WhatsApp">
       <span class="whatsapp-float-tooltip">💬 ¿Hablamos por WhatsApp?</span>
       <WhatsAppIcon size={28} />
     </a>
     ```
   - Styled via `.whatsapp-float` in `global.css`: fixed position (`bottom: 28px; right: 28px; z-index: 999;`), `animation: pulse-whatsapp 2.5s infinite;`, `.whatsapp-float:hover` (`transform: scale(1.14) rotate(6deg)`).

4. **`src/components/ui/moving-border.tsx`** (140 lines):
   - Aceternity UI component using Framer Motion (`motion`, `useAnimationFrame`, `useMotionValue`, `useTransform`, `useMotionTemplate`).
   - Exports React `Button` component: accepts `as?: any` (default `'button'`), `borderRadius?: string` (default `'1.75rem'`), `containerClassName?: string`, `borderClassName?: string`, `duration?: number` (default `3000`), `className?: string`, `children: React.ReactNode`.
   - Renders a animated SVG `<rect>` path with a radial gradient element following the border.

5. **`src/components/colores/MovingBorderBox.tsx` & `src/components/sobre-nosotros/MissionMovingBorder.tsx`**:
   - Reusable React wrappers demonstrating `Button` from `@/components/ui/moving-border` with `as="div"`, custom `borderRadius`, and `borderClassName="bg-[radial-gradient(#c084fc_40%,transparent_60%)]"`.

6. **`src/styles/global.css` Hover Tokens & Rules**:
   - `.btn:hover` (lines 184–206): `transform: translateY(-4px) scale(1.02);` + shimmer streak `::before` animation.
   - `.btn--amber:hover` (lines 216–221): `box-shadow: 0 16px 42px var(--amber-glow), 0 0 30px rgba(246, 201, 109, 0.55);`
   - `.btn--whatsapp:hover` / `.nav-cta:hover` (lines 313–316, 653–663): `background: #1cb051; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(31, 179, 85, 0.5);`
   - `.card:hover`, `.city-card:hover`, `.price-card:hover`, `.qm-card:hover` (lines 1691–1703): `transform: translateY(-5px); box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.5); border-color: rgba(139, 92, 246, 0.45);` + `::after` radial spotlight opacity 1.

---

## 2. Logic Chain

1. **Logistics Accordion (`ShippingAccordion.astro`) Enhancement**:
   - *Observation*: `ShippingAccordion.astro` currently wraps its accordion in a static CSS container `.shipping-accordion-wrapper`.
   - *Reasoning*: To align with the Aceternity UI redesign strategy established in Milestones 1–5, logistics accordions should be enclosed in a glowing moving border container powered by `moving-border.tsx` (e.g. `ShippingAccordionMovingBorder.tsx` React component or `MovingBorderBox` pattern with `borderClassName="bg-[radial-gradient(#c084fc_40%,transparent_60%)]"`).
   - *Preservation*: The inner accordion markup, `<details>` collapse/expand functionality, and 100% of the 4 logistics steps copy (Travel Nanny VIP, PCR & Health Certs, ADN Pedigree 2-year guarantee, Customs & Airport handoff) must remain 100% intact without losing a single word.

2. **WhatsApp CTA Banner (`WhatsAppCTA.astro`) Enhancement**:
   - *Observation*: `WhatsAppCTA.astro` combines `LampContainer` and `BackgroundBeams`. The CTA link is currently a static Tailwind `<a>` button.
   - *Reasoning*: The primary action button inside `WhatsAppCTA.astro` is the key conversion element on city and variety pages. Wrapping this button with Aceternity UI `Button` from `moving-border.tsx` using `as="a"`, `href={waHref}`, `borderClassName="bg-[radial-gradient(#22c55e_40%,transparent_60%)] opacity-90"`, and `borderRadius="1rem"` gives it a continuous, animated emerald glowing border that draws immediate visual focus.
   - *Preservation*: Must preserve `title`, `subtitle` (including the exact text: `"(el valor del transporte suele rondar los $1.000 USD según la ubicación)"`), `waHref` format (`https://wa.me/573128375043?text=...`), and registration badges (`AKC`, `FCI`, `ACCC`, `Pedigree Internacional`).

3. **Floating WhatsApp Widget Modularization (`WhatsAppFloat.astro`)**:
   - *Observation*: The floating WhatsApp button is currently written directly inside `src/layouts/Base.astro`. Task 1 explicitly targets `src/components/WhatsAppFloat.astro`.
   - *Reasoning*: Extracting the floating WhatsApp button into a standalone Astro component `src/components/WhatsAppFloat.astro` and importing it into `Base.astro` improves modularity, allows co-location of component-level hover polish (or React moving border wrapper if desired), and preserves full compatibility with all 113 pages.
   - *Hover Polish*: Enhanced pulse animation (`animation: pulse-whatsapp 2.5s infinite`), scale expansion on hover (`transform: scale(1.14) rotate(6deg)`), radial emerald glow backdrop, and crisp glassmorphic tooltip reveal (`💬 ¿Hablamos por WhatsApp?`).

4. **Site-wide Hover Polish Standardization**:
   - *Observation*: `global.css` has hover definitions scattered across ~2900 lines with slight inconsistencies in transition timing (`0.2s` vs `0.35s` vs `0.55s`).
   - *Reasoning*: Standardizing global hover tokens into CSS variables / global classes ensures smooth, ultra-premium interactions across all devices:
     - **Cards** (`.card`, `.city-card`, `.price-card`, `.qm-card`): `transition: transform 0.35s var(--ease-out), border-color 0.35s ease, box-shadow 0.35s ease;` with elevation `translateY(-5px)` and purple highlight glow (`#c084fc`).
     - **Primary/Amber Buttons**: Shimmer streak beam sweep on hover + `translateY(-4px) scale(1.02)` + amber/purple dual glow.
     - **WhatsApp Actions**: Vibrant emerald glow (`#22c55e`), smooth scale up, and active press contraction (`scale(0.97)`).
     - **Accordion Summary Headers**: Smooth cursor pointer indicator rotation (`rotate(45deg)` on open), subtle background lift on hover (`rgba(168, 85, 247, 0.12)`).
     - **Navigation & Links**: Border-bottom underline expansion (`transform: scaleX(1)`) with `var(--ease-out)` timing.

---

## 3. Caveats

1. **React Hydration & `client:load` Directive**:
   - Components using `moving-border.tsx` rely on `framer-motion` (`motion/react`) canvas/animation frames. In Astro `.astro` files, any component rendering `moving-border.tsx` MUST include the `client:load` directive (e.g. `<ShippingAccordionMovingBorder client:load>`).
2. **Dual Theme (Dark vs. Light Theme) Styling**:
   - Dark theme uses `#140e26` / `#1d1536` with `#c084fc` purple border glow and `#22c55e` emerald WhatsApp glow.
   - Light theme (`:root.light-theme`) uses `#ffffff` / `#fbf7fe` with `#7c3aed` border glow.
   - Any moving border component must ensure readability in both modes by targeting container backgrounds and text contrast cleanly.
3. **Logistics & Financial Copy Immutability**:
   - The $1,000 USD flight nanny estimate in `WhatsAppCTA.astro` subtitle is a key financial disclosure required by project scope. It must NOT be omitted or altered.
   - Phone number `+573128375043` must remain intact across all WhatsApp CTAs.

---

## 4. Conclusion

### Summary of Architectural Plan for Implementer:

1. **`src/components/ShippingAccordion.astro`**:
   - Integrate Aceternity UI `moving-border.tsx` by wrapping the logistics accordion container in a React moving border component (e.g., `ShippingAccordionMovingBorder.tsx` or `MovingBorderBox` with `borderClassName="bg-[radial-gradient(#c084fc_40%,transparent_60%)] opacity-90"`).
   - Retain 100% of all 4 logistics steps copy, titles, bullet details, and props (`ciudad`, `aeropuerto`).

2. **`src/components/WhatsAppCTA.astro`**:
   - Upgrade the main WhatsApp button to use `Button` from `@/components/ui/moving-border` (with `as="a"`, `href={waHref}`, `borderClassName="bg-[radial-gradient(#22c55e_40%,transparent_60%)] opacity-90"` and `borderRadius="1rem"`).
   - Retain 100% of `LampContainer`, `BackgroundBeams`, header title, subtitle with $1,000 USD travel nanny estimate, and registration badges.

3. **`src/components/WhatsAppFloat.astro`**:
   - Create `src/components/WhatsAppFloat.astro` as a clean, dedicated floating action button component.
   - Import `WhatsAppFloat.astro` into `src/layouts/Base.astro`.
   - Polish floating button hover states with 3D scale rotation, pulsating emerald aura glow, and glassmorphic tooltip backdrop.

4. **Global Hover Polish (`src/styles/global.css`)**:
   - Audit and refine hover transitions across all buttons (`.btn`, `.btn--amber`, `.btn--whatsapp`, `.nav-cta`), cards (`.card`, `.city-card`, `.price-card`, `.qm-card`), navigation links, and accordion items to use consistent `--ease-out` timing (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 5. Verification Method

To verify the implementation of Milestone 6.3:

1. **Static Build Verification**:
   - Run command: `npm run build`
   - Target result: Must compile cleanly generating all 113 static HTML pages without TypeScript (`tsc`) or Astro build errors.

2. **Logistics Copy Verification**:
   - Inspect build output or rendered HTML on `destinos.html`, `precios-bulldog-fluffy.html`, and city pages (`bulldog-frances-fluffy-bogota.html`, `bulldog-frances-fluffy-cdmx.html`).
   - Confirm presence of all 4 shipping steps:
     1. "✈️ 1. Viaje VIP en Cabina con Travel Nanny"
     2. "🩺 2. Certificados de Salud Internacional & PCR"
     3. "🧬 3. Garantía de Salud & Pureza Genética ADN"
     4. "📦 4. Trámites de Aduana & Entrega en Mano"

3. **WhatsApp Link & Guarantee Verification**:
   - Confirm `https://wa.me/573128375043` URL format.
   - Confirm text "(el valor del transporte suele rondar los $1.000 USD según la ubicación)" is present in `WhatsAppCTA` renders.

4. **Hover & Visual Polish Verification**:
   - Check interactive moving border animation on shipping accordion and WhatsApp CTA button.
   - Verify floating WhatsApp widget pulse, hover scale (`1.14`), and tooltip reveal.
