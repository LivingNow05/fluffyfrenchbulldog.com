# Handoff Report — Hero Parallax & Bento Grid Integration (Milestone 2)

## 1. Observation

### 1.1 Home Page & Hero Section
- **File**: `src/pages/index.astro` (lines 21-29)
  - Currently includes `<HeroCentered />` inside `<section class="hero hero--centered-only">`.
- **File**: `src/components/HeroCentered.astro` (lines 13-107)
  - Contains exact text:
    - **Badges**: `"📜 Pedigree Oficial AKC & FCI"`, `"🧬 ADN 100% Pura Raza"`, `"🏥 Garantía Genética 2 Años"`.
    - **Title**: `"Perros Bulldog Francés Fluffy"`.
    - **Lead Paragraph**: `"Especialistas en la crianza de linajes puros de pelaje afelpado exótico. Variedades Fluffy Blue, Visual Isabella, Lilac, Cocoa y Merlé con pedigree internacional y protocolo de entrega VIP con niñera aérea en cabina."`.
    - **CTAs**: `"Consultar Disponibilidad por WhatsApp"` (link to WhatsApp with prefilled message) and `"Ver Catálogo & Precios 2026"` (`/precios-bulldog-fluffy/`).
    - **Showcase Badge & Varieties Bar**: `"📷 FOTOGRAFÍA REAL DE CRIADERO · EJEMPLARES AKC & FCI"`, pills (`"Fluffy Blue"`, `"Visual Isabella"`, `"Lilac"`, `"Cocoa"`, `"Merlé"`).
    - **Stats**: `"5 Variedades Exóticas"`, `"+100 Ciudades con Niñera Aérea"`, `"100% Garantía Genética Certificada"`, `"+12 Países con Envíos VIP"`.

### 1.2 Aceternity HeroParallax Component
- **File**: `src/components/ui/hero-parallax.tsx` (lines 13-160)
  - Accepts `products: { title: string; link: string; thumbnail: string; }[]`.
  - Splits products into 3 rows (`slice(0, 5)`, `slice(5, 10)`, `slice(10, 15)`), requiring exactly **15 showcase entries** for full row population.
  - Contains a default `Header` subcomponent (lines 104-117) with generic placeholder text (`"The Ultimate development studio"`) that needs refactoring to incorporate 100% of the original `HeroCentered.astro` text.

### 1.3 Data & Image Assets
- **File**: `src/data/fluffy.json` (lines 16-214)
  - Contains 5 exotic varieties: `fluffy-blue`, `fluffy-visual-isabella`, `fluffy-lilac`, `fluffy-fluffy-cocoa`, `fluffy-merle`.
- **Directory**: `public/images/`
  - Images available:
    - `public/images/variedades/fluffy-blue.jpg`
    - `public/images/variedades/fluffy-visual-isabella.jpg`
    - `public/images/variedades/fluffy-lilac.jpg`
    - `public/images/variedades/fluffy-fluffy-cocoa.jpg`
    - `public/images/variedades/fluffy-merle.jpg`
    - `public/images/fluffy-showcase-hero.jpg`
    - `public/images/fluffy-showcase-hero-light.jpg`
    - `public/images/testimonios/testimonio_real_1.jpg`
    - `public/images/testimonios/testimonio_real_2.jpg`
    - `public/images/testimonios/testimonio_real_3.jpg`

### 1.4 Bento Grid Component & Features
- **File**: `src/components/BentoFeatures.astro` (lines 4-68)
  - Contains original text:
    - **Header**: Kicker: `"💎 EXCELENCIA GENÉTICA"`, Title: `"El Estándar de la Realeza Canina"`, Lead: `"Criamos la más alta gama de Bulldog Francés Fluffy combinando salud de hierro, genética exótica y un servicio de entrega global cinco estrellas."`.
    - **Card 1**: `"Especialistas en el Gen Fluffy"` | `"Dominamos la cría de cachorros portadores y visuales del gen de pelo largo (L4), logrando mantos afelpados incomparables en colores exóticos como Blue, Isabella, Lilac, Cocoa y Merlé."` | Image `/images/variedades/fluffy-lilac.jpg`.
    - **Card 2**: `"Envíos VIP en Cabina"` | `"Entrega personalizada por \"Flight Nannies\" directo en tus brazos, en más de 100 aeropuertos a nivel global sin escalas en bodega."` | Icon `✈️`.
    - **Card 3**: `"Pedigree AKC / FCI"` | `"Linajes puros certificados por el American Kennel Club y la Fédération Cynologique Internationale, asegurando morfología de campeones."` | Icon `📜`.
    - **Card 4**: `"Garantía Genética de 2 Años"` | `"Nuestros cachorros pasan rigurosos controles veterinarios y pruebas de ADN. Tu inversión está respaldada por una garantía escrita inigualable en el mercado de criadores élite."` | Badge `"100% HEALTH GUARANTEE"`.
- **File**: `src/components/ui/bento-grid.tsx` (lines 3-54)
  - Exports `BentoGrid` container (`grid max-w-7xl grid-cols-1 md:grid-cols-3 gap-4`) and `BentoGridItem` card (`title`, `description`, `header`, `icon`, `className`).

---

## 2. Logic Chain

1. **Text Integrity Requirement**: R3 mandates 100% text preservation. Replacing `HeroCentered.astro` with `HeroParallax` and `BentoFeatures.astro` with `BentoGrid` must retain every badge, title, lead, link, and statistic without omission.
2. **HeroParallax Adaptation**:
   - Update `Header` inside `src/components/ui/hero-parallax.tsx` to render the original badge strip, title, lead, action buttons, and statistical grid.
   - Construct a 15-item `products` array for `HeroParallax` in `src/pages/index.astro` pairing exotic varieties, delivery destinations, and pedigree certifications with corresponding images from `public/images/`.
3. **BentoGrid Adaptation**:
   - Refactor `src/components/BentoFeatures.astro` to use React `BentoGrid` and `BentoGridItem` components.
   - Map Card 1 (Span 2 large card with image header), Card 2 (Span 1 VIP flight nanny card), Card 3 (Span 1 Pedigree AKC/FCI card), and Card 4 (Span 2 100% Health Guarantee card).
4. **Client Hydration Directive**: `HeroParallax` relies on Framer Motion scroll listeners (`useScroll`, `useTransform`, `useSpring`) and must be mounted with `client:load` in `src/pages/index.astro`.

---

## 3. Caveats

- **Height & Scroll Perspective**: `HeroParallax` sets `h-[300vh]`. This creates a smooth 3D scroll effect. Layout testing during compilation will confirm spacing flow with adjacent sections.
- **Dark Theme Palette**: The Aceternity UI components default to dark theme styling (`bg-black`, `border-white/[0.2]`, `text-white`), which aligns perfectly with the brand tokens (`#140e26`, `#a855f7`, `#c084fc`).

---

## 4. Conclusion & Proposed Code Design

### 4.1 Update `src/components/ui/hero-parallax.tsx`
Refactor the `Header` component in `src/components/ui/hero-parallax.tsx` to include the full original text and CTA elements:

```tsx
"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";

export const HeroParallax = ({
  products,
  whatsappHref = "https://wa.me/573128375043",
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  whatsappHref?: string;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header whatsappHref={whatsappHref} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ whatsappHref }: { whatsappHref?: string }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-20 px-4 w-full left-0 top-0 flex flex-col items-center text-center">
      {/* Insignias AKC / FCI Certificadas */}
      <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-500/30 rounded-full px-5 py-2 mb-6 flex-wrap justify-center text-xs md:text-sm font-bold text-purple-200">
        <span>📜 Pedigree Oficial AKC & FCI</span>
        <span className="text-purple-400 opacity-60">•</span>
        <span>🧬 ADN 100% Pura Raza</span>
        <span className="text-purple-400 opacity-60">•</span>
        <span>🏥 Garantía Genética 2 Años</span>
      </div>

      {/* Titular Masivo */}
      <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-display">
        Perros <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Bulldog Francés Fluffy</span>
      </h1>

      {/* Párrafo Descriptivo Editorial */}
      <p className="max-w-3xl text-base md:text-xl text-neutral-300 leading-relaxed mb-8">
        Especialistas en la crianza de linajes puros de pelaje afelpado exótico. Variedades Fluffy Blue, Visual Isabella, Lilac, Cocoa y Merlé con pedigree internacional y protocolo de entrega VIP con niñera aérea en cabina.
      </p>

      {/* Botones de Acción Principales */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <a
          href={whatsappHref || "https://wa.me/573128375043"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Consultar por WhatsApp"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-emerald-600/30 transition duration-200 hover:-translate-y-1"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          <span>Consultar Disponibilidad por WhatsApp</span>
        </a>
        <a
          href="/precios-bulldog-fluffy/"
          className="inline-flex items-center gap-2 bg-purple-900/30 hover:bg-purple-900/50 text-white font-semibold px-6 py-4 rounded-full border border-purple-500/30 transition duration-200 hover:-translate-y-0.5"
        >
          <span>Ver Catálogo & Precios 2026</span>
          <span>→</span>
        </a>
      </div>

      {/* Grid de Contador Estadístico */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-4">
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-purple-400 font-display">5</span>
          <span className="text-xs md:text-sm font-medium text-purple-200/80">Variedades Exóticas</span>
        </div>
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-purple-400 font-display">+100</span>
          <span className="text-xs md:text-sm font-medium text-purple-200/80">Ciudades con Niñera Aérea</span>
        </div>
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-purple-400 font-display">100%</span>
          <span className="text-xs md:text-sm font-medium text-purple-200/80">Garantía Genética Certificada</span>
        </div>
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-purple-400 font-display">+12</span>
          <span className="text-xs md:text-sm font-medium text-purple-200/80">Países con Envíos VIP</span>
        </div>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0 rounded-2xl overflow-hidden border border-purple-500/20"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl h-full w-full"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0 transition duration-500 group-hover/product:scale-105"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none transition duration-300"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-bold text-lg pointer-events-none transition duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};
```

### 4.2 Update `src/components/BentoFeatures.astro`
Replace legacy inline tilt script with `BentoGrid` and `BentoGridItem`:

```astro
---
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
---

<section id="features" class="bento-section py-20 relative overflow-hidden">
  <div class="wrap max-w-7xl mx-auto px-4">
    <div class="bento-header text-center max-w-2xl mx-auto mb-12">
      <span class="bento-kicker inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/25 rounded-full text-xs font-extrabold text-purple-400 mb-4 uppercase tracking-widest">
        💎 EXCELENCIA GENÉTICA
      </span>
      <h2 class="bento-title text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
        El Estándar de la Realeza Canina
      </h2>
      <p class="bento-lead text-base md:text-lg text-neutral-300 leading-relaxed">
        Criamos la más alta gama de Bulldog Francés Fluffy combinando salud de hierro, genética exótica y un servicio de entrega global cinco estrellas.
      </p>
    </div>

    <BentoGrid className="max-w-7xl mx-auto">
      {/* Tarjeta 1: Genética (Grande, span 2) */}
      <BentoGridItem
        title="Especialistas en el Gen Fluffy"
        description="Dominamos la cría de cachorros portadores y visuales del gen de pelo largo (L4), logrando mantos afelpados incomparables en colores exóticos como Blue, Isabella, Lilac, Cocoa y Merlé."
        icon={<span class="text-3xl">🧬</span>}
        className="md:col-span-2 group/bento hover:shadow-2xl hover:shadow-purple-500/20 transition duration-300 bg-neutral-900/80 border-white/10"
        header={
          <div class="flex flex-1 w-full h-48 md:h-64 rounded-xl overflow-hidden relative border border-purple-500/20">
            <img 
              src="/images/variedades/fluffy-lilac.jpg" 
              alt="Cachorro Bulldog Francés Fluffy" 
              class="w-full h-full object-cover group-hover/bento:scale-105 transition duration-500" 
            />
          </div>
        }
      />

      {/* Tarjeta 2: Envíos VIP */}
      <BentoGridItem
        title="Envíos VIP en Cabina"
        description="Entrega personalizada por \"Flight Nannies\" directo en tus brazos, en más de 100 aeropuertos a nivel global sin escalas en bodega."
        icon={<span class="text-3xl">✈️</span>}
        className="md:col-span-1 group/bento hover:shadow-2xl hover:shadow-purple-500/20 transition duration-300 bg-neutral-900/80 border-white/10"
        header={
          <div class="flex flex-1 w-full h-32 rounded-xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 items-center justify-center">
            <span class="text-5xl">✈️</span>
          </div>
        }
      />

      {/* Tarjeta 3: Certificación y Pedigree */}
      <BentoGridItem
        title="Pedigree AKC / FCI"
        description="Linajes puros certificados por el American Kennel Club y la Fédération Cynologique Internationale, asegurando morfología de campeones."
        icon={<span class="text-3xl">📜</span>}
        className="md:col-span-1 group/bento hover:shadow-2xl hover:shadow-purple-500/20 transition duration-300 bg-neutral-900/80 border-white/10"
        header={
          <div class="flex flex-1 w-full h-32 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/20 items-center justify-center">
            <span class="text-5xl">📜</span>
          </div>
        }
      />

      {/* Tarjeta 4: Garantía Genética de 2 Años */}
      <BentoGridItem
        title="Garantía Genética de 2 Años"
        description="Nuestros cachorros pasan rigurosos controles veterinarios y pruebas de ADN. Tu inversión está respaldada por una garantía escrita inigualable en el mercado de criadores élite."
        icon={<span class="text-3xl">🏥</span>}
        className="md:col-span-2 group/bento hover:shadow-2xl hover:shadow-amber-500/20 transition duration-300 bg-neutral-900/80 border-white/10"
        header={
          <div class="flex flex-1 w-full h-32 rounded-xl bg-gradient-to-r from-purple-900/30 to-amber-900/30 border border-amber-500/30 items-center justify-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center text-center text-[0.7rem] font-black text-amber-950 shadow-xl border-2 border-white/20 rotate-6">
              100% HEALTH<br/>GUARANTEE
            </div>
          </div>
        }
      />
    </BentoGrid>
  </div>
</section>
```

### 4.3 Update `src/pages/index.astro`
Integrate `<HeroParallax client:load products={heroProducts} whatsappHref={waHref} />`:

```astro
---
import Base from '../layouts/Base.astro';
import WhatsAppIcon from '../components/WhatsAppIcon.astro';
import WhatsAppCTA from '../components/WhatsAppCTA.astro';
import { HeroParallax } from '@/components/ui/hero-parallax';
import BentoFeatures from '../components/BentoFeatures.astro';
import CalculadoraComida from '../components/CalculadoraComida.astro';
import FaqSection from '../components/FaqSection.astro';
import ReviewsSection from '../components/ReviewsSection.astro';
import fluffy from '../data/fluffy.json';
import faqsData from '../data/faqs.json';

const { site, variedades } = fluffy;
const waHref = `https://wa.me/${site.whatsapp.replace(/[^\d]/g, '')}`;

const heroProducts = [
  { title: "Fluffy Blue Visual", link: "/colores/fluffy-blue/", thumbnail: "/images/variedades/fluffy-blue.jpg" },
  { title: "Fluffy Visual Isabella", link: "/colores/fluffy-visual-isabella/", thumbnail: "/images/variedades/fluffy-visual-isabella.jpg" },
  { title: "Fluffy Lilac Platinum", link: "/colores/fluffy-lilac/", thumbnail: "/images/variedades/fluffy-lilac.jpg" },
  { title: "Fluffy Cocoa Fawn", link: "/colores/fluffy-fluffy-cocoa/", thumbnail: "/images/variedades/fluffy-fluffy-cocoa.jpg" },
  { title: "Fluffy Blue Merlé", link: "/colores/fluffy-merle/", thumbnail: "/images/variedades/fluffy-merle.jpg" },
  { title: "Ejemplares de Selección AKC", link: "/sobre-nosotros/", thumbnail: "/images/fluffy-showcase-hero.jpg" },
  { title: "Envíos VIP Bogotá (BOG)", link: "/bulldog-frances-fluffy-bogota/", thumbnail: "/images/testimonios/testimonio_real_1.jpg" },
  { title: "Envíos VIP CDMX (MEX)", link: "/bulldog-frances-fluffy-cdmx/", thumbnail: "/images/testimonios/testimonio_real_2.jpg" },
  { title: "Envíos VIP Medellín (MDE)", link: "/bulldog-frances-fluffy-medellin/", thumbnail: "/images/testimonios/testimonio_real_3.jpg" },
  { title: "Linajes Puros Certificados", link: "/precios-bulldog-fluffy/", thumbnail: "/images/fluffy-showcase-hero-light.jpg" },
  { title: "Fluffy Blue Portador", link: "/colores/fluffy-blue/", thumbnail: "/images/variedades/fluffy-blue.jpg" },
  { title: "Fluffy Isabella Compañía", link: "/colores/fluffy-visual-isabella/", thumbnail: "/images/variedades/fluffy-visual-isabella.jpg" },
  { title: "Fluffy Lilac Tan", link: "/colores/fluffy-lilac/", thumbnail: "/images/variedades/fluffy-lilac.jpg" },
  { title: "Fluffy Cocoa Estándar", link: "/colores/fluffy-fluffy-cocoa/", thumbnail: "/images/variedades/fluffy-fluffy-cocoa.jpg" },
  { title: "Fluffy Isabella Merlé", link: "/colores/fluffy-merle/", thumbnail: "/images/variedades/fluffy-merle.jpg" }
];
---

<Base
  title="Dinastía Bulldog Fluffy | Criadero de Bulldog Francés Fluffy con Pedigree"
  description="Criadero especializado en Bulldog Francés Fluffy de raza pura. Variedades Fluffy Blue, Visual Isabella, Lilac, Cocoa y Merlé con registro AKC, FCI y garantía genética."
>
  {/* HERO PARALLAX REDESIGN */}
  <HeroParallax client:load products={heroProducts} whatsappHref={waHref} />

  <!-- SECCIÓN BENTO 3D DE CARACTERÍSTICAS -->
  <BentoFeatures />

  <section id="ciudades" class="seccion-ciudades scroll-mt">
    <!-- SECCIÓN DE CIUDADES DESTACADAS -->
    <section style="margin: 60px 0 40px;">
      <div style="text-align: center; max-width: 720px; margin: 0 auto 36px;">
        <span style="display: inline-block; padding: 4px 14px; background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 999px; font-size: 0.8rem; font-weight: 800; color: var(--brand-bright); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">📍 COBERTURA INTERNACIONAL VIP</span>
        <h2 id="cobertura" class="reveal" style="font-size: clamp(2rem, 3.8vw, 3rem); font-weight: 850; margin: 0 0 12px; color: var(--ink);">Entregas y Cobertura por Ciudad</h2>
        <p class="lead reveal" style="font-size: 1.05rem; color: var(--ink-soft); margin: 0;">Realizamos envíos personales con niñera aérea en cabina climatizada a más de 100 ciudades en todo el mundo. Haz clic en tu ciudad para conocer el protocolo local.</p>
      </div>
      
      <div class="grid reveal" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px;">
        {[
          { city: 'Bogotá', country: 'Colombia', airport: 'El Dorado (BOG)', slug: 'bulldog-frances-fluffy-bogota' },
          { city: 'Medellín', country: 'Colombia', airport: 'José María Córdova (MDE)', slug: 'bulldog-frances-fluffy-medellin' },
          { city: 'Cali', country: 'Colombia', airport: 'Alfonso Bonilla (CLO)', slug: 'bulldog-frances-fluffy-cali' },
          { city: 'Barranquilla', country: 'Colombia', airport: 'Ernesto Cortissoz (BAQ)', slug: 'bulldog-frances-fluffy-barranquilla' },
          { city: 'CDMX', country: 'México', airport: 'Benito Juárez (MEX)', slug: 'bulldog-frances-fluffy-cdmx' },
          { city: 'Guadalajara', country: 'México', airport: 'Guadalajara (GDL)', slug: 'bulldog-frances-fluffy-guadalajara' },
          { city: 'Monterrey', country: 'México', airport: 'Monterrey (MTY)', slug: 'bulldog-frances-fluffy-monterrey' },
          { city: 'Buenos Aires', country: 'Argentina', airport: 'Ezeiza (EZE)', slug: 'bulldog-frances-fluffy-buenos-aires' },
          { city: 'Santiago', country: 'Chile', airport: 'Arturo Merino (SCL)', slug: 'bulldog-frances-fluffy-santiago' },
          { city: 'Lima', country: 'Perú', airport: 'Jorge Chávez (LIM)', slug: 'bulldog-frances-fluffy-lima' },
          { city: 'São Paulo', country: 'Brasil', airport: 'Guarulhos (GRU)', slug: 'bulldog-frances-fluffy-sao-paulo' },
          { city: 'Panamá', country: 'Panamá', airport: 'Tocumen (PTY)', slug: 'bulldog-frances-fluffy-panama' }
        ].map((item) => (
          <a class="card city-card" href={`/${item.slug}/`} style="padding: 20px; text-decoration: none; border-radius: 16px; transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 1.3rem;">✈️</span>
              <span style="font-size: 0.72rem; font-weight: 800; background: rgba(147, 51, 234, 0.12); color: var(--brand-bright); padding: 2px 8px; border-radius: 999px;">VIP CABIN</span>
            </div>
            <strong style="display: block; font-size: 1.1rem; font-weight: 800; color: var(--ink); margin-bottom: 4px;">{item.city}</strong>
            <p style="font-size: 0.82rem; margin: 0 0 14px; color: var(--ink-soft);">{item.country} · Aeropuerto {item.airport}</p>
            <span class="btn-card-cta" style="font-size: 0.85rem; font-weight: 750; color: var(--brand-bright); display: inline-flex; align-items: center; gap: 4px;">Ver Protocolo →</span>
          </a>
        ))}
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <a class="btn btn--secondary" href="/destinos/" style="padding: 14px 28px; font-weight: 750;">Ver la Lista Completa de +100 Ciudades →</a>
      </div>
    </section>

    <!-- SECCIÓN DE VARIEDADES EXÓTICAS -->
    <section style="margin: 80px 0 40px;">
      <div style="text-align: center; max-width: 720px; margin: 0 auto 36px;">
        <span style="display: inline-block; padding: 4px 14px; background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 999px; font-size: 0.8rem; font-weight: 800; color: var(--brand-bright); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">👑 LINAGE EXCLUSIVO AKC / FCI</span>
        <h2 id="variedades" class="reveal" style="font-size: clamp(2rem, 3.8vw, 3rem); font-weight: 850; margin: 0 0 12px; color: var(--ink);">Variedades de Bulldog Francés Fluffy</h2>
        <p class="lead reveal" style="font-size: 1.05rem; color: var(--ink-soft); margin: 0;">Crianza de linajes puros en las variedades exóticas de pelaje afelpado largo más exclusivas del mundo.</p>
      </div>
      
      <div class="grid reveal" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
        {variedades.map((v) => (
          <a class="card" href={`/colores/${v.slug}/`} style="text-decoration: none; border-radius: 18px; overflow: hidden;">
            <div style="position: relative; overflow: hidden; height: 220px;">
              <img src={`/images/variedades/${v.slug}.jpg`} alt={`Bulldog Francés ${v.nombre}`} loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" />
              <div style="position: absolute; top: 12px; right: 12px; background: rgba(20, 14, 38, 0.85); border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 999px; padding: 4px 12px; font-size: 0.75rem; font-weight: 800; color: #c084fc;">
                Desde ${v.variantes?.[0]?.precioUSD?.toLocaleString() || '2,300'} USD
              </div>
            </div>
            <div class="card-body" style="padding: 20px;">
              <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 8px; color: var(--ink);">{v.nombre}</h3>
              <p style="font-size: 0.88rem; color: var(--ink-soft); margin: 0 0 16px; line-height: 1.5;">{v.resumen}</p>
              <span class="btn-card-cta" style="font-size: 0.88rem; font-weight: 750; color: var(--brand-bright); display: inline-flex; align-items: center; gap: 4px;">Ver Ficha Técnica y Fotos →</span>
            </div>
          </a>
        ))}
      </div>
    </section>

    <!-- RESEÑAS DE CLIENTES REALES -->
    <ReviewsSection />

    <!-- CALCULADORA DE ALIMENTACIÓN -->
    <CalculadoraComida />

    <!-- PREGUNTAS FRECUENTES -->
    <FaqSection title="Preguntas Frecuentes sobre el Bulldog Francés Fluffy" faqs={faqsData.general} />

    <WhatsAppCTA 
      title="¿Listo para recibir a tu nuevo Bulldog Francés Fluffy?"
      subtitle="Contáctanos hoy por WhatsApp. Te enviamos fotos y videos en tiempo real de los cachorros disponibles y coordinamos la entrega con niñera aérea."
    />
  </section>
</Base>
```

---

## 5. Verification Method

To verify this implementation:
1. Run build verification command:
   ```bash
   npm run build
   ```
2. Verify zero TypeScript or JSX syntax errors during static site generation for `src/pages/index.astro`.
3. Verify output page contains exact original text substrings:
   - `"📜 Pedigree Oficial AKC & FCI"`
   - `"Perros Bulldog Francés Fluffy"`
   - `"Especialistas en la crianza de linajes puros de pelaje afelpado exótico."`
   - `"💎 EXCELENCIA GENÉTICA"`
   - `"El Estándar de la Realeza Canina"`
   - `"Garantía Genética de 2 Años"`
