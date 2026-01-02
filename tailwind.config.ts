import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Pastikan baris ini ada biar dia baca file di folder PAGES
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Pastikan baris ini ada biar dia baca file di folder COMPONENTS (di root)
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // 🔥 INI YANG PALING PENTING BUAT NEXT.JS APP ROUTER 🔥
    // Ini nyuruh Tailwind baca SEMUA file di dalam folder APP
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;