/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    fontFamily: {
      display: ["Helvetica"],
      body: ['"system-ui"'],
      head: ["Source Sans Pro", "sans-serif"],
      numbers: ["Lato", "sans-serif"],
    },
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      textShadow: {
        default: "0 2px 5px rgba(0, 0, 0, 0.5)",
        lg: "0 2px 10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  content: ["./client/**/*.html", "./client/**/*.js", "./client/**/*.jsx"],

  plugins: [require("tailwindcss-textshadow")],
};
