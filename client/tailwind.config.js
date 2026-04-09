/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#6366F1", // Indigo
        background: "#0F172A", // Dark Slate
        card: "#1E293B", // Darker Slate
        border: "#334155",
        textPrimary: "#F1F5F9",
        textMuted: "#94A3B8",
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
