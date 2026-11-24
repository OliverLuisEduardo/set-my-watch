/** @type {import('tailwindcss').Config} */
// Folha técnica de calibre. As cores vêm das variáveis de tema em index.css
// (data-tema="folha" | "bancada"), então cada classe serve aos dois temas.
const cor = (nome) => `rgb(var(--c-${nome}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        papel: cor('papel'),
        folha: cor('folha'),
        tinta: { DEFAULT: cor('tinta'), 2: cor('tinta-2') },
        construcao: cor('construcao'),
        revisao: { DEFAULT: cor('revisao'), texto: cor('revisao-texto') },
      },
      fontFamily: {
        sans: ['"Barlow Semi Condensed"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Cantos de gabarito de desenho: arredondados, nunca pílula.
        gabarito: '0.875rem',
      },
      transitionTimingFunction: {
        'saida-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
