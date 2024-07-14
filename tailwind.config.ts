import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "dark-1000": "#121212",
        "dark-900": "#1E1E1E",
        "dark-800": "#232323",
        "dark-700": "#252525",
        "dark-600": "#272727",
        "dark-500": "#2C2C2C",
        "dark-400": "#2F2F2F",
        "dark-300": "#333333",
        "dark-200": "#353535",
        "dark-100": "#383838",
      },
      width: {
        "nav-width": "108px"
      },
    },
  },
  plugins: [],
};
export default config;
