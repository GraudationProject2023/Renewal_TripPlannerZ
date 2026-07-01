import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./{app,entities,features,pages,shared,widgets}/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      width: {
        "template-width": "720px",
      },
      height: {
        "template-height": "calc(100vh - 3.5rem)",
      },
    },
  },
  safelist: [],
};

export default config;
