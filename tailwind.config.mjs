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
