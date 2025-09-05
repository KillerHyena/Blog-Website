/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3C1361',   // Gothic Purple
        secondary: '#1C1C1C', // Charcoal Black
        accent: '#9B1C31',    // Blood Red
        muted: '#A1A1AA',     // Soft Gray
        neutral: '#000000',   // Pure Black
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        gothic: ['Cinzel Decorative', 'serif'], // for headings
      },
    },
  },
  plugins: [flowbite, tailwindScrollbar],
};
