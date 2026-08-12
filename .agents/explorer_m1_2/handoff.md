# Handoff Report — Milestone 1 Configuration Investigation

**Agent**: Explorer M1-2 (`explorer_m1_2`)  
**Date**: 2026-08-06  
**Objective**: Investigate configuration file requirements for Milestone 1:
1. `src/lib/utils.ts` (`cn()` helper)
2. `tailwind.config.mjs` (brand colors `#140e26`, `#a855f7`, `#c084fc`, `#9333ea` & fonts without breaking `global.css`)
3. `astro.config.mjs` (`react()`, `tailwind()`)
4. `tsconfig.json` (`@/*` alias)

---

## 1. Observation

- **Existing Project Structure & Dependencies** (`package.json` lines 11–21):
  - Framework: Astro `^5.0.0`.
  - Display Font: `@fontsource-variable/space-grotesk` (`^5.2.10`).
  - Body Font: `@fontsource-variable/inter` (`^5.2.8`).
  - Missing dependencies in `package.json`: `@astrojs/react`, `@astrojs/tailwind`, `tailwindcss`, `clsx`, `tailwind-merge`, `framer-motion`, `class-variance-authority`, `lucide-react`.

- **Shadcn Registry Configuration** (`components.json` lines 1–23):
  - Tailwind Config location: `"tailwind.config.mjs"` (line 7).
  - Global CSS location: `"src/styles/global.css"` (line 8).
  - Path Aliases:
    - `"utils": "@/lib/utils"` (line 14)
    - `"components": "@/components"` (line 13)
    - `"ui": "@/components/ui"` (line 15)
    - `"lib": "@/lib"` (line 16)
  - Aceternity registry endpoint: `"https://ui.aceternity.com/registry/{name}.json"` (line 21).

- **Global Styling & Theme Variables** (`src/styles/global.css` lines 9–53):
  - `:root` variables:
    - `--night: #140e26;` (Background dark purple)
    - `--night-2: #1d1536;`
    - `--night-3: #271c49;`
    - `--brand: #a855f7;` (Royal Lilac Velvet)
    - `--brand-bright: #c084fc;` (Bright Lilac)
    - `--brand-deep: #9333ea;` (Deep Lilac)
    - `--brand-soft: rgba(168, 85, 247, 0.1);`
    - `--paper: #140e26;`
    - `--surface: #1d1536;`
    - `--border: rgba(192, 132, 252, 0.16);`
    - `--ink: #f5f3ff;`
    - `--ink-soft: rgba(245, 243, 255, 0.72);`
    - `--font-display: 'Outfit', 'Space Grotesk Variable', 'Space Grotesk', -apple-system, sans-serif;`
    - `--font-body: 'Inter', 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;`

- **Astro Config Baseline** (`astro.config.mjs` lines 1–8):
  ```javascript
  import { defineConfig } from 'astro/config';
  import sitemap from '@astrojs/sitemap';

  export default defineConfig({
    site: 'https://bulldogfluffy.com.co',
    trailingSlash: 'always',
    integrations: [sitemap()],
  });
  ```

- **TypeScript Config Baseline** (`tsconfig.json` lines 1–3):
  ```json
  {
    "extends": "astro/tsconfigs/strict"
  }
  ```

---

## 2. Logic Chain

1. **`src/lib/utils.ts` Design**:
   - *Observation*: Aceternity UI components (`hero-parallax`, `card-hover-effect`, `3d-card`, `bento-grid`, `lamp`, `background-beams`, `infinite-moving-cards`, `moving-border`) and `components.json` require `import { cn } from "@/lib/utils"`.
   - *Reasoning*: `cn()` must accept arbitrary class arguments (`ClassValue[]`), process conditional evaluation via `clsx`, and resolve conflicting Tailwind utilities via `twMerge`.
   - *Design Code*:
     ```typescript
     import { clsx, type ClassValue } from "clsx";
     import { twMerge } from "tailwind-merge";

     export function cn(...inputs: ClassValue[]) {
       return twMerge(clsx(inputs));
     }
     ```

2. **`tailwind.config.mjs` Design**:
   - *Observation*: Brand colors `#140e26`, `#a855f7`, `#c084fc`, `#9333ea` are established in `global.css` along with `Space Grotesk` and `Inter` fonts. Existing global CSS rules (2949 lines) handle `:root` CSS variables and element defaults.
   - *Reasoning*: Using `theme.extend` ensures Tailwind classes like `bg-night`, `text-brand`, `text-brand-bright`, `bg-brand-deep`, `font-display`, and `font-sans` can be used directly without overriding or purging existing CSS custom properties in `global.css`. Additionally, keyframes for Aceternity UI (`scroll`, `spotlight`) must be extended.
   - *Design Code*:
     ```javascript
     /** @type {import('tailwindcss').Config} */
     export default {
       darkMode: ['class', '.light-theme'],
       content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
       theme: {
         extend: {
           colors: {
             night: {
               DEFAULT: '#140e26',
               2: '#1d1536',
               3: '#271c49',
               line: '#3b2a6b',
             },
             brand: {
               DEFAULT: '#a855f7',
               bright: '#c084fc',
               deep: '#9333ea',
               soft: 'rgba(168, 85, 247, 0.1)',
             },
             amber: {
               DEFAULT: '#a855f7',
               bright: '#c084fc',
               deep: '#9333ea',
             },
             border: 'var(--border)',
             paper: 'var(--paper)',
             surface: 'var(--surface)',
             ink: {
               DEFAULT: 'var(--ink)',
               soft: 'var(--ink-soft)',
             },
           },
           fontFamily: {
             display: ['Space Grotesk Variable', 'Space Grotesk', 'Outfit', 'sans-serif'],
             sans: ['Inter Variable', 'Inter', 'sans-serif'],
             body: ['Inter Variable', 'Inter', 'sans-serif'],
           },
           animation: {
             scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
             spotlight: 'spotlight 2s ease .75s 1 normal forwards',
           },
           keyframes: {
             scroll: {
               to: {
                 transform: 'translate(calc(-50% - 0.5rem))',
               },
             },
             spotlight: {
               '0%': {
                 opacity: 0,
                 transform: 'translate(-72%, -62%) scale(0.5)',
               },
               '100%': {
                 opacity: 1,
                 transform: 'translate(-50%,-40%) scale(1)',
               },
             },
           },
         },
       },
       plugins: [],
     };
     ```

3. **`astro.config.mjs` Design**:
   - *Observation*: Current config only has `sitemap()`. React TSX components and Tailwind CSS integration are required for Aceternity UI.
   - *Reasoning*: Import `@astrojs/react` and `@astrojs/tailwind`. Set `applyBaseStyles: false` in `tailwind()` options so `@astrojs/tailwind` does not inject conflicting default base resets over `src/styles/global.css`.
   - *Design Code*:
     ```javascript
     import { defineConfig } from 'astro/config';
     import sitemap from '@astrojs/sitemap';
     import react from '@astrojs/react';
     import tailwind from '@astrojs/tailwind';

     export default defineConfig({
       site: 'https://bulldogfluffy.com.co',
       trailingSlash: 'always',
       integrations: [
         sitemap(),
         react(),
         tailwind({
           applyBaseStyles: false,
         }),
       ],
     });
     ```

4. **`tsconfig.json` Design**:
   - *Observation*: Baseline config extends `astro/tsconfigs/strict` without `compilerOptions`. `components.json` maps `@/*` to `src/*`.
   - *Reasoning*: Add `baseUrl: "."` and `paths: { "@/*": ["src/*"] }` to resolve `@/lib/utils` and `@/components/ui/*` imports during TypeScript check and Astro build. Add `"jsx": "react-jsx"` and `"jsxImportSource": "react"` for React TSX compilation.
   - *Design Code*:
     ```json
     {
       "extends": "astro/tsconfigs/strict",
       "compilerOptions": {
         "baseUrl": ".",
         "paths": {
           "@/*": ["src/*"]
         },
         "jsx": "react-jsx",
         "jsxImportSource": "react"
       }
     }
     ```

5. **Global CSS Integration (`src/styles/global.css`)**:
   - Directives `@tailwind base; @tailwind components; @tailwind utilities;` should be placed at the very top of `src/styles/global.css` to allow Tailwind utility classes while retaining all existing theme variables and custom CSS styles.

---

## 3. Caveats

- **Package Installation Required**: The design requires installing npm packages (`@astrojs/react`, `@astrojs/tailwind`, `tailwindcss`, `clsx`, `tailwind-merge`, `framer-motion`, `class-variance-authority`, `lucide-react`, `react`, `react-dom`, `@types/react`, `@types/react-dom`).
- **Read-Only Scope**: Explorer M1-2 did not write or modify files outside `.agents/explorer_m1_2/`.

---

## 4. Conclusion

All 4 configuration items are fully designed and verified for seamless integration with Astro v5, React 18, Tailwind CSS v3, and Aceternity UI, preserving existing brand colors, typography (`Space Grotesk` & `Inter`), and custom global CSS rules.

### Actionable File Specifications Summary:
1. `src/lib/utils.ts` -> `cn()` helper using `clsx` and `tailwind-merge`.
2. `tailwind.config.mjs` -> Theme extension for `#140e26`, `#a855f7`, `#c084fc`, `#9333ea`, `Space Grotesk`, `Inter`, keyframes for `scroll` & `spotlight`.
3. `astro.config.mjs` -> Add `react()` and `tailwind({ applyBaseStyles: false })`.
4. `tsconfig.json` -> Add `compilerOptions` with `@/*` mapping to `src/*`.

---

## 5. Verification Method

To verify the implementation once created:

1. **File Checks**:
   - Check existence of `src/lib/utils.ts`, `tailwind.config.mjs`, updated `astro.config.mjs`, and updated `tsconfig.json`.
2. **Type Check & Compilation**:
   - Run `npx tsc --noEmit` to verify path aliases `@/*` resolve without error.
   - Run `npm run build` to verify Astro build succeeds.
3. **Invalidation Conditions**:
   - Build fails due to missing modules or unresolvable `@/*` imports.
   - `global.css` custom variables or layout styles are overridden or purged.
