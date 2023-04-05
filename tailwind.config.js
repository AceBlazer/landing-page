/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      current: "currentColor",
      white: "#fff",
      customBlack: "#111",
      customBg: "rgb(7, 18, 26)",
      primary: "rgb(11, 198, 227)",
      primaryHover: "rgb(19, 216, 246)",
      primaryText: "rgb(28, 29, 42)",
    },
    fontFamily: {
      arialNarrow: ["Spiegel", "Arial Narrow", "Arial", "sans-serif"],
      lolBold: ["BeaufortforLOL-Bold", "serif"],
      lolMedium: ["BeaufortforLOL-Medium", "serif"],
      lolRegular: ["BeaufortforLOL-Regular", "serif"],
      ffMarkBold: ["FF-Mark-Pro-Bold", "Arial", "sans-serif"],
      ffMarkMedium: ["FF-Mark-Pro-Medium", "Arial", "sans-serif"],
    },
    fontSize: {
      xs: "0.625rem",
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    extend: {
      backgroundImage: {
        tiles: "url('/images/tiles.png')",
      },
    },
    screens: {
      mobile: { max: "800px" },
    },
  },
  plugins: [],
};
