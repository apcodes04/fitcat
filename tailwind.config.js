/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fitcat: {
          green: "#1B4D36",
          darkgreen: "#123625",
          lightgreen: "#255B41",
          cream: "#F7F3E9",
          beige: "#EFEAD8",
          gold: "#D4A359",
          text: "#132E21",
          cardBg: "#215238",
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
