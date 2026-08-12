# Reporte de Handoff — Exploración e Investigación para Hito 3 (`destinos.astro`)

## 1. Observación

### 1.1. Análisis Detallado del Archivo Objetivo (`src/pages/destinos.astro`)
- **Ruta del archivo**: `/Users/anthony/Downloads/Bulldog Fluffy/src/pages/destinos.astro` (Total: 254 líneas).
- **Lógicas y Componentes Existentes**:
  - **Líneas 1–86**: Carga y parseo dinámico de CSV (`dataset_fluffy_stories.csv` o fallback `dataset_enriched_stories.csv`) mediante las funciones `parseCSV()` y `parseRow()`.
  - **Líneas 87–112**: Transformación de las filas en objetos `locations` con propiedades `slug`, `url`, `h1`, `ciudad`, `pais`, `aeropuerto`, `moneda`, agrupadas posteriormente en `groupedByCountry`.
  - **Líneas 116–140**: Diccionario `FLAG_MAP` con 24 banderas emoji asociadas a cada país (`Colombia: 🇨🇴`, `México: 🇲🇽`, `EE. UU.: 🇺🇸`, etc.).
  - **Líneas 143–150**: Estructura general envuelta en el layout `<Base>` con `title="Destinos y Cobertura de Envíos | Dinastía Bulldog Fluffy"` y `<Breadcrumbs>`.
  - **Líneas 151–170**: Hero section con kicker (`"Entrega VIP Presencial · Niñera Aérea"`), título H1, párrafo principal y buscador de ciudades instantáneo (`#city-search` e `#search-results`).
  - **Líneas 173–180**: Barra de navegación rápida por países mediante botones/pills `#pais-{slug}`.
  - **Líneas 181–207**: Rejilla de secciones por país (`<section id="pais-...">`) con tarjetas de ciudades simples en HTML (`<a class="card" href={loc.url}>`).
  - **Líneas 209–210**: Integración de componentes globales `<ShippingAccordion ciudad="tu ciudad de residencia" />` y `<WhatsAppCTA contexto="envíos internacionales de Bulldog Fluffy" />`.
  - **Líneas 213–252**: Etiqueta JSON `<script id="fluffy-locations-data">` y script cliente inline (`is:inline`) que implementa la búsqueda interactiva sobre el array `locationsData`.

### 1.2. Análisis de Componentes Aceternity UI Disponibles

1. **`src/components/ui/3d-card.tsx`** (156 líneas):
   - Exporta `CardContainer`, `CardBody`, `CardItem`, `useMouseEnter`.
   - **Mecanismo**: Utiliza `useRef`, `useState`, `perspective: 1000px` y `transformStyle: preserve-3d` para rotar la tarjeta (`rotateX`, `rotateY`) según la posición del cursor, con traslación 3D en elementos hijos (`translateZ`).
   - **Hydration**: Componente de React client-side (`"use client"`). Requiere directiva `client:load` en Astro.
   - **Detalle visual**: `CardBody` define por defecto `h-96 w-96 [transform-style:preserve-3d]`. Se debe proporcionar una clase personalizada (`w-full h-auto p-6 ...`) para asegurar adaptabilidad responsiva en grids.

2. **`src/components/ui/card-hover-effect.tsx`** (112 líneas):
   - Exporta `HoverEffect`, `Card`, `CardTitle`, `CardDescription`.
   - **Mecanismo**: Utiliza `framer-motion` (`motion/react`) y `AnimatePresence` para animar una pastilla reflectiva de fondo (`motion.span` con `layoutId="hoverBackground"`) que persigue suavemente al puntero al posarse sobre cada tarjeta de la rejilla.
   - **Hydration**: Componente de React interactivo (`useState`). Requiere directiva `client:load` en Astro.
   - **Estructura de Items**: Espera una matriz de objetos `{ title: string; description: string; link: string }[]`.

---

## 2. Cadena Lógica (Logic Chain)

1. **Dado que** `destinos.astro` agrupa las ubicaciones en dos niveles de información (Nivel 1: Países principales/Hubs de entrega; Nivel 2: Ciudades por país), **se deduce que** el rediseño con Aceternity UI debe aplicar los dos componentes en un esquema complementario de dos niveles:
   - **Nivel 1 (Hubs / Países Destacados)**: Utilizar `3d-card.tsx` (`CardContainer`, `CardBody`, `CardItem`) para crear tarjetas interactivas de efecto 3D tilt en los principales destinos internacionales o tarjetas destacadas por país.
   - **Nivel 2 (Rejillas de Ciudades por País)**: Utilizar `card-hover-effect.tsx` (`HoverEffect`) para las listas de ciudades de cada país, garantizando la experiencia visual con el foco reflector (spotlight) en la navegación.

2. **Dado que** el requisito R3 exige la preservación al 100% de todo el contenido textual (nombres de ciudades, aeropuertos, monedas, enlaces, kicker, H1, párrafo lead, acordeón y WhatsApp CTA), **se concluye que**:
   - Todo el flujo de parsing de CSV y la generación de la estructura `locations` debe permanecer inalterado en el frontmatter de Astro.
   - Los datos pasados a `HoverEffect` y `3d-card` deben mapearse conservando exactamente los atributos de cada `loc` (`ciudad`, `pais`, `aeropuerto`, `moneda`, `url`).

3. **Dado que** `3d-card.tsx` y `card-hover-effect.tsx` son componentes React que hacen uso de hooks (`useState`, `useRef`, `useEffect`) y Framer Motion, **se exige que**:
   - En `src/pages/destinos.astro`, cada invocación de estos componentes incluya la directiva de hidratación `client:load` (ej. `<HoverEffect client:load items={cityItems} />`).
   - Esto evita errores de hidratación y garantiza animación instantánea desde la carga de la página.

4. **Dado que** el script de búsqueda `#city-search` opera interactuando con la estructura DOM del buscador y los elementos `<script id="fluffy-locations-data">`, **se confirma que**:
   - El script de cliente `is:inline` debe conservarse íntegro sin modificaciones en su lógica de filtrado o referencias de IDs DOM.

---

## 3. Salvedades y Advertencias (Caveats)

- **Ajuste de Clases Tailwind en `CardBody`**: `CardBody` en `3d-card.tsx` incluye `h-96 w-96` de forma predeterminada. Si no se sobreescribe con clases adaptables (`className="w-full h-auto ..."`), las tarjetas podrían desbordarse en dispositivos móviles (pantallas < 380px). El Worker M3 debe asegurarse de pasar clases responsivas.
- **Formato de datos en `HoverEffect`**: Para mantener la estética oscura y refinada sin perder información (aeropuerto `✈️`, badge de moneda y enlace a la historia local), se recomienda crear un componente React wrapper en `src/components/destinos/CityHoverGrid.tsx` o extender la plantilla de `items` en `HoverEffect` pasando elementos visuales o HTML/JSX ricos.

---

## 4. Conclusión

La página `src/pages/destinos.astro` es totalmente idónea para la integración directa de los componentes Aceternity UI `3d-card.tsx` y `card-hover-effect.tsx`. La propuesta arquitectónica de 2 niveles preserva el 100% de la funcionalidad (parseo de CSV, script de búsqueda instantánea, FAQ/ShippingAccordion y WhatsAppCTA) a la vez que eleva la calidad estética a los estándares requeridos en el Hito 3.

---

## 5. Método de Verificación para Worker M3

Worker M3 podrá verificar independientemente la correcta implementación mediante los siguientes pasos:

1. **Compilación estática limpia**:
   ```bash
   npm run build
   ```
   *Criterio de éxito*: El comando debe finalizar con código de salida 0 y generar limpiamente las 113 páginas estáticas (incluida `dist/destinos/index.html`).

2. **Verificación de contenido y enlaces**:
   - Inspeccionar que `dist/destinos/index.html` contenga todas las ciudades (+100) y los enlaces a cada subpágina local (`/bulldog-frances-fluffy-bogota/`, `/bulldog-frances-fluffy-cdmx/`, etc.).

3. **Verificación de interactividad**:
   - Confirmar que las tarjetas de países/hubs respondan al movimiento del ratón con inclinación 3D (`CardContainer`).
   - Confirmar que la rejilla de ciudades ejecute el reflector de fondo al hacer hover (`HoverEffect`).
   - Probar que el campo de búsqueda `#city-search` mantenga el autocompletado y desplegable de resultados funcionando correctamente.
