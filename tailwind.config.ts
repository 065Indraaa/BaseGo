import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Your existing paths
    "./node_modules/@coinbase/onchainkit/**/*.{js,ts,jsx,tsx}" // <--- ADD THIS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;