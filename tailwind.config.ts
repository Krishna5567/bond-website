import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#004D2C',
          dark: '#00381F',
          deep: '#064E3B',
          light: '#006341',
        },
        emerald: {
          DEFAULT: '#00A86B',
          glow: '#10B981',
          light: '#34D399',
        },
        mint: {
          DEFAULT: '#E8F5E9',
          border: '#C8E6C9',
          dark: '#A5D6A7',
        },
        bond: {
          forest: '#004D2C',
          emerald: '#00A86B',
          mint: '#E8F5E9',
          canvas: '#F4F7F5',
          darkPill: '#141D17',
          black: '#0D1117',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
