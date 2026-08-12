# Handoff Report — Explorer M4-2 (City Landing Pages Redesign `[slug].astro`)

**Agente**: Explorer M4-2  
**Directorio de Trabajo**: `/Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_m4_2`  
**Fecha/Hora**: 2026-08-06T16:45:00Z  
**Objetivo**: Análisis exhaustivo de `src/pages/[slug].astro` (102 páginas dinámicas de ciudad) y formulación del plan de rediseño técnico con Aceternity UI (`moving-border.tsx`, `card-hover-effect.tsx`, `3d-card.tsx`).

---

## 1. Observation

### 1.1 Archivo Principal Investigado
- **Ruta**: `/Users/anthony/Downloads/Bulldog Fluffy/src/pages/[slug].astro` (358 líneas).

#### Puntos Clave del Archivo `src/pages/[slug].astro`:
1. **Generación Estática de 102 Páginas (`getStaticPaths`) (Líneas 16-145)**:
   - Carga sincrónica de `dataset_fluffy_stories.csv` (o fallback `dataset_enriched_stories.csv`) vía `fs.readFileSync`.
   - Utiliza parsers internos `parseRow()` y `parseCSV()`.
   - Mapea las filas del CSV a slugs dinámicos mediante `cleanSlug = rawSlug.replace(/^maine-coon-/, 'bulldog-frances-fluffy-')`.
   - Genera props `item` por cada ciudad:
     - `slug`: e.g. `bulldog-frances-fluffy-bogota`
     - `h1`: e.g. `Bulldog Francés Fluffy en Bogotá`
     - `metaDesc`: descripción SEO parametrizada
     - `historia`: narrativa local de aclimatación de la ciudad
     - `pais`: país de destino (e.g. `Colombia`, `México`, `Estados Unidos`)
     - `ciudad`: nombre extraído de la ciudad (e.g. `Bogotá`)
     - `aeropuerto`: aeropuerto local (e.g. `El Dorado (BOG)`)
     - `moneda`: moneda local o USD (e.g. `USD`)
2. **Estructura de Datos e Inyección Schema.org (Líneas 149-209)**:
   - `FLAG_MAP`: Mapa de banderas emoji para 26 países.
   - `filasPrecios`: Construido dinámicamente desde `fluffy.variedades`.
   - `localSchema` y `authorSchema`: Datos estructurados JSON-LD (`Product` y `MedicalBusiness`).
3. **Secciones de Interfaz y Contenido (Líneas 211-357)**:
   - **Breadcrumbs (L217-223)**: `Inicio` > `Destinos & Envíos` > `{item.h1}`.
   - **Hero Section (L225-250)**: Badges de país/genética, `<h1>{item.h1}</h1>`, `div.answer-box` (resumen AEO de despacho a `{item.aeropuerto}`), lead paragraph, e imagen showcase (`div.breed-hero-image`).
   - **EEAT Medical Authority Section (L253-284)**: Banner con insignia médica (`🩺`), registro profesional `Reg. Prof. M.V. 14892`, y 3 tarjetas informativas médicas (Control clínico pre-vuelo, Garantía genética 2 años, Esquema de vacunas & ISO).
   - **Historia Local (L286-291)**: `<h2>🏛️ Historia Local y Aclimatación en {item.ciudad}</h2>` con contenido `{item.historia}`.
   - **Tabla de Precios (L293-296)**: `<PriceTable filas={filasPrecios} ... />`.
   - **Variedades Disponibles (L299-329)**: Grid Tailwind (`grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))`) mapeando `fluffy.variedades` a tarjetas con imagen (`/images/variedades/${v.slug}.jpg`), precio mínimo USD, tagline y badges.
   - **Secciones Complementarias (L332-356)**: `<ShippingAccordion>`, `<CalculadoraComida>`, `<ReviewsSection>`, `<FaqSection>`, `<WhatsAppCTA>`, y `<QuizModal>`.

### 1.2 Componentes Aceternity UI a Integrar
1. **`src/components/ui/moving-border.tsx`**:
   - Exporta `Button` y `MovingBorder`.
   - Utiliza `"use client";`, `useAnimationFrame`, `useMotionValue`, `useTransform`, `useMotionTemplate` de `motion/react`.
   - **Requisito de Hidratación**: Requiere directiva Astro `client:visible` o `client:load`.
2. **`src/components/ui/card-hover-effect.tsx`**:
   - Exporta `HoverEffect`, `Card`, `CardTitle`, `CardDescription`.
   - Utiliza `useState`, `AnimatePresence`, `motion.span`.
   - **Requisito de Hidratación**: Requiere directiva Astro `client:visible` o `client:load`.
3. **`src/components/ui/3d-card.tsx`**:
   - Exporta `CardContainer`, `CardBody`, `CardItem`, `useMouseEnter`.
   - Utiliza `useState`, `useRef`, listeners de movimiento de mouse 3D.
   - **Requisito de Hidratación**: Requiere directiva Astro `client:visible` o `client:load`.

---

## 2. Logic Chain

1. **Invariabilidad de `getStaticPaths()`**:
   - La función `getStaticPaths()` es el motor de generación estática para las 102 páginas de ciudades en Astro. Carga `dataset_fluffy_stories.csv` durante el build.
   - **Deducción**: La función `getStaticPaths()`, los métodos `parseCSV`/`parseRow`, y la estructura de props de `item` DEBEN permanecer 100% intactos sin alterar una sola línea de lógica de datos.

2. **Integración Directa de Componentes React con Directivas de Hidratación**:
   - Astro renderiza componentes `.astro` en el servidor. Los componentes de Aceternity UI dependen del DOM del navegador y hooks de React (`useAnimationFrame`, `useState`, `useRef`).
   - **Deducción**: Al importar y renderizar componentes Aceternity UI (`CardContainer`, `HoverEffect`, `MovingBorderButton`) en `src/pages/[slug].astro`, es OBLIGATORIO agregar la directiva `client:visible` o `client:load`.

3. **Plan de Rediseño Sección por Sección**:

   - **A. Hero Image Showcase (3D Card Effect)**:
     - *Reemplazo*: Envolver el contenedor `div.breed-hero-image` (Líneas 243-249) con `CardContainer`, `CardBody` y `CardItem` de `3d-card.tsx`.
     - *Resultado*: La tarjeta de imagen del hero de la ciudad tendrá elevación perspectiva 3D al pasar el cursor, manteniendo las dos imágenes (modo oscuro/claro) e insignia inferior.

   - **B. Tarjetas de Autoridad Médica EEAT (Card Hover Effect)**:
     - *Reemplazo*: Rediseñar la sección médica (Líneas 253-284) envolviendo las 3 tarjetas de beneficios médicos (Reg. M.V. 14892, Garantía Genética 2 Años, Vacunas & ISO) dentro de una cuadrícula interactiva con efecto de foco radial (`HoverEffect` / `card-hover-effect.tsx` o envolvente de tarjeta con resplandor).

   - **C. Grid de Variedades de Cachorros (Card Hover Effect / 3D Cards)**:
     - *Reemplazo*: Convertir la sección `🎨 Variedades Disponibles para Envío a {item.ciudad}` (Líneas 299-329) para utilizar el efecto de resplandor interactivo de `card-hover-effect.tsx`.
     - *Opción Recomendada*: Crear un componente React ligero `src/components/destinos/CityVarietyGrid.tsx` o renderizar una cuadrícula con `HoverEffect` (con `client:visible`) que proyecte el fondo interactivo `motion.span` sobre cada tarjeta de variedad, conservando la imagen, precio en USD, tagline y badges (`✨ Manto Sedoso Lh`, `🧬 Gen...`, `📜 AKC / FCI`).

   - **D. Llamados a la Acción Principal (Moving Border Button)**:
     - *Reemplazo*: En la sección final antes de los modales, o dentro del área del Hero/WhatsAppCTA, aplicar `Button` de `moving-border.tsx` (con `client:visible`) con bordes animados en degradado ámbar/violeta para destacar la reserva inmediata de cachorros en la ciudad.

4. **Preservación Estricta de Texto y Estructura SEO**:
   - Todo el contenido parametrizado (`item.h1`, `item.metaDesc`, `item.historia`, `item.ciudad`, `item.pais`, `item.aeropuerto`, `item.moneda`), las tablas de precios (`PriceTable`), acordeones (`ShippingAccordion`), calculadoras (`CalculadoraComida`), FAQs (`FaqSection`), reseñas (`ReviewsSection`), WhatsApp (`WhatsAppCTA`), modales (`QuizModal`) y schemas JSON-LD se preservan al 100%.

---

## 3. Caveats

- **Generación SSG de 102 Páginas**: Debido a que se generan 102 páginas durante `npm run build`, cualquier error de sintaxis en JSX/TSX o importación incorrecta detendría la compilación completa. La inclusión de `client:visible` en los componentes React garantiza que la compilación estática ejecute SSR limpio sin fallos.
- **Ruta de Imágenes**: Las imágenes de variedades (`/images/variedades/${v.slug}.jpg`) y hero showcase (`/images/fluffy-showcase-hero.jpg`) deben mantenerse intactas en los `src` atributivos.
- **Sin Cambios de Archivos**: Como Explorer M4-2, este reporte es 100% de lectura y planificación. Ningún archivo fuera de `.agents/explorer_m4_2` ha sido modificado.

---

## 4. Conclusion

El rediseño de las 102 páginas dinámicas de ciudades (`src/pages/[slug].astro`) con los componentes de Aceternity UI (`moving-border.tsx`, `card-hover-effect.tsx`, `3d-card.tsx`) es completamente factible, seguro y de alto impacto visual.

1. **`getStaticPaths()` permanece 100% intacto**, asegurando que el dataset de 102 ciudades se procese de manera idéntica.
2. **Hidratación React asegurada** mediante `client:visible` en todos los componentes de Aceternity UI.
3. **Mejora estética de lujo**:
   - Hero Image con inclinación 3D (`3d-card`).
   - Grid de variedades de puppies y tarjetas EEAT médica con resplandor radial (`card-hover-effect`).
   - Botones CTA con borde animado radiante (`moving-border`).
4. **Preservación total del contenido**: Se conserva la totalidad del contenido informativo, precios, historias locales y datos estructurados SEO.

---

## 5. Verification Method

Para verificar independientemente la implementación realizada por Worker M4:

1. **Ejecutar comando de compilación estática**:
   ```bash
   npm run build
   ```
2. **Criterios de Éxito en la Compilación**:
   - El proceso debe finalizar con `✓ Completed in ...` sin advertencias de sintaxis o fallas de SSR.
   - Deben generarse las 102 páginas HTML en el directorio `dist/` (ej. `dist/bulldog-frances-fluffy-bogota/index.html`, `dist/bulldog-frances-fluffy-mexico-cdmx/index.html`, etc.).
3. **Inspección de Archivo Generado**:
   - Abrir un HTML de ciudad generado (ej. `dist/bulldog-frances-fluffy-bogota/index.html`) y verificar presencia de:
     - Titular H1 exacto (`Bulldog Francés Fluffy en Bogotá`).
     - Resumen AEO con mención del aeropuerto (`El Dorado`).
     - Historia local completa de la ciudad.
     - Componentes React hidratados con sus atributos `astro-island`.

---

## 6. Step-by-Step Guidance for Worker M4

Worker M4 debe aplicar los siguientes cambios exactos en `src/pages/[slug].astro`:

### Paso 1: Importar Componentes Aceternity UI al Inicio del Archivo
En la sección del Frontmatter de `src/pages/[slug].astro`, agregar:
```astro
import { Button as MovingBorderButton } from '../components/ui/moving-border';
import { HoverEffect } from '../components/ui/card-hover-effect';
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card';
```

### Paso 2: Aplicar 3D Card en el Hero Showcase Image
Reemplazar el contenedor `<div class="breed-hero-image" ...>` (Líneas 243-249) por:
```astro
<CardContainer client:visible className="w-full inter-draw">
  <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-2 border">
    <CardItem translateZ="50" className="w-full">
      <div class="breed-hero-image" style="border-radius: var(--radius); overflow: hidden; position: relative;">
        <img class="dark-only w-full object-cover rounded-xl" src="/images/fluffy-showcase-hero.jpg" alt={`Colores y variedades de Bulldog Francés Fluffy disponibles para entrega en ${item.ciudad}`} />
        <img class="light-only w-full object-cover rounded-xl" src="/images/fluffy-showcase-hero-light.jpg" alt={`Colores y variedades de Bulldog Francés Fluffy disponibles para entrega en ${item.ciudad}`} />
        <div style="background: var(--surface); backdrop-filter: blur(8px); padding: 8px 14px; text-align: center; font-size: 0.78rem; color: var(--amber); border-top: 1px solid var(--border);">
          🎨 Linajes y Colores Principales: Fluffy Blue, Visual Isabella, Lilac, Cocoa & Merlé
        </div>
      </div>
    </CardItem>
  </CardBody>
</CardContainer>
```

### Paso 3: Transformar Grid de Variedades con Card Hover Effect
Preparar los datos de las variedades en el frontmatter:
```astro
const varietyHoverItems = fluffy.variedades.map((v) => {
  const minUsd = Math.min(...v.variantes.map(v2 => v2.precioUSD));
  return {
    title: v.nombreCorto,
    description: `${v.perfil.tagline} — Desde $${minUsd.toLocaleString('en-US')} USD`,
    link: `/colores/${v.slug}/`
  };
});
```
Y sustituir o envolver la sección de variedades (Líneas 299-329) usando `<HoverEffect client:visible items={varietyHoverItems} />` o un componente React decorativo que mantenga la insignia `✨ Manto Sedoso Lh` y precios.

### Paso 4: Agregar Moving Border en el CTA Destacado de Ciudad
En la sección inferior de CTA, agregar un botón con borde interactivo animado:
```astro
<div class="flex justify-center my-8">
  <MovingBorderButton
    client:visible
    borderRadius="1rem"
    className="bg-slate-900/90 text-amber-400 font-bold text-base px-6 py-3 border-amber-500/40"
    containerClassName="h-14 w-auto min-w-[260px]"
    borderClassName="bg-[radial-gradient(var(--amber)_40%,transparent_60%)]"
    as="a"
    href={`https://wa.me/573000000000?text=Hola,%20busco%20información%20sobre%20Bulldog%20Fluffy%20en%20${encodeURIComponent(item.ciudad)}`}
  >
    <span>📱 Reservar Cachorro en {item.ciudad}</span>
  </MovingBorderButton>
</div>
```

### Paso 5: Compilación & Verificación Final
Ejecutar `npm run build` y corroborar la generación impecable de las 102 páginas de ciudades.
