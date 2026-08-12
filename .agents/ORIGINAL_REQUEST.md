# Original User Request

## Initial Request — 2026-08-06T11:23:14Z

Rediseñar completamente el 100% del sitio web 'Bulldog Fluffy' (todas las pestañas, subpáginas, componentes, menús, estados al hacer hover y tarjetas) utilizando la Opción 3: Dynamic Parallax con Aceternity UI, conservando el 100% del contenido textual y las tipografías (`Inter` y `Space Grotesk`).

Working directory: /Users/anthony/Downloads/Bulldog Fluffy
Integrity mode: development

## Alcance Total de Páginas y Pestañas a Rediseñar

1. **Página Principal (Home — `src/pages/index.astro`)**:
   - Hero con `Hero Parallax` (`@aceternity/hero-parallax`).
   - Mosaico de características con `Bento Grid` (`@aceternity/bento-grid`).
   - Testimonios con `Infinite Moving Cards` (`@aceternity/infinite-moving-cards`).
   - Llamados a la acción con `Lamp Effect` y `Background Beams`.

2. **Pestaña Países / Destinos (`src/pages/destinos.astro`)**:
   - Rediseño completo de las tarjetas de países y opciones de envío internacional usando `3D Card` (`@aceternity/3d-card`) y efectos de animación al hover (`Card Hover Effect`).

3. **Pestaña Razas y Colores (`src/pages/colores/` & `src/pages/[slug].astro`)**:
   - Rediseño de las tarjetas de variantes de color y razas de bulldog con `Card Hover Effect` (`@aceternity/card-hover-effect`), bordes interactivos `Moving Border` y efectos visuales de alta gama.

4. **Pestañas Precios, Sobre Nosotros y Blog (`src/pages/precios-bulldog-fluffy.astro`, `sobre-nosotros.astro`, `blog/`)**:
   - Renovación total de la tabla de precios, acordeones, tarjetas del blog y la historia de la marca con animaciones de entrada, bordes estilizados y estados hover dinámicos.

5. **Componentes Globales y Navegación**:
   - Header/Navbar, Footer, Modales (`QuizModal`, `CalculadoraComida`, `CalculadoraEdad`), acordeones de envío y botones flotantes de WhatsApp.
   - Rediseño de **todos los estados hover** en botones, enlaces, tarjetas y pestañas de la barra de navegación.

## Requirements

### R1. Instalación de Componentes de Aceternity UI
Instalar vía `npx shadcn@latest add @aceternity/...` los componentes: `hero-parallax`, `card-hover-effect`, `3d-card`, `bento-grid`, `lamp`, `background-beams`, `infinite-moving-cards`, `moving-border`.

### R2. Rediseño Visual Integral y Estados Hover
Aplicar la nueva paleta oscura de alto contraste, bordes luminosos y animaciones al pasar el cursor (hover) en absolutamente todas las tarjetas, componentes y pestañas del sitio.

### R3. Preservación del Contenido y Tipografía
Garantizar la conservación íntegra del contenido textual de las páginas, dataset de historias y las fuentes `Inter` y `Space Grotesk`.

### R4. Verificación de Compilación
Asegurar que el proyecto compila limpiamente con `npm run build`.

## Acceptance Criteria

- [ ] Todas las páginas (`Home`, `Destinos`, `Colores`, `Precios`, `Sobre Nosotros`, `Blog`, `[slug]`) cuentan con el nuevo diseño y componentes de Aceternity UI.
- [ ] Todos los elementos interactivos, pestañas y tarjetas tienen estados hover rediseñados y pulidos.
- [ ] El 100% del contenido textual y las tipografías originales están presentes.
- [ ] `npm run build` se ejecuta correctamente sin errores.
