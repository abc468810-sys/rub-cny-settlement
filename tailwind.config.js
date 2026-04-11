/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,tsx,jsx,mdx}",
    "./src/components/**/*.{js,ts,tsx,jsx,mdx}",
    "./src/app/**/*.{js,ts,tsx,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
