import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Pastikan baris-baris ini ada dan sesuai struktur foldermu:
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <--- PENTING untuk App Router
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // <--- Kalau pakai folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;