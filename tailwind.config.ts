import type { Config } from "tailwindcss";

const config: Config = {
  // BAGIAN INI YANG PALING PENTING
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      // Scan semua file di folder app
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",    // Scan folder pages (jika ada)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scan folder components (jika ada)
    "./src/**/*.{js,ts,jsx,tsx,mdx}",      // Jaga-jaga jika kamu pakai folder src
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
export default config;