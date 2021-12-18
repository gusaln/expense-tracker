const { charcoal, paper, paperLight, paperDark } = require("./src/colors");

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // original gray-50
        "paper-light": paperLight,
        // original gray-100
        paper: paper,
        "paper-dark": paperDark,
        charcoal: charcoal,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}