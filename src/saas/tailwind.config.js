/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf7f0",
          100: "#d3ecdd",
          200: "#a8d9bc",
          300: "#74c096",
          400: "#43a271",
          500: "#1F7A4D",
          600: "#186540",
          700: "#155235",
          800: "#12422c",
          900: "#0f3624",
        },
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
        },
        line: "#E2E8F0",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        info: "#2563EB",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        pop: "0 4px 16px -2px rgba(15, 23, 42, 0.10), 0 2px 6px -2px rgba(15, 23, 42, 0.08)",
        focus: "0 0 0 3px rgba(31, 122, 77, 0.15)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};
