/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryOrange: "#FC4F00",
        textSecondary: "#A3A3A3",
        backgroundSecondary: "#F8F8F8",
        borderPrimary: "#9D9D9D"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
