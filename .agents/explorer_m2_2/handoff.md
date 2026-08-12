# Reporte de Handoff — Explorer M2-2 (Milestone 2: Testimonios & CTA Redesign)

**Fecha**: 2026-08-06  
**Agente**: Explorer M2-2 (`teamwork_preview_explorer`)  
**Objetivo**: Formular la integración de `InfiniteMovingCards` (`client:load`) en `src/components/ReviewsSection.astro` y de `LampContainer` + `BackgroundBeams` (`client:load`) en `src/components/WhatsAppCTA.astro` para `src/pages/index.astro`, preservando el 100% de los textos, datos reales de clientes e imágenes, así como la funcionalidad del CTA de WhatsApp.

---

## 1. Observation (Observaciones Directas)

### A. Estructura de `src/components/ReviewsSection.astro` y Datos Reales
- **Ruta de Archivo**: `/Users/anthony/Downloads/Bulldog Fluffy/src/components/ReviewsSection.astro` (líneas 1 a 237).
- **Carga de Datos**: Importa `fluffy.json` (líneas 215-234), conteniendo 3 testimonios reales:
  1. `Camila & Santiago` (`Bogotá, Colombia`, `Fluffy Blue`).
  2. `Dr. Fernando Ruiz` (`Ciudad de México (CDMX)`, `Fluffy Visual Isabella`).
  3. `Valeria Mendoza` (`Medellín, Colombia`, `Fluffy Merlé`).
- **Imágenes**: Asigna `/images/testimonios/testimonio_real_${idx + 1}.jpg` (línea 9). Se verificó mediante búsqueda en filesystem la existencia física de:
  - `public/images/testimonios/testimonio_real_1.jpg`
  - `public/images/testimonios/testimonio_real_2.jpg`
  - `public/images/testimonios/testimonio_real_3.jpg`
- **Metadata SEO**: Genera estructurado `JSON-LD` (`reviewsSchema`, líneas 17-35) con `AggregateRating` (4.9 / 5) y lista de reseñas.
- **Títulos y Contenido Textual Original**:
  - Título H2: `⭐ Opiniones de la Familia Dinastía`
  - Subtítulo: `Conoce la experiencia de familias reales en Colombia e Hispanoamérica que ya disfrutan de la compañía y pureza de nuestros Bulldog Francés Fluffy.`

### B. Componente `src/components/ui/infinite-moving-cards.tsx` (Aceternity UI)
- **Ruta de Archivo**: `/Users/anthony/Downloads/Bulldog Fluffy/src/components/ui/infinite-moving-cards.tsx` (líneas 1 a 118).
- **Directiva**: `"use client";` (React Component con duplicación de nodos DOM e interfaz de animación CSS `@keyframes scroll`).
- **Estado Actual de la Interfaz**: Actividad tipada sólo para `{ quote: string; name: string; title: string; }[]`.
- **Requerimiento de Extensión**: Requiere extender la interfaz para aceptar opcionalmente `img`, `avatar`, `colorBg`, `ciudad`, `variedad`, `rating`, y `verified` para no degradar visual ni informativamente la tarjeta de cliente real.

### C. Estructura de `src/components/WhatsAppCTA.astro` y Uso en el Sitio
- **Ruta de Archivo**: `/Users/anthony/Downloads/Bulldog Fluffy/src/components/WhatsAppCTA.astro` (líneas 1 a 36).
- **Props de Entrada**: `contexto?: string`, `title?: string`, `subtitle?: string`.
- **Usos Detectados**: Invocado en `index.astro` (líneas 111-114 con `title` y `subtitle`) y en otras 7 páginas (`[slug].astro`, `blog/[slug].astro`, `blog/index.astro`, `colores/[slug].astro`, `destinos.astro`, `precios-bulldog-fluffy.astro`, `sobre-nosotros.astro` usando `contexto`).
- **Lógica de Enlace WhatsApp**:
  ```typescript
  const { site } = fluffy;
  const numero = site.whatsapp.replace(/[^\d]/g, '');
  const mensaje = encodeURIComponent(`Hola, me interesa ${contexto}. Quisiera ver fotos y detalles.`);
  const waHref = `https://wa.me/${numero}?text=${mensaje}`;
  ```
- **Elementos UI**: Botón `<WhatsAppIcon size={22} class="btn-wa-icon" />` con texto `"Consultar disponibilidad inmediata por WhatsApp"`, insignias de afiliación (`AKC`, `FCI`, `ACCC`, `Pedigree Internacional`), y trazado vectorial de huellas de cachorro (`paw-trail`).

### D. Componentes `lamp.tsx` y `background-beams.tsx`
- **Rutas**:
  - `/Users/anthony/Downloads/Bulldog Fluffy/src/components/ui/lamp.tsx` (`LampContainer`)
  - `/Users/anthony/Downloads/Bulldog Fluffy/src/components/ui/background-beams.tsx` (`BackgroundBeams`)
- **Efectos Visuales**: `LampContainer` genera un haz de luz cónico superior con Framer Motion (`conic-gradient`), mientras que `BackgroundBeams` proyecta rayos vectoriales animados SVG flotantes en el fondo oscuro.

---

## 2. Logic Chain (Cadena Lógica de Razonamiento)

1. **Integración de Testimonios (`InfiniteMovingCards`)**:
   - `ReviewsSection.astro` actualmente utiliza una pista CSS flex con `animation: marquee 35s linear infinite`.
   - Al reemplazar el contenedor marquee manual por `InfiniteMovingCards` (`client:load`) de Aceternity UI, obtenemos la animación infinita pausable al pasar el cursor (`pauseOnHover={true}`).
   - Para evitar pérdida de información (fotos de los cachorros entregados, ciudad de destino, insignias de verificado y badges de variedad exótica), extendemos el componente `@/components/ui/infinite-moving-cards.tsx` con campos opcionales (`img`, `avatar`, `colorBg`, `ciudad`, `variedad`, `rating`, `verified`) manteniendo retrocompatibilidad.
   - Conservamos el esquema `JSON-LD` intacto en `ReviewsSection.astro` para preservar las métricas SEO de Google Rich Results (4.9 rating / 5 estrellas).

2. **Integración de CTA de WhatsApp (`LampContainer` + `BackgroundBeams`)**:
   - `WhatsAppCTA.astro` requiere preservar el 100% de la funcionalidad de redirección a WhatsApp (`wa.me`), los textos contextuales o directos (`title`/`subtitle` o `contexto`), los badges de pedigree (`AKC`, `FCI`, `ACCC`) y el icono SVG de WhatsApp.
   - Encapsular el contenido del CTA dentro de `LampContainer` (`client:load`) proporciona el efecto visual de lámpara resplandeciente en la parte superior.
   - Posicionar `<BackgroundBeams client:load />` en la capa base (`absolute inset-0 z-0`) añade destellos vectoriales dinámicos que complementan la estética oscura luxury de la marca (`#140e26`).
   - Para evitar un alto vertical excesivo (ya que el preset por defecto de `LampContainer` incluye `min-h-screen`), ajustaremos sus clases a `min-h-[420px] md:min-h-[480px]` con un desplazamiento controlado (`-translate-y-20` a `-translate-y-24`), logrando un banner CTA proporcional para páginas web.

---

## 3. Caveats (Aclaraciones y Supuestos)

- **Carga del Cliente (`client:load`)**: `InfiniteMovingCards`, `LampContainer` y `BackgroundBeams` son componentes React con hooks (`useEffect`, `useRef`, Framer Motion). Deben ser instanciados en Astro con la directiva `client:load` para garantizar su hidratación adecuada al cargar la página.
- **Ajuste de Altura de `LampContainer`**: El componente base de Aceternity `lamp.tsx` tiene clases `min-h-screen` y `-translate-y-80`. Al usarse como banner CTA dentro de `WhatsAppCTA.astro`, se debe asegurar que el contenedor no ocupe el 100% del alto de la pantalla ni desplace el texto fuera del área visible.
- **Compatibilidad con Múltiples Páginas**: `WhatsAppCTA.astro` es compartido por 8 páginas distintas. La propuesta respeta la firma de props `Props { contexto?: string; title?: string; subtitle?: string; }` para que funcione sin modificaciones en todo el sitio.

---

## 4. Conclusion & Proposed Code Design (Conclusión y Diseños de Código)

### A. Propuesta para `src/components/ui/infinite-moving-cards.tsx`

Actualización de la interfaz e inclusión de renderizado enriquecido si `img` está presente:

```tsx
"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export interface InfiniteMovingCardItem {
  quote: string;
  name: string;
  title: string;
  img?: string;
  avatar?: string;
  colorBg?: string;
  ciudad?: string;
  variedad?: string;
  rating?: number;
  verified?: boolean;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: InfiniteMovingCardItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[340px] max-w-full shrink-0 rounded-2xl border border-purple-500/20 bg-[#1d1536] p-5 md:w-[410px] transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col gap-3"
            key={`${item.name}-${idx}`}
          >
            {item.img && (
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-purple-950/40">
                <img
                  src={item.img}
                  alt={`Bulldog Fluffy de ${item.name}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              {item.avatar && (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-base font-extrabold text-white shrink-0 shadow-inner"
                  style={{ backgroundColor: item.colorBg || "#8b5cf6" }}
                >
                  {item.avatar}
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base leading-snug">{item.name}</span>
                  {item.verified !== false && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 border border-emerald-500/25">
                      ✓ Verificado
                    </span>
                  )}
                </div>
                <span className="text-xs text-purple-200/70">{item.title}</span>
              </div>
            </div>

            <div className="text-xs tracking-widest text-amber-400">⭐⭐⭐⭐⭐</div>

            <p className="text-sm italic leading-relaxed text-purple-100/90 flex-grow margin-0">
              "{item.quote}"
            </p>

            {item.variedad && (
              <span className="self-start rounded-full bg-purple-500/10 border border-purple-500/25 px-3 py-1 text-xs font-bold text-amber-300">
                Variedad: {item.variedad}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### B. Propuesta para `src/components/ReviewsSection.astro`

```astro
---
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import fluffy from '../data/fluffy.json';

const { testimonios } = fluffy;

const formattedReviews = testimonios.map((t, idx) => ({
  quote: t.texto,
  name: t.nombre,
  title: `Recibido en ${t.ciudad}`,
  img: `/images/testimonios/testimonio_real_${idx + 1}.jpg`,
  avatar: t.nombre.charAt(0),
  colorBg: idx === 0 ? '#f59e0b' : idx === 1 ? '#8b5cf6' : '#9333ea',
  ciudad: t.ciudad,
  variedad: t.variedad,
  rating: 5,
  verified: true,
}));

const reviewsSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Bulldog Francés Fluffy — Dinastía Fluffy',
  description: 'Cachorros Bulldog Francés Fluffy puros con pedigree internacional, test de salud y envío en cabina con Travel Nanny.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: testimonios.length.toString(),
    bestRating: '5',
    worstRating: '1'
  },
  review: testimonios.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.nombre },
    reviewBody: r.texto,
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
  }))
};
---

<script type="application/ld+json" set:html={JSON.stringify(reviewsSchema)} />

<section id="reviews" class="reviews-section reveal py-16 overflow-hidden relative">
  <div class="text-center max-w-2xl mx-auto mb-8 px-4">
    <span class="inline-block px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-extrabold text-purple-300 uppercase tracking-wider mb-3">
      ⭐ FAMILIAS SATISFECHAS
    </span>
    <h2 class="section-title text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
      Opiniones de la Familia Dinastía
    </h2>
    <p class="lead text-base text-purple-200/80 m-0">
      Conoce la experiencia de familias reales en Colombia e Hispanoamérica que ya disfrutan de la compañía y pureza de nuestros Bulldog Francés Fluffy.
    </p>
  </div>

  <InfiniteMovingCards
    client:load
    items={formattedReviews}
    direction="left"
    speed="slow"
    pauseOnHover={true}
    className="w-full"
  />
</section>
```

### C. Propuesta para `src/components/WhatsAppCTA.astro`

```astro
---
import { LampContainer } from '@/components/ui/lamp';
import { BackgroundBeams } from '@/components/ui/background-beams';
import WhatsAppIcon from './WhatsAppIcon.astro';
import fluffy from '../data/fluffy.json';

export interface Props {
  /** Texto contextual, ej. "un Bulldog Francés Fluffy Blue" */
  contexto?: string;
  title?: string;
  subtitle?: string;
}

const { 
  contexto = 'tu cachorro Bulldog Fluffy',
  title,
  subtitle
} = Astro.props;

const headerTitle = title || `¿Buscas ${contexto}?`;
const headerSubtitle = subtitle || `Escríbenos directamente por WhatsApp y te compartiremos fotos, videos en vivo, certificados de pedigree y detalles del envío seguro a tu ciudad (el valor del transporte suele rondar los $1.000 USD según la ubicación).`;

const { site } = fluffy;
const numero = site.whatsapp.replace(/[^\d]/g, '');
const mensaje = encodeURIComponent(`Hola, me interesa ${contexto}. Quisiera ver fotos y detalles.`);
const waHref = `https://wa.me/${numero}?text=${mensaje}`;
---

<section class="whatsapp-cta-section relative w-full overflow-hidden my-16 rounded-3xl bg-[#090514] border border-purple-500/20 shadow-2xl">
  <LampContainer client:load className="min-h-[440px] md:min-h-[480px] py-12 px-4">
    <div class="relative z-20 flex flex-col items-center text-center max-w-3xl mx-auto gap-6 -translate-y-24 md:-translate-y-28">
      <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300 drop-shadow-md">
        {headerTitle}
      </h2>
      <p class="text-base md:text-lg text-purple-200/80 leading-relaxed max-w-2xl margin-0">
        {headerSubtitle}
      </p>

      <a
        class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base md:text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 text-decoration-none"
        href={waHref}
        rel="noopener"
        target="_blank"
      >
        <WhatsAppIcon size={24} class="w-6 h-6 fill-current text-slate-950" />
        <span>Consultar disponibilidad inmediata por WhatsApp</span>
      </a>

      <div class="flex flex-wrap justify-center gap-2 mt-2">
        {site.afiliaciones.map((a) => (
          <span class="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs font-extrabold text-purple-300 uppercase tracking-wider">
            Registro {a}
          </span>
        ))}
      </div>
    </div>
  </LampContainer>

  <!-- Ambient Vector Rays Background -->
  <BackgroundBeams client:load className="z-0 opacity-40 pointer-events-none" />
</section>
```

---

## 5. Verification Method (Método de Verificación)

1. **Compilación estática (`npm run build`)**:
   Ejecutar `npm run build` en la raíz del proyecto. Verificar que las 113 rutas estáticas se generen limpiamente sin errores de sintaxis o importación en TypeScript/React.
2. **Inspección de salida de `index.html`**:
   Verificar que en `dist/index.html` la sección `#reviews` contenga los elementos de las tarjetas con sus respectivas imágenes (`testimonio_real_1.jpg`, `testimonio_real_2.jpg`, `testimonio_real_3.jpg`) y el script JSON-LD `reviewsSchema`.
3. **Verificación de Enlaces e Interacción de WhatsApp**:
   Inspeccionar que la URL generada en el botón CTA sea `https://wa.me/573128375043?text=...` y que abra en `target="_blank"`.
4. **Verificación de Regresión**:
   Comprobar páginas secundarias como `/destinos/` y `/colores/fluffy-blue/` para confirmar que la renderización de `WhatsAppCTA` se mantiene intacta.
