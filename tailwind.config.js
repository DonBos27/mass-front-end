const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require('tailwindcss/colors');

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F26522",
        secondary: "#2E1A46",
      },
    },
  },
  plugins: [],
});