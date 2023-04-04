/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      customBlack: "#111",
      customBg: "rgb(7, 18, 26)",
      primary: "rgb(11, 198, 227)",
      primaryHover: "rgb(19, 216, 246)",
    },
    fontFamily: {
      arialNarrow: ["Spiegel", "Arial Narrow", "Arial", "sans-serif"],
      lolBold: ["BeaufortforLOL-Bold", "serif"],
      lolMedium: ["BeaufortforLOL-Medium", "serif"],
      lolRegular: ["BeaufortforLOL-Regular", "serif"],
      ffMarkBold: ["FF-Mark-Pro-Bold", "Arial", "sans-serif"],
      ffMarkMedium: ["FF-Mark-Pro-Medium", "Arial", "sans-serif"],
    },

    extend: {},
  },
  plugins: [],
};
