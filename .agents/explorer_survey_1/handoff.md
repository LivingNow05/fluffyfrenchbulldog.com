# Reporte Handoff de Exploración y Mapeo: Proyecto Bulldog Fluffy Redesign

**Fecha**: 2026-08-06  
**Agente**: Explorer 1 (`teamwork_preview_explorer`)  
**Directorio de trabajo**: `/Users/anthony/Downloads/Bulldog Fluffy/.agents/explorer_survey_1`  
**Directorio del proyecto**: `/Users/anthony/Downloads/Bulldog Fluffy`  

---

## 1. Observation (Observaciones Directas)

### 1.1 Estructura Completa del Proyecto
El proyecto es una aplicación estática basada en **Astro v5.0.0**.

#### Archivos en el Directorio Raíz
- `package.json`, `package-lock.json`
- `astro.config.mjs`
- `components.json` (configuración de Shadcn / Registros Aceternity UI)
- `tsconfig.json`
- `ORIGINAL_REQUEST.md` (especificación del requerimiento de rediseño)
- `Dockerfile`, `nginx.conf`
- **Archivos de Datasets en la Raíz**:
  - `dataset_fluffy_stories.csv` (108.16 KB, 102 filas — dataset principal de 100+ ciudades)
  - `dataset_enriched_stories.csv` (80.15 KB, 102 filas — dataset secundario / fallback)
  - `generate_fluffy_dataset.py` (5.2 KB — script de generación de dataset)
- **Suite de Pruebas / QA / Auditorías en la Raíz**:
  - `audit_playwright.js`, `run_qa_hero_flat_suite.js`, `run_qa_tests.js`, `test_page.js`, `test_qa_loop.js`, `test_quiz_modal.js`, `verify_flat_heros.js`
  - `qa_flat_report.json` (10.5 KB)
- **Archivos Multimedia / Capturas en la Raíz**:
  - `Avani Hotel.m4a` (3.82 MB)
  - `Testimonios/WhatsApp Image 2026-07-22 at 6.41.30 PM.jpeg`
  - 40+ capturas de pantalla PNG de auditoría en viewports mobile, tablet y desktop (temas claro y oscuro).

#### Estructura en `src/`

##### Páginas (`src/pages/`)
1. `src/pages/index.astro` — Página principal (Home). Importa `Base.astro`, `HeroCentered.astro`, `BentoFeatures.astro`, `ReviewsSection.astro`, `CalculadoraComida.astro`, `FaqSection.astro`, `WhatsAppCTA.astro`. Renderiza la grilla de ciudades VIP y la sección de variedades.
2. `src/pages/destinos.astro` — Pestaña de Destinos y Cobertura de Envíos. Carga y parsea `dataset_fluffy_stories.csv` con Node `fs`/`path`, agrupa las 100+ ciudades por país, incluye un buscador instantáneo en cliente JS y `ShippingAccordion.astro`.
3. `src/pages/precios-bulldog-fluffy.astro` — Pestaña de Precios Oficiales 2026. Importa `PriceTable.astro`, `FaqSection.astro` y genera la matriz de precios a partir de `fluffy.json`.
4. `src/pages/sobre-nosotros.astro` — Pestaña del Criadero. Detalla la misión, estándares genéticos (ADN, salud cardíaca), certificaciones y afiliaciones (AKC, FCI, ACCC).
5. `src/pages/[slug].astro` — Ruta dinámica de ciudades. Genera 100+ páginas estáticas a través de `getStaticPaths()` parseando `dataset_fluffy_stories.csv`. Muestra respuesta rápida (AEO snippet), resumen médico de autoridad (EEAT), historia local de aclimatación, tabla de precios para la ciudad, variedades disponibles, acordeón logístico y calculadora nutricional.
6. `src/pages/colores/[slug].astro` — Ruta dinámica por variedad de color. Genera 5 páginas estáticas (`fluffy-blue`, `fluffy-visual-isabella`, `fluffy-lilac`, `fluffy-fluffy-cocoa`, `fluffy-merle`) a partir de `fluffy.json`. Muestra tabla de precios por variante y ficha técnica.
7. `src/pages/blog/index.astro` — Índice del Blog. Carga dinámicamente los artículos `.md` de `src/data/blog/`.
8. `src/pages/blog/[slug].astro` — Ruta dinámica de artículos de blog. Genera las páginas individuales de los artículos `.md`.

##### Componentes (`src/components/`)
Existen 15 componentes `.astro` en `src/components/`:
- `BentoFeatures.astro`: Mosaico 3D de características con efecto tilt Vanilla JS.
- `Breadcrumbs.astro`: Migas de pan estructuradas con microdatos Schema.org.
- `BulldogIcon.astro`: Icono SVG de silueta de bulldog.
- `CalculadoraComida.astro`: Calculadora interactiva de ración diaria de alimento/BARF en gramos.
- `CalculadoraEdad.astro`: Calculadora de equivalencia de edad canina a humana.
- `FaqSection.astro`: Acordeón interactivo de preguntas frecuentes en `<details>`.
- `HeroCentered.astro`: Hero tipográfico centrado con tarjetas estadísticas y selector de imágenes dark/light.
- `HeroPhotoShowcase.astro`: Hero alternativo orientado a showcase fotográfico.
- `HeroSwitcher.astro`: Componente para alternar vistas de hero.
- `PriceTable.astro`: Tabla de precios responsiva con desglose en MXN y USD y conversión según país.
- `QuizModal.astro`: Modal interactivo paso a paso para recomendar la variedad ideal.
- `ReviewsSection.astro`: Carrusel/mosaico de testimonios con estrellas y fotos reales.
- `ShippingAccordion.astro`: Acordeón detallado del protocolo de transporte con niñera aérea VIP.
- `WhatsAppCTA.astro`: Banner de llamado a la acción flotante/destacado hacia WhatsApp.
- `WhatsAppIcon.astro`: Icono SVG oficial de WhatsApp.

*Nota*: El directorio `src/components/ui/` **no existe** en este momento.

##### Layouts (`src/layouts/`)
- `src/layouts/Base.astro`: Layout maestro html/head/body. Incluye:
  - Carga de fuentes `@fontsource-variable/space-grotesk` y `@fontsource-variable/inter` más `<link>` de Google Fonts (`Outfit` e `Inter`).
  - Carga de GSAP (`gsap.min.js`).
  - Script inline de `IntersectionObserver` (`window.initInViewAnimations`) para la clase `.animate-on-scroll`.
  - Header flotante `.site-header` con mega menú de ciudades de 4 columnas, selector de tema `light/dark` y menú hamburguesa responsive.
  - JSON-LD Schema.org para `LocalBusiness`.
  - Footer `.site-footer` de 4 columnas.
  - Botón flotante persistente de WhatsApp.

##### Datos y Blog (`src/data/`)
- `src/data/fluffy.json` (10.96 KB): Datos del sitio (`site`) y catálogo de 5 variedades de color (`fluffy-blue`, `fluffy-visual-isabella`, `fluffy-lilac`, `fluffy-fluffy-cocoa`, `fluffy-merle`).
- `src/data/faqs.json`: Preguntas frecuentes generales y por variedad.
- `src/data/blog/`:
  - `cuidados-alimentacion-salud-bulldog-fluffy.md`
  - `genetica-colores-exoticos-bulldog-fluffy.md`
  - `guia-adaptacion-cachorro-bulldog-fluffy-en-casa.md`

##### Estilos (`src/styles/`)
- `src/styles/global.css` (2,949 líneas, 77.3 KB): Contiene todo el sistema de diseño actual "LUJO CANINO NOCTURNO & EDITORIAL EDIT", variables CSS `:root` y `:root.light-theme`, tipografías, botones con efecto *shimmer streak*, header flotante, megamenú, bento grid, etc.

##### Assets Estáticos (`public/`)
- Icons: `public/favicon.svg`, `public/favicon.png`, `public/apple-touch-icon.png`.
- Logos: `public/images/fluffy_logo.png`, `public/images/fluffy_logo_purple.png`, `public/images/fluffy_logo.jpg`.
- Heroes: `public/images/fluffy-showcase-hero.jpg`, `public/images/fluffy-showcase-hero-light.jpg`, `public/images/fluffy-showcase-hero-backup.jpg`.
- Variedades: `public/images/variedades/fluffy-blue.jpg`, `fluffy-visual-isabella.jpg`, `fluffy-lilac.jpg`, `fluffy-fluffy-cocoa.jpg`, `fluffy-merle.jpg`.
- Testimonios: `public/images/testimonios/testimonio_real_1.jpg`, `testimonio_real_2.jpg`, `testimonio_real_3.jpg`.
- Scripts: `public/scripts/quiz-modal.js`, `public/scripts/reveal.js`.

---

### 1.2 Verificación de Configuraciones y Dependencias

#### `package.json`
```json
{
  "name": "bulldog-fluffy",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.2.0",
    "@fontsource-variable/inter": "^5.2.8",
    "@fontsource-variable/space-grotesk": "^5.2.10",
    "astro": "^5.0.0",
    "gsap": "^3.15.0"
  },
  "devDependencies": {
    "playwright": "^1.61.1",
    "shadcn": "^4.16.2"
  }
}
```

#### `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bulldogfluffy.com.co',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
```

#### `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.mjs",
    "css": "src/styles/global.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide",
  "registries": {
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
  }
}
```

#### Estado de Tailwind CSS
`components.json` apunta a `tailwind.config.mjs`, pero el archivo **`tailwind.config.mjs` no existe en la raíz del proyecto**. Actualmente, los estilos provienen de CSS puro en `src/styles/global.css`.

#### Prueba de Compilación (`npm run build`)
Se ejecutó la prueba de compilación en frío:
```bash
npm run build
```
- **Resultado**: Exitoso (código de salida 0).
- **Tiempo**: ~1.35 segundos.
- **Páginas generadas**: 113 archivos HTML estáticos en `dist/` (incluyendo las 100+ rutas dinámicas de ciudades, 5 de variedades, 3 de blog y páginas estáticas).

---

### 1.3 Datasets y Fuentes

#### Datasets Identificados
1. **`dataset_fluffy_stories.csv`** (Raíz, 108,163 bytes, 102 líneas):
   - Dataset principal consumido por `src/pages/[slug].astro` y `src/pages/destinos.astro`.
   - Columnas: `Dominio`, `Categoría`, `URL Final (Slug)`, `H1 Título`, `Meta Descripción`, `Moneda`, `País`, `Aeropuerto`, `Historia Local`.
   - Genera dinámicamente las páginas de ciudades como `bulldog-frances-fluffy-bogota`, `bulldog-frances-fluffy-cdmx`, `bulldog-frances-fluffy-lima`, etc.
2. **`dataset_enriched_stories.csv`** (Raíz, 80,152 bytes, 102 líneas):
   - Dataset de respaldo / fallback.
3. **`src/data/fluffy.json`** (10,960 bytes):
   - Estructura JSON con metadatos del criadero (`site`) y las 5 variedades principales (`fluffy-blue`, `fluffy-visual-isabella`, `fluffy-lilac`, `fluffy-fluffy-cocoa`, `fluffy-merle`), con sus rangos de precio en MXN/USD, características biológicas y taglines.
4. **`src/data/faqs.json`**:
   - Arreglo de preguntas y respuestas generales y por variedad.

#### Fuentes (Fonts) Identificadas
1. **Space Grotesk**:
   - Instalada en `package.json` como `@fontsource-variable/space-grotesk`.
   - Importada en `src/layouts/Base.astro:2`.
   - Mapeada a la variable CSS `--font-display` en `src/styles/global.css:45`.
2. **Inter**:
   - Instalada en `package.json` como `@fontsource-variable/inter`.
   - Importada en `src/layouts/Base.astro:3`.
   - Mapeada a la variable CSS `--font-body` in `src/styles/global.css:46`.
3. **Outfit**:
   - Incluida vía `<link>` de Google Fonts en `src/layouts/Base.astro:59` y usada como primera opción en `--font-display`.

---

### 1.4 Componentes de Aceternity UI Instalados vs Faltantes

#### Estado Actual en `src/components/ui/`
Actualmente el directorio `src/components/ui/` **no existe** y hay **0 componentes de Aceternity UI instalados**.

#### Estado de Componentes Requeridos por `ORIGINAL_REQUEST.md` (Opción 3: Dynamic Parallax)

| Componente Aceternity UI | Paquete / Comando Registry | Estado Actual | Ubicación Destino Requerida |
|---|---|---|---|
| **Hero Parallax** | `@aceternity/hero-parallax` | ❌ Faltante | `src/components/ui/hero-parallax.tsx` / `Hero.astro` |
| **Card Hover Effect** | `@aceternity/card-hover-effect` | ❌ Faltante | `src/components/ui/card-hover-effect.tsx` |
| **3D Card** | `@aceternity/3d-card` | ❌ Faltante | `src/components/ui/3d-card.tsx` |
| **Bento Grid** | `@aceternity/bento-grid` | ❌ Faltante | `src/components/ui/bento-grid.tsx` |
| **Lamp Effect** | `@aceternity/lamp` | ❌ Faltante | `src/components/ui/lamp.tsx` |
| **Background Beams** | `@aceternity/background-beams` | ❌ Faltante | `src/components/ui/background-beams.tsx` |
| **Infinite Moving Cards** | `@aceternity/infinite-moving-cards` | ❌ Faltante | `src/components/ui/infinite-moving-cards.tsx` |
| **Moving Border** | `@aceternity/moving-border` | ❌ Faltante | `src/components/ui/moving-border.tsx` |

#### Requisitos Previos Necesarios para Aceternity UI en Astro
Para que los componentes de Aceternity UI (escritos en React + Framer Motion + Tailwind CSS) funcionen correctamente en Astro, se requiere instalar e integrar:
1. `@astrojs/react`, `react`, `react-dom`, `@types/react`, `@types/react-dom` en `package.json` y agregar `react()` en `astro.config.mjs`.
2. Tailwind CSS (configurar `tailwind.config.mjs` y la integración de Tailwind en Astro).
3. Dependencias de utilidades: `clsx`, `tailwind-merge`, `framer-motion`, `mini-svg-data-uri`, `lucide-react`.

---

## 2. Logic Chain (Cadena de Razonamiento)

1. **Observación**: `package.json` sólo cuenta con `astro`, `@astrojs/sitemap`, `@fontsource-variable/inter`, `@fontsource-variable/space-grotesk` y `gsap`.
   **Inferencia**: El proyecto actual funciona con HTML/Astro puro y CSS plano en `global.css` sin dependencias de React ni Tailwind CSS configurado.

2. **Observación**: `components.json` ya tiene configurado el registro `"@aceternity": "https://ui.aceternity.com/registry/{name}.json"`, pero señala `"config": "tailwind.config.mjs"` (que no existe) y el directorio `src/components/ui/` está ausente.
   **Inferencia**: El soporte de Shadcn/Aceternity se pre-configuró a nivel de metadatos, pero aún no se han ejecutado las instalaciones de paquetes ni de los componentes TSX de Aceternity UI.

3. **Observación**: Se ejecutó `npm run build` y se compilaron exitosamente 113 páginas estáticas en 1.35s.
   **Inferencia**: El estado del código actual es 100% estable e íntegro. Los cambios o adiciones de integración con React/Aceternity deben preservar la capacidad de compilar las 113 páginas.

4. **Observación**: `src/pages/[slug].astro` lee `dataset_fluffy_stories.csv` para generar 100+ páginas de destinos, y `src/pages/colores/[slug].astro` lee `src/data/fluffy.json` para generar 5 páginas de variedades.
   **Inferencia**: El contenido textual y las fuentes `Inter` y `Space Grotesk` se encuentran perfectamente desacoplados en datasets CSV y JSON, por lo que el rediseño visual de tarjetas y secciones mediante Aceternity UI puede realizarse sin alterar ni perder ni un solo texto o metadato original.

---

## 3. Caveats (Advertencias y Supuestos)

- **Instalación de React & Tailwind**: Aceternity UI requiere componentes React (`.tsx`) con `framer-motion` y clases de Tailwind CSS. Actualmente Astro no tiene la integración `@astrojs/react` activada en `astro.config.mjs`.
- **Integración de Tailwind v3/v4 con `global.css`**: `src/styles/global.css` contiene 2,949 líneas de CSS personalizado. Al integrar Tailwind CSS para Aceternity UI, hay que evitar sobrescribir las variables `:root` de marca y los reset CSS de la aplicación.
- **Client Directives en Astro**: Los componentes interactivos de Aceternity UI (como `hero-parallax`, `3d-card`, `infinite-moving-cards`) requerirán la directiva `client:load` o `client:visible` al ser instanciados dentro de las páginas `.astro`.

---

## 4. Conclusion (Conclusión de la Investigación)

El proyecto **Bulldog Fluffy** posee una estructura limpia y funcional con 8 rutas/páginas principales, 113 páginas estáticas generadas desde un dataset CSV de 100+ ciudades y 5 variedades exóticas en JSON. La compilación `npm run build` actual es 100% exitosa. Ninguno de los 8 componentes de Aceternity UI requeridos está actualmente instalado. El mapa completo de archivos, layouts, componentes, fuentes y datasets ha sido identificado para dar paso directo a la fase de instalación e implementación.

---

## 5. Verification Method (Método de Verificación Independiente)

Para verificar independientemente los hallazgos de este reporte:

1. **Verificación de Estructura de Páginas y Componentes**:
   ```bash
   ls -la src/pages/
   ls -la src/components/
   ls -la src/layouts/
   ```
   *Criterio de validación*: Verificar que existan exactamente los 15 componentes `.astro` y las 8 entradas de página reportadas, y confirmar que `src/components/ui/` no existe.

2. **Verificación de Datasets y Fuentes**:
   ```bash
   ls -lh dataset_fluffy_stories.csv dataset_enriched_stories.csv src/data/fluffy.json src/data/faqs.json
   ```
   *Criterio de validación*: Confirmar la presencia de los datasets CSV y JSON.

3. **Verificación de Compilación Actual**:
   ```bash
   npm run build
   ```
   *Criterio de validación*: La salida debe indicar `✓ Completed` y `113 page(s) built` sin lanzar errores.
