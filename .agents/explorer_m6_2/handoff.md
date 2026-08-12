# Reporte de Handoff — Explorer M6 2
**Proyecto**: Rediseño Bulldog Fluffy con Aceternity UI
**Hito**: Milestone 6 — Análisis de Modales Interactivos y Calculadoras
**Fecha**: 2026-08-06

---

## 1. Observaciones Directas (Evidence & Observations)

### 1.1 `QuizModal.astro` y `src/scripts/quiz-modal.js`
- **Ubicación de Archivos**:
  - `src/components/QuizModal.astro` (463 líneas)
  - `src/scripts/quiz-modal.js` (371 líneas)
  - Inyección en `src/layouts/Base.astro` (líneas 245–253) y `src/pages/[slug].astro` (línea 335).
- **Contrato de Datos Globales**:
  - `Base.astro` inyecta en `window`:
    - `FLUFFY_WA`: Número de teléfono de WhatsApp (ej. `'573128375043'`).
    - `FLUFFY_BRAND`: Nombre de marca (ej. `'Dinastía Bulldog Fluffy'`).
    - `FLUFFY_CATALOGO`: Array de objetos con variedades, precios (`desdeUSD`, `desde`) y perfil genético.
    - `FLUFFY_VARIEDAD`: Slug o nombre de la variedad contextual cuando se está en páginas `[slug].astro`.
- **Estructura de Preguntas y Pasos (Funnel de Lead Qualification)**:
  - **Paso 1 (`presupuesto`)**:
    - `inicial`: $2,300 – $3,000 USD (Techo: 12,000,000 COP)
    - `medio`: $3,000 – $4,200 USD (Techo: 16,000,000 COP)
    - `premium`: $4,200 – $5,800 USD (Techo: 22,000,000 COP)
    - `show`: $5,800+ USD (Techo: Infinity)
  - **Paso 2 (`sexo`)**: Options: `Macho`, `Hembra`, `Indiferente`.
  - **Paso 3 (`ciudad`)**: Condicional — se inyecta solo si `detectadaCiudad` no fue inferida automáticamente del título (`document.title`). Incluye nota de costo de envío aproximado (~$1,000 USD).
- **Algoritmo de Calificación y Scoring (`clasificar()`)**:
  - Filtra y puntúa las variedades del catálogo:
    - Cumple presupuesto (`r.desde <= techo`): **+4 puntos** si cumple, **-3 puntos** si excede.
    - Tipo de vivienda: `Apartamento` (+2), `Casa` (+2).
    - Nivel de actividad: match con perfil de la raza (+2), tranquilo (+3).
    - Niños en casa: `state.ninos === 'Sí'` (+2).
    - Presupuesto Premium/Show + razas top (Visual Isabella / Merlé): **+3 puntos**.
  - Ordenamiento: `scored.sort((a, b) => b.score - a.score || a.desde - b.desde)`.
  - Retorna las 3 mejores opciones. Si hay contexto de raza (`razaCtx`), la fija en posición 1 con `score: 99`.
- **Construcción del Mensaje de WhatsApp (`buildMessage()`)**:
  - Genera URL `https://wa.me/{NUMERO}?text=...` con el expediente completo formateado (Vivienda, Carácter, Niños, Presupuesto, Sexo, Ciudad de Envío y variedad recomendada).

---

### 1.2 `CalculadoraComida.astro`
- **Ubicación de Archivo**: `src/components/CalculadoraComida.astro` (291 líneas).
- **Inclusión**: `src/pages/index.astro` (línea 117) y `src/pages/[slug].astro` (línea 320).
- **Fórmulas de Cálculo Interactivo Nutricional**:
  1. **Lectura de Inputs**:
     - Peso del perro (`#dog-weight`): Rango 2.0 kg a 16.0 kg (paso 0.5 kg, default 10.0 kg).
     - Etapa / Actividad (`#dog-activity`):
       - `cachorro` (2 a 8 meses) $\rightarrow$ Factor de actividad = **2.5**
       - `normal` (Adulto estándar) $\rightarrow$ Factor de actividad = **1.6** (default)
       - `bajo` (Adulto mayor / sedentario) $\rightarrow$ Factor de actividad = **1.2**
       - `atleta` (Alta actividad / reproductor) $\rightarrow$ Factor de actividad = **2.0**
  2. **Cálculo de RER (Resting Energy Requirement)**:
     $$\text{RER} = 70 \times (\text{peso})^{0.75}$$
  3. **Cálculo de DER (Daily Energy Requirement)**:
     $$\text{DER} = \text{RER} \times \text{Factor}$$
  4. **Porción Diaria Recomendada (Alimento Super Premium - 3.8 kcal/g)**:
     $$\text{Gramos Diarios} = \text{Math.round}\left(\frac{\text{DER}}{3.8}\right)$$
  5. **Animación de Conteo (Counter Effect)**:
     - Incremento/decremento progresivo entero sobre el elemento `#result-grams` en un intervalo de ~200ms.

---

### 1.3 `CalculadoraEdad.astro`
- **Ubicación de Archivo**: `src/components/CalculadoraEdad.astro` (162 líneas).
- **Fórmulas de Cálculo de Edad Humana Equivalente**:
  1. **Lectura de Inputs**:
     - Edad del perro (`#dog-age`): Rango 0.5 a 15.0 años (paso 0.5 años, default 2.0 años).
  2. **Fórmula Logarítmica Canina**:
     - Para cachorros menores a 1 año ($\text{edad} < 1.0$):
       $$\text{Edad Humana} = \text{Math.round}(\text{edad} \times 15)$$
     - Para perros de 1 año o más ($\text{edad} \ge 1.0$):
       $$\text{Edad Humana} = \text{Math.round}(16 \times \ln(\text{edad}) + 31)$$

---

### 1.4 `ShippingAccordion.astro`
- **Ubicación de Archivo**: `src/components/ShippingAccordion.astro` (170 líneas).
- **Funcionalidad**: Acordeón interactivo `<details>`/`<summary>` con 4 etapas logísticas (Viaje VIP Cabina, Certificados PCR, Garantía ADN, Trámites Aduana).

---

## 2. Cadena Lógica (Logic Chain)

1. **Observación**: El sitio Bulldog Fluffy cuenta con tres widgets/modales interactivos principales (`QuizModal`, `CalculadoraComida`, `CalculadoraEdad`) y un acordeón logístico (`ShippingAccordion`).
2. **Razonamiento sobre las Fórmulas**:
   - `CalculadoraComida.astro` utiliza el estándar metabólico canino RER ($70 \cdot W^{0.75}$) y coeficientes de actividad DER ($1.2$ a $2.5$), divididos por la densidad calórica $3.8 \text{ kcal/g}$.
   - `CalculadoraEdad.astro` aplica la ecuación epistemológica moderna $16 \cdot \ln(\text{edad}) + 31$ para razas pequeñas/medianas (con ajuste lineal $15 \cdot \text{edad}$ para cachorros $<1$ año).
   - `QuizModal.astro` efectúa un scoring ponderado multi-variable (presupuesto, vivienda, niños, actividad) para recomendar la mejor variedad del dataset `FLUFFY_CATALOGO`.
3. **Razonamiento sobre el Rediseño Aceternity UI**:
   - Los componentes actuales usan estilos CSS planos con colores violeta/amarillo y fondos sólidos `#141419` / `#1d1536`.
   - Para encajar con el resto del rediseño del Milestone 6 (estética oscura neón glassmorphic con acentos Aceternity):
     - El modal `QuizModal` requiere un contenedor glassmorphic con `backdrop-blur-2xl bg-[#08080c]/90`, bordes luminosos de gradiente púrpura/dorado (`border-purple-500/30`), sombras neón (`shadow-[0_0_80px_rgba(168,85,247,0.2)]`) y micro-animaciones en las transiciones de paso.
     - Las calculadoras (`CalculadoraComida` y `CalculadoraEdad`) deben integrarse con el sistema de diseño Aceternity mediante contenedores glassmorphic oscuros, sliders de rango personalizados con brillos púrpuras/dorados y tipografía de resultados en gradiente (`bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent`).
     - `ShippingAccordion` debe actualizar sus tarjetas `<details>` a paneles glassmorphic con efectos de brillo al abrirse (`open`).

---

## 3. Salvedades y Advertencias (Caveats)

- **Sin Modificaciones Directas en `src/`**: En cumplimiento con el rol de Explorer (Read-only investigation), no se ha realizado ninguna modificación en los archivos de código fuente.
- **Inyección Inline de JS**: `QuizModal.astro`, `CalculadoraComida.astro` y `CalculadoraEdad.astro` utilizan bloques `<script is:inline>`. Durante la implementación en M6, se debe asegurar que las clases CSS de Aceternity UI y los ID referenciados por estos scripts se mantengan idénticos para no romper los event listeners (`input`, `change`, `click`).

---

## 4. Conclusión y Plan de Integración de Aceternity UI (Conclusion)

El 100% de la lógica interactiva y las matemáticas de los modales y calculadoras está claramente aislada y documentada.

### Plan de Integración Detallado para Implementación (M6):

1. **Estilo Aceternity UI para `QuizModal.astro`**:
   - **Backdrop Overlay**: `fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl`.
   - **Modal Card**: `relative z-10 w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-[#0d091a]/95 border border-purple-500/30 rounded-3xl p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.15)] text-zinc-100`.
   - **Progress Bar Segment**: Segments con estado activo en gradiente neón `bg-gradient-to-r from-purple-500 to-amber-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]`.
   - **Tarjetas de Opciones**: `border border-purple-500/20 bg-white/[0.03] hover:bg-purple-500/10 hover:border-purple-500/50 hover:-translate-y-0.5 transition-all duration-200 rounded-2xl p-4`.

2. **Estilo Aceternity UI para `CalculadoraComida.astro` & `CalculadoraEdad.astro`**:
   - **Box Wrapper**: `max-w-[760px] mx-auto my-10 bg-[#140e26]/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(168,85,247,0.1)]`.
   - **Rangos de Selección**: Input sliders con pista púrpura personalizada y valor numérico brillante (`text-purple-400 font-extrabold text-lg`).
   - **Resaltado de Resultados**: Tarjeta interna `bg-[#0a0518] border border-purple-500/30 rounded-2xl p-6 text-center` con número en gradiente tipográfico display (`text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent`).

3. **Preservación del 100% de las Fórmulas**:
   - Conservar exactamente:
     - `rer = 70 * Math.pow(weight, 0.75)`
     - `der = rer * factor` (Factores: 2.5, 1.6, 1.2, 2.0)
     - `grams = Math.round(der / 3.8)`
     - `humanAge = Math.round(16 * Math.log(age) + 31)` (y `age * 15` para `< 1`)
     - Reglas de scoring y filtrado en `quiz-modal.js`.

---

## 5. Método de Verificación (Verification Method)

1. **Verificación de Compilación de Astro**:
   - Ejecutar en la raíz del proyecto:
     ```bash
     npm run build
     ```
   - Debe finalizar sin errores de sintaxis o importación.

2. **Verificación Funcional de Calculadoras**:
   - **CalculadoraComida**: Para peso = 10.0 kg y actividad "Adulto Actividad Estándar" (factor 1.6):
     - $\text{RER} = 70 \cdot (10.0)^{0.75} \approx 393.64 \text{ kcal}$.
     - $\text{DER} = 393.64 \cdot 1.6 \approx 629.82 \text{ kcal}$.
     - $\text{Gramos} = \text{Math.round}(629.82 / 3.8) = 166 \text{ gramos/día}$.
   - **CalculadoraEdad**: Para edad = 2.0 años:
     - $\text{Edad Humana} = \text{Math.round}(16 \cdot \ln(2.0) + 31) = \text{Math.round}(11.09 + 31) = 42 \text{ años}$.

3. **Condiciones de Invalidación**:
   - Si la porción de alimento difiere de los valores esperados por alteración de la fórmula o constante calórica (3.8 kcal/g).
   - Si la edad humana para 2 años da un valor distinto de 42.
   - Si el modal Quiz no abre al hacer clic en botones de WhatsApp o pierde los datos de catalogación de `window.FLUFFY_CATALOGO`.
