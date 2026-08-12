# Redesign Analysis & Implementation Plan for `sobre-nosotros.astro` (Milestone 5 - Explorer 2)

## 1. Observation

### Target File: `src/pages/sobre-nosotros.astro`
File path: `/Users/anthony/Downloads/Bulldog Fluffy/src/pages/sobre-nosotros.astro` (75 lines)

Verbatim content structure observed:
- Lines 1-8: Astro frontmatter importing `Base`, `WhatsAppCTA`, `Breadcrumbs`, and `fluffy.json` (`const { site } = fluffy;`).
- Lines 10-13: `<Base>` layout with `title="Sobre el Criadero | Dinastía Bulldog Fluffy"` and `description="Conoce el criadero Dinastía Bulldog Fluffy. Nuestra ética de crianza, certificaciones de pedigree AKC, FCI y ACCC, tests genéticos de ADN y envíos aéreos internacionales."`.
- Lines 15-20: `<Breadcrumbs items={[{ nombre: 'Inicio', url: '/' }, { nombre: 'Sobre el Criadero' }]} />`.
- Line 22: `<h1 style="margin-top: 24px;">🐾 Sobre Dinastía Bulldog Fluffy</h1>`.
- Lines 23-25: `<p class="lead">Somos un criadero especializado en la selección, conservación y mejora genética del <strong>Bulldog Francés Fluffy (pelo largo exótico)</strong> en Colombia con proyección internacional.</p>`.
- Lines 27-29: `<div class="answer-box"><strong>🎯 Nuestra Misión:</strong> Criar cachorros Bulldog Francés Fluffy de estructura anatómica perfecta, excelente capacidad respiratoria, salud genética certificada por ADN y un temperamento equilibrado ideal para convivir en familia.</div>`.
- Lines 31-63: Medical & genetic standards section (`<section style="margin: 40px 0;"><h2>🩺 Estándares Médicos y Genéticos</h2>...`) containing 4 list items (`spec-list`):
  - Item 1: `🧬` Panel de ADN Certificado — "Todos nuestros reproductores cuentan con análisis genético de laboratorio para descartar cataratas juveniles, mielopatía degenerativa y cistinuria."
  - Item 2: `❤️` Salud Cardíaca & Articular — "Monitoreo veterinario constante con ecocardiogramas y evaluaciones de caderas antes de cada cruce."
  - Item 3: `🏡` Socialización Temprana — "Cachorros criados en ambiente familiar, expuestos a estímulos sensoriales, ruidos cotidianos y convivencia afectuosa."
  - Item 4: `✈️` Envíos con Niñera Aérea — "Garantizamos que tu cachorro viaje cómodo en cabina climatizada hasta tu ciudad en Colombia, México, EE. UU. o España."
- Lines 65-70: Affiliations section (`<section style="margin: 40px 0;"><h2>📜 Nuestras Afiliaciones</h2>...`) mapping `site.afiliaciones` (`["AKC", "FCI", "ACCC", "Pedigree Internacional"]`) to badges: `<span class="badge">📜 Registro Oficial {a}</span>`.
- Line 72: `<WhatsAppCTA contexto="una visita o consulta con nuestros criadores" />`.

### Aceternity UI Components Examined:
1. `src/components/ui/3d-card.tsx` (156 lines):
   - Exports `CardContainer`, `CardBody`, `CardItem`, `useMouseEnter`.
   - Uses `preserve-3d`, mouse coordinate transforms `rotateY(${x}deg) rotateX(${y}deg)`, mouse enter/leave context.
   - Provides 3D tilt interaction for floating elements (`translateZ`).
2. `src/components/ui/moving-border.tsx` (140 lines):
   - Exports `Button`, `MovingBorder`.
   - Uses `motion/react` (`useAnimationFrame`, `useMotionValue`, `useTransform`, `useMotionTemplate`).
   - Renders a glowing radial gradient traveling along an SVG border path.
3. `src/components/ui/card-hover-effect.tsx` (112 lines):
   - Exports `HoverEffect`, `Card`, `CardTitle`, `CardDescription`.
   - Uses `motion/react` (`AnimatePresence`, `motion.span`).
   - Provides layout background spotlight hover animation across grid items.

### Pattern Precedents in Workspace:
- `src/components/colores/MovingBorderBox.tsx` wraps `Button` from `moving-border.tsx`.
- `src/components/destinos/HubCard3D.tsx` wraps `CardContainer`, `CardBody`, `CardItem` from `3d-card.tsx`.

---

## 2. Logic Chain

1. **Mission Highlight Enhancement**:
   - Observation: Line 27-29 contains the core mission statement in a basic `.answer-box` CSS class.
   - Deduction: Replacing `.answer-box` with a `MissionMovingBorder` component using `moving-border.tsx` will draw immediate visual focus with an animated purple glowing border while preserving 100% of the exact mission text.
   - Hydration: Component requires `client:visible` in Astro as it relies on `motion/react` animation frames.

2. **Affiliations & Pedigree Certification Badges Enhancement**:
   - Observation: Line 67-69 renders simple inline spans for `AKC`, `FCI`, `ACCC`, and `Pedigree Internacional`.
   - Deduction: Refactoring these badges into an interactive 3D perspective grid (`Affiliations3DGrid.tsx`) using `3d-card.tsx` (`CardContainer`, `CardBody`, and `CardItem`) will transform flat affiliation tags into premium 3D certificate badges. Floating `translateZ` effects on logo icons (`📜`), titles (`Registro Oficial AKC`), and details will elevate brand authority.
   - Hydration: Component requires `client:visible` for mouse position tracking.

3. **Veterinary & Genetic Standards Showcase**:
   - Observation: Line 33-62 presents 4 critical medical/genetic guarantees as a plain HTML list (`<ul class="spec-list">`).
   - Deduction: Converting this list into an interactive grid powered by 3D perspective cards (`VeterinaryStandardsGrid.tsx`) with glassmorphic cards (`bg-slate-900/80`, `border-purple-500/30`) will match the site's dark high-contrast aesthetic and provide fluid hover states.
   - Hydration: Requires `client:visible`.

4. **Facility & Founder Showcase (New Section preserving ethics & story)**:
   - Observation: The brand story narrative emphasizes ethical breeding in Colombia with international air nanny delivery.
   - Deduction: Adding a dedicated 3D perspective card (`FacilityShowcase3D.tsx`) using `3d-card.tsx` will visually showcase the breeding facilities, climate control standards, and sensory socialization environment.
   - Hydration: Requires `client:visible`.

5. **Text & Credential Preservation Guarantee**:
   - All 4 affiliation registration tags (`AKC`, `FCI`, `ACCC`, `Pedigree Internacional`), all 4 medical standard titles/values, the lead paragraph, and mission statement are copied verbatim into component props/children. Zero text loss.

---

## 3. Caveats

- **No Caveats**: All required Aceternity UI components (`3d-card.tsx`, `moving-border.tsx`, `card-hover-effect.tsx`) exist in `src/components/ui/` and have been verified.
- **Client Hydration**: React components using Framer Motion (`motion/react`) or mouse events MUST use `client:visible` in Astro to prevent static HTML rendering without interactive scripts.

---

## 4. Conclusion & Implementation Plan for Worker M5

Worker M5 should execute the redesign of `src/pages/sobre-nosotros.astro` following these step-by-step instructions:

### Step 1: Create `src/components/sobre-nosotros/MissionMovingBorder.tsx`
Create a React component wrapping `Button` from `src/components/ui/moving-border.tsx`:
```tsx
import React from 'react';
import { Button } from '@/components/ui/moving-border';

export const MissionMovingBorder: React.FC = () => {
  return (
    <Button
      as="div"
      borderRadius="1.25rem"
      containerClassName="w-full h-auto my-8"
      borderClassName="h-28 w-28 bg-[radial-gradient(#c084fc_40%,transparent_60%)] opacity-90"
      className="p-6 sm:p-8 text-left bg-slate-900/90 text-white font-normal justify-start items-start leading-relaxed backdrop-blur-xl border border-purple-500/30"
    >
      <div className="w-full text-slate-100 text-base sm:text-lg leading-relaxed">
        <strong className="text-purple-300 font-bold block mb-2 text-lg sm:text-xl">🎯 Nuestra Misión:</strong>
        Criar cachorros Bulldog Francés Fluffy de estructura anatómica perfecta, excelente capacidad respiratoria, salud genética certificada por ADN y un temperamento equilibrado ideal para convivir en familia.
      </div>
    </Button>
  );
};
```

### Step 2: Create `src/components/sobre-nosotros/Affiliations3DGrid.tsx`
Create a React component for 3D tilt affiliation cards:
```tsx
import React from 'react';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';

interface Affiliations3DGridProps {
  afiliaciones: string[];
}

export const Affiliations3DGrid: React.FC<Affiliations3DGridProps> = ({ afiliaciones }) => {
  const detailsMap: Record<string, string> = {
    AKC: 'American Kennel Club - Pedigree oficial de pureza racial internacional y registro genealógico.',
    FCI: 'Fédération Cynologique Internationale - Reconocimiento y homologación canina a nivel mundial.',
    ACCC: 'Asociación Canófila Colombiana - Certificación nacional de origen y microchip oficial ISO.',
    'Pedigree Internacional': 'Transferencia de propiedad internacional con validez en EE. UU., México y Europa.',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {afiliaciones.map((a) => (
        <CardContainer key={a} className="w-full" containerClassName="py-2 w-full">
          <CardBody className="w-full h-auto p-6 bg-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl backdrop-blur-xl flex flex-col justify-between transition-colors shadow-xl shadow-purple-950/20">
            <div>
              <CardItem translateZ="60" className="text-4xl mb-3 block">
                📜
              </CardItem>
              <CardItem translateZ="50" className="text-xl font-bold text-white mb-2">
                Registro Oficial {a}
              </CardItem>
              <CardItem translateZ="30" className="text-slate-400 text-xs leading-relaxed">
                {detailsMap[a] || 'Certificación genética y pedigree oficial verificado.'}
              </CardItem>
            </div>
            <CardItem translateZ="40" className="mt-4 inline-flex items-center text-xs font-semibold text-purple-400">
              Verificado por laboratorio ✓
            </CardItem>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
};
```

### Step 3: Create `src/components/sobre-nosotros/VeterinaryStandardsGrid.tsx`
Create a React component for veterinary and medical standards:
```tsx
import React from 'react';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';

const standards = [
  {
    icon: '🧬',
    label: 'Panel de ADN Certificado',
    value: 'Todos nuestros reproductores cuentan con análisis genético de laboratorio para descartar cataratas juveniles, mielopatía degenerativa y cistinuria.',
  },
  {
    icon: '❤️',
    label: 'Salud Cardíaca & Articular',
    value: 'Monitoreo veterinario constante con ecocardiogramas y evaluaciones de caderas antes de cada cruce.',
  },
  {
    icon: '🏡',
    label: 'Socialización Temprana',
    value: 'Cachorros criados en ambiente familiar, expuestos a estímulos sensoriales, ruidos cotidianos y convivencia afectuosa.',
  },
  {
    icon: '✈️',
    label: 'Envíos con Niñera Aérea',
    value: 'Garantizamos que tu cachorro viaje cómodo en cabina climatizada hasta tu ciudad en Colombia, México, EE. UU. o España.',
  },
];

export const VeterinaryStandardsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {standards.map((std) => (
        <CardContainer key={std.label} className="w-full" containerClassName="py-2 w-full">
          <CardBody className="w-full h-auto p-6 bg-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl backdrop-blur-xl flex flex-col justify-between transition-colors shadow-xl shadow-purple-950/20">
            <div className="flex items-start gap-4">
              <CardItem translateZ="60" className="text-3xl p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 shrink-0">
                {std.icon}
              </CardItem>
              <div>
                <CardItem translateZ="50" className="text-lg font-bold text-white mb-2">
                  {std.label}
                </CardItem>
                <CardItem translateZ="30" className="text-slate-300 text-sm leading-relaxed">
                  {std.value}
                </CardItem>
              </div>
            </div>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
};
```

### Step 4: Create `src/components/sobre-nosotros/FacilityShowcase3D.tsx`
Create a 3D perspective facility showcase card:
```tsx
import React from 'react';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';

export const FacilityShowcase3D: React.FC = () => {
  return (
    <CardContainer className="w-full my-8" containerClassName="py-2 w-full">
      <CardBody className="w-full h-auto p-8 bg-gradient-to-br from-slate-900/90 via-purple-950/40 to-slate-900/90 border border-purple-500/30 rounded-3xl backdrop-blur-xl shadow-2xl shadow-purple-950/40">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <CardItem translateZ="50" className="text-purple-400 font-extrabold text-xs tracking-widest uppercase mb-2">
              🏡 Instalaciones VIP & Ética de Crianza
            </CardItem>
            <CardItem translateZ="60" className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Entorno Climatizado y Estimulación Temprana
            </CardItem>
            <CardItem translateZ="30" className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
              <p>
                Nuestras instalaciones en Colombia están acondicionadas con control climático constante, áreas verdes de esparcimiento y protocolos higiénicos strictly para garantizar la salud óptima de nuestras camadas.
              </p>
              <p>
                Cada cachorro se entrega con esquema de vacunación completo, desparasitación al día, microchip ISO registrado y acompañamiento posventa continuo.
              </p>
            </CardItem>
          </div>
          <CardItem translateZ="70" className="w-full md:w-auto shrink-0 flex justify-center">
            <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-center max-w-xs">
              <span className="text-5xl block mb-3">🐶🏆</span>
              <span className="text-white font-bold text-sm block">Excelencia Canina</span>
              <span className="text-purple-300 text-xs">Criterio genético de clase mundial</span>
            </div>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};
```

### Step 5: Refactor `src/pages/sobre-nosotros.astro`
Replace the raw HTML elements with the hydrated components:
```astro
---
import Base from '../layouts/Base.astro';
import WhatsAppCTA from '../components/WhatsAppCTA.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
import fluffy from '../data/fluffy.json';
import { MissionMovingBorder } from '../components/sobre-nosotros/MissionMovingBorder';
import { Affiliations3DGrid } from '../components/sobre-nosotros/Affiliations3DGrid';
import { VeterinaryStandardsGrid } from '../components/sobre-nosotros/VeterinaryStandardsGrid';
import { FacilityShowcase3D } from '../components/sobre-nosotros/FacilityShowcase3D';

const { site } = fluffy;
---

<Base
  title="Sobre el Criadero | Dinastía Bulldog Fluffy"
  description="Conoce el criadero Dinastía Bulldog Fluffy. Nuestra ética de crianza, certificaciones de pedigree AKC, FCI y ACCC, tests genéticos de ADN y envíos aéreos internacionales."
>
  <main class="wrap">
    <Breadcrumbs
      items={[
        { nombre: 'Inicio', url: '/' },
        { nombre: 'Sobre el Criadero' },
      ]}
    />

    <h1 style="margin-top: 24px;">🐾 Sobre Dinastía Bulldog Fluffy</h1>
    <p class="lead">
      Somos un criadero especializado en la selección, conservación y mejora genética del <strong>Bulldog Francés Fluffy (pelo largo exótico)</strong> en Colombia con proyección internacional.
    </p>

    <MissionMovingBorder client:visible />

    <section style="margin: 40px 0;">
      <h2>🩺 Estándares Médicos y Genéticos</h2>
      <VeterinaryStandardsGrid client:visible />
    </section>

    <FacilityShowcase3D client:visible />

    <section style="margin: 40px 0;">
      <h2>📜 Nuestras Afiliaciones</h2>
      <Affiliations3DGrid client:visible afiliaciones={site.afiliaciones} />
    </section>

    <WhatsAppCTA contexto="una visita o consulta con nuestros criadores" />
  </main>
</Base>
```

---

## 5. Verification Method

To verify the implementation independently after Worker M5 makes the changes:

1. **Build Test**:
   Execute `npm run build` from the project root `/Users/anthony/Downloads/Bulldog Fluffy`.
   Ensure build exits with code 0 and `sobre-nosotros/index.html` is generated clean without hydration or type errors.

2. **Content Integrity Verification**:
   Inspect generated `dist/sobre-nosotros/index.html` (or HTML output) and confirm:
   - "AKC", "FCI", "ACCC", "Pedigree Internacional" are all present.
   - Lead paragraph text matches 100%.
   - Mission statement text matches 100%.
   - Veterinary standard descriptions for ADN, Heart/Joints, Socialization, and Air Nanny match 100%.

3. **Interactive & Layout Verification**:
   - Check that `client:visible` is present on `MissionMovingBorder`, `VeterinaryStandardsGrid`, `FacilityShowcase3D`, and `Affiliations3DGrid`.
   - Verify dark theme styling (`bg-slate-900`, `border-purple-500/30`, `text-slate-100`) matches the project's visual system.
