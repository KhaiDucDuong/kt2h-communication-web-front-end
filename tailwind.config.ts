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
        dark: {
          "10": "#121212",
          "9": "#1E1E1E",
          "8": "#232323",
          "7": "#252525",
          "6": "#272727",
          "5": "#2C2C2C",
          "4": "#2F2F2F",
          "3": "#333333",
          "2": "#353535",
          "1": "#383838",
        },
      },
    },
  },
  plugins: [],
};
export default config;
