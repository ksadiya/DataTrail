/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep obsidian-wine background and surface tokens
        canvas: '#0B070D',
        surface: {
          DEFAULT: '#140C16',
          raised: '#1C1220',
          hover: '#26172B',
          border: '#331C38',
          subtle: '#241428',
        },
        // Premium Burgundy/Wine tones
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F9D0D9',
          300: '#F4A9B9',
          400: '#EC7793',
          500: '#DE456E',
          600: '#C72552',
          700: '#A41740',
          800: '#881638',
          900: '#731733',
          950: '#400718',
        },
        // Warm Cream / Editorial Parchment tones
        cream: {
          50: '#FFFFFF',
          100: '#FBF7EE',
          200: '#F5EEDC',
          300: '#EBE2D0',
          400: '#D5C7B2',
          500: '#B8A68F',
          600: '#8E7B67',
          700: '#695A4B',
          800: '#493E34',
          900: '#2C251F',
        },
        // Teal / Precision Investigative Cyan tones
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Honesty badge tokens
        badge: {
          stated: '#10B981',
          'stated-bg': '#062B1E',
          'stated-border': '#0E6245',
          vague: '#F59E0B',
          'vague-bg': '#2E1D05',
          'vague-border': '#784708',
          missing: '#716474',
          'missing-bg': '#1E1720',
          'missing-border': '#3D3141',
          interpret: '#E11D48',
          'interpret-bg': '#330815',
          'interpret-border': '#73132F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        serif: ['Georgia', 'Cambria', 'serif'],
      }
    },
  },
  plugins: [],
}
